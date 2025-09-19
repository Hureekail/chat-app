import { BiCheck } from "react-icons/bi"; 
import { BiCheckDouble } from "react-icons/bi"; 
import { AiOutlineSearch } from "react-icons/ai"; 
import "../styles/chats.css";

const ChatList = ({ dialogs = [], onOpenChat }) => {

    return (
        <div className="max-h-170 overflow-y-auto">
            <div className="container bg-gray-200 dark:bg-black p-4 flex justify-center">
                <div className="box">
                    <form name="search">
                        <input type="text" className="search-input"/>
                    </form>
                    <i><AiOutlineSearch className="w-8 h-8"/></i>
                </div>
            </div>
            <ul>
                {dialogs.map((dialog) => (
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
                ))}
            </ul>
                <pre>{JSON.stringify(dialogs, null, 2)}</pre>
        </div>
    )
}
export default ChatList