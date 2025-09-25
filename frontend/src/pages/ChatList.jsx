import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BiCheck } from "react-icons/bi"; 
import { BiCheckDouble } from "react-icons/bi"; 
import { AiOutlineSearch } from "react-icons/ai"; 
import { RxCross2 } from "react-icons/rx";
import "../styles/chats.css";
import "../styles/searchBar.css";
import api from "../api";


const ChatList = ({ dialogs = [], onOpenChat, onCreateChat }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermResult, setSearchTermResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const term = searchTerm.trim();
        if (term.length === 0 || term.length < 3) {
            setSearchTermResult([]);
            setLoading(false);
            return;
        }

        const currentTerm = term;
        setLoading(true);
        const timeout = setTimeout(() => {
            api.get(`/api/search-users/?username=${encodeURIComponent(currentTerm)}`)
                .then((res) => {
                    if (currentTerm !== searchTerm.trim()) return;
                    setSearchTermResult(res.data || []);
                })
                .catch(() => {
                    if (currentTerm !== searchTerm.trim()) return;
                    setSearchTermResult([]);
                })
                .finally(() => {
                    if (currentTerm === searchTerm.trim()) setLoading(false);
                });
        }, 700); // debounce delay

        return () => clearTimeout(timeout);
    }, [searchTerm]);
    
    return (
        <div className="max-h-170 overflow-y-auto">
            <div className="container bg-gray-200 dark:bg-black p-4 flex justify-center">
                <div className={`box ${searchTerm ? 'active' : ''}`}>
                    <form name="search">
                        <input
                            type="text"
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            ref={inputRef}
                        />
                    </form>
                    <i
                        role="button"
                        aria-label={searchTerm ? 'Clear search' : 'Search'}
                        onClick={() => {
                            if (searchTerm) {
                                setSearchTerm("");
                                setSearchTermResult([]);
                                inputRef.current?.focus();
                            }
                        }}
                    >
                        <span className="icon-wrapper">
                            <AiOutlineSearch className="w-8 h-8 icon search-icon" />
                            <RxCross2 className="w-8 h-8 icon clear-icon cursor-pointer" />
                        </span>
                    </i>
                </div>
            </div>
            {loading && <div className="text-center text-gray-500">Loading...</div>}
            {searchTerm ? (
                <div>
                    <ul>
                        {searchTermResult.map((user) => (
                            <li key={user.pk} onClick={() => onCreateChat?.(user)} className="chat flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-900 hover:bg-gray-100 active:bg-gray-100 active:scale-95 transition-transform duration-200" >
                                <img
                                    src={
                                        user.photo ||
                                        "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.username[0])
                                    }
                                    alt="User avatar"
                                    className="w-12 h-12 rounded-full object-cover bg-gray-200 m-3"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between mr-3">
                                        <div className="">{user.username}</div>
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-0.5 px-3 mr-3 rounded-full">
                                            send message
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )
            : 
            <ul>
                {dialogs.map((dialog) => (
                    dialog.last_message ? (
                        <li key={dialog.id} onClick={() => onOpenChat?.(dialog.id)} className="chat flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-900 hover:bg-gray-100 active:bg-gray-100 active:scale-95 transition-transform duration-200" >
                            <img
                                src={
                                    dialog.photo ||
                                    "https://ui-avatars.com/api/?name=" + encodeURIComponent(dialog.username[0])
                                }
                                alt="User avatar"
                                className="w-12 h-12 rounded-full object-cover bg-gray-200 m-3"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between mr-3">
                                    <div className="">{dialog.username}</div>
                                    <div className="flex justify-between">
                                        <div>
                                            {dialog.other_user_id === dialog.last_message.sender ? (
                                                !dialog.last_message.read ? 
                                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold mr-2">
                                                        {dialog.unread_count}
                                                    </div>
                                                : null
                                            ) : (
                                                dialog.last_message.read === true ? 
                                                    <div>
                                                        <BiCheckDouble className="w-6 h-6 text-blue-500"/>
                                                    </div>
                                                : 
                                                    <div>
                                                        <BiCheck className="w-6 h-6 text-gray-400"/>
                                                    </div>
                                            )}
                                        </div>
                                        <div className="text-gray-500">
                                            {dialog.last_message.sent
                                                ? new Date(dialog.last_message.sent * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : ""}
                                        </div>
                                    </div>
                                </div>

                            <div className="text-sm text-gray-600 dark:text-white">
                                {dialog.last_message.text}
                            </div>
                            </div>
                        </li>
                    ) : null
                ))}
            </ul>
            }
        </div>
    )
}
export default ChatList