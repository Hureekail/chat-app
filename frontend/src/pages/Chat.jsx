import { useEffect, useMemo, useState, useRef } from "react";
import { MdArrowBackIos, MdSend } from "react-icons/md";
import { BiCheck } from "react-icons/bi"; 
import { BiCheckDouble } from "react-icons/bi"; 
import "../styles/chats.css";


const Chat = ({ dialog, messages = [], onSendMessage, onClose }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => (a.sent || 0) - (b.sent || 0));
  }, [messages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    

    onSendMessage(dialog.other_user_id, trimmed);
    setMessage("");
  };

  const avatarUrl = "https://ui-avatars.com/api/?name=" + encodeURIComponent(dialog.username[0]);

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
                {dialog.last_message && dialog.last_message.out ?
                  <div className="text-gray-500">last seen recently</div>
                  :
                  <div className="text-blue-400">Online</div>
                }
            </div>
        </div>

        <img src={avatarUrl} alt="User avatar" className="w-12 h-12 rounded-full object-cover bg-gray-200" />

      </div>
      <div className="flex-1 overflow-y-auto">
        {messages && Array.isArray(messages) && messages.length > 0 ? (
          <div className="flex flex-col gap-2 p-4">
            {sortedMessages.map((msg) => (
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
                          <span className="metadata">
                            <span className="time">
                              {msg.sent
                              ? new Date(msg.sent * 1000).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                              </span>
                              <span className="tick">{
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

              {/* scroll target */}
              <div ref={messagesEndRef} />
          </div>
          
        ) : (
          <div className="flex items-center justify-center h-64">
            <span className="text-center text-gray-400 text-lg">
              No messages yet
            </span>
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