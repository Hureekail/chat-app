import { BiCheck } from "react-icons/bi"; 
import { BiCheckDouble } from "react-icons/bi"; 
import api from "../api";
import { useEffect, useState } from "react";


const ChatList = ({ onOpenChat }) => {
    const [dialogs, setDialogs] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        api.get("api/dialogs/") 
        .then((res) => {   
            const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setDialogs(items);         
            setLoading(false);           
          })
          .catch((err) => {
            setError(err);
            setLoading(false);
          });
      }, []);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="max-h-170 overflow-y-auto">
            <ul className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                {dialogs.map((dialog) => (
                    <li key={dialog.id} onClick={() => onOpenChat?.(dialog.id)} className="flex items-center gap-3 py-2 border-b last:border-b-0 active:scale-95 transition-transform duration-100" >
                        <img
                            src={dialog.photo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(dialog.username)}
                            alt="User avatar"
                            className="w-12 h-12 rounded-full object-cover bg-gray-200 m-3"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between mr-3">
                                <div className="">{dialog.username}</div>
                                <div className="flex justify-between">
                                    <div>
                                        {dialog.other_user_id === dialog.last_message.sender ? (
                                            <div>
                                                hello
                                            </div>
                                        ) : (
                                            dialog.last_message.read === true ? 
                                                <div>
                                                    <BiCheckDouble className="w-6 h-6" color="blue"/>
                                                </div>
                                            : 
                                                <div>
                                                    <BiCheck className="w-6 h-6" color="grey"/>
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

                        <div className="text-sm text-gray-600">
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