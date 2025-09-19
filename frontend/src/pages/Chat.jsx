import { useState } from "react";
import { MdArrowBackIos, MdSend } from "react-icons/md"; 


const Chat = ({ dialog, onClose }) => {
  const [message, setMessage] = useState("");

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

        <div onClick={onClose} className="flex items-center text-blue-400 active:text-blue-200">
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
        {/* Chat content goes here */}
      </div>
      <div className="p-3 bg-transperent">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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


