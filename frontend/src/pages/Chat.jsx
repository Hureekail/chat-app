import { useState, useEffect } from "react";
import { MdArrowBackIos, MdSend } from "react-icons/md";
import { BiCheck } from "react-icons/bi"; 
import { BiCheckDouble } from "react-icons/bi"; 
import api from "../api";
import "../styles/chats.css";

const Chat = ({ dialog, onClose }) => {
  const [message, setMessage] = useState("");
  const [loadMessages, setLoadMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`api/messages/${dialog.other_user_id}/`)
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setLoadMessages(items);         
        setLoading(false);        
        console.log(loadMessages)   
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [dialog.other_user_id]);
  console.log(loadMessages)
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    // TODO: integrate with send message action/WS
    // For now, just clear the input
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[100dvh]">
      <div className="container bg-gray-200 flex items-center justify-between p-3">

        <div onClick={onClose} className="flex items-center text-blue-400 active:text-blue-300">
            <MdArrowBackIos className="w-5 h-5 flex-shrink-0"/>
            Back
        </div>
        
        <div className="flex flex-col items-center justify-center">
            <div className="font-semibold">{dialog.username}</div>
            <div>
                {dialog.last_message.out ?
                <div className="text-gray-500">last seen recently</div>
                :
                <div className="text-blue-400">Online</div>
                }
            </div>
        </div>

        <img
          src={dialog.photo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(dialog.username[0])}
          alt="User avatar"
          className="w-12 h-12 rounded-full object-cover bg-gray-200"
        />

      </div>
      <div className="flex-1 overflow-y-auto">
        {loadMessages && Array.isArray(loadMessages) && loadMessages.length > 0 ? (
          <div className="flex flex-col gap-2 p-4">
            {[...loadMessages]
              .sort((a, b) => (a.sent || 0) - (b.sent || 0))
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.out ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`${
                      msg.out
                        ? "message sent"
                        : "message received"
                    }`}
                  >
                    <div className="flex flex-row">
                      <div className="flex items-end w-full">
                        <span className="flex-1 whitespace-pre-line">
                          {msg.text}
                          <span class="metadata">
                            <span class="time">
                              {msg.sent
                              ? new Date(msg.sent * 1000).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                              </span>
                              <span class="tick">{
                              msg.out
                                ? (msg.read
                                    ? <BiCheckDouble className="w-4 h-4 text-blue-500" />
                                    : <BiCheck className="w-4 h-4 text-gray-400" />)
                                : null
                              }
                              </span>
                          </span>
                          
                        </span>
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
          </div>
          
        ) : (
          <div className="text-center text-gray-400 mt-8">
            No messages yet<br/>
            Нет сообщений<br/>
            Немає повідомлень
          </div>
        )}
      </div>
      <div className="p-3 bg-transperent">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-80 rounded-lg"
          />
          <button
            type="submit"
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full"
          >
            <MdSend className="w-5 h-5" />
            Send
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default Chat;