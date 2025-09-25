import { useEffect, useMemo, useState, useRef } from "react";
import { MdArrowBackIos, MdSend } from "react-icons/md";
import { BiCheck } from "react-icons/bi"; 
import { BiCheckDouble } from "react-icons/bi"; 
import api from "../api";
import "../styles/chats.css";

// WebSocket message types
const MSG_TEXT = 3;
const MSG_FILE = 4;
const MSG_READ = 6;
const MSG_ID_CREATED = 8;

const Chat = ({ dialog, onClose, initialMessages = null, ws = null }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadMessages, setLoadMessages] = useState(initialMessages || []);
  const messagesEndRef = useRef(null);

  const sortedMessages = useMemo(() => {
    return [...(loadMessages || [])].sort((a, b) => (a.sent || 0) - (b.sent || 0));
  }, [loadMessages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loadMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    try {
      if (ws && ws.readyState === WebSocket.OPEN) {
        const randomId = -Date.now();
        ws.send(
          JSON.stringify({
            msg_type: MSG_TEXT, // TextMessage
            text: trimmed,
            user_pk: String(dialog.other_user_id),
            random_id: randomId
          })
        );
        
        setLoadMessages((prev) => [
          ...prev,
          {
          id: randomId,
            text: trimmed,
            out: true,
            read: false,
            sent: Math.floor(Date.now() / 1000)
          }
          ]);
      }
    } catch (_) {}
    setMessage("");
  };
  const avatarUrl = "https://ui-avatars.com/api/?name=" + encodeURIComponent(dialog.username[0]);

  useEffect(() => {
    // If we already have initial messages for this dialog, do not refetch
    if (initialMessages && Array.isArray(initialMessages) && initialMessages.length > 0) {
      setLoadMessages(initialMessages);
      return;
    }
    setLoading(true);
    setError(null);
    api.get(`api/messages/${dialog.other_user_id}/`)
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setLoadMessages(items);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [dialog.other_user_id, initialMessages]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!ws) return;
    const onMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const type = data.msg_type;
        if (type === MSG_TEXT) {
          // TextMessage
          if (String(data.sender) === String(dialog.other_user_id) || String(data.receiver) === String(dialog.other_user_id)) {
            setLoadMessages((prev) => [
              ...prev,
              {
                id: data.random_id,
                text: data.text,
                out: String(data.sender) !== String(dialog.other_user_id),
                read: false,
                sent: Math.floor(Date.now() / 1000)
              }
            ]);
          }
        } else if (type === MSG_ID_CREATED) {
          // MessageIdCreated: replace temporary id with db id
          setLoadMessages((prev) => prev.map((m) => (m.id === data.random_id ? { ...m, id: data.db_id } : m)));
        } else if (type === MSG_READ) {
          // MessageRead: mark as read
          setLoadMessages((prev) => prev.map((m) => (m.id === data.message_id ? { ...m, read: true } : m)));
        } else if (type === MSG_FILE) {
          // FileMessage
          if (String(data.sender) === String(dialog.other_user_id) || String(data.receiver) === String(dialog.other_user_id)) {
            setLoadMessages((prev) => [
              ...prev,
              {
                id: data.db_id,
                text: (data.file && (data.file.original_filename || data.file.name)) || "File",
                out: String(data.sender) !== String(dialog.other_user_id),
                read: false,
                sent: Math.floor(Date.now() / 1000)
              }
            ]);
          }
        }
      } catch (_) {
        // ignore malformed events
      }
    };
    ws.addEventListener('message', onMessage);
    return () => {
      try { ws.removeEventListener('message', onMessage); } catch (_) {}
    };
  }, [ws, dialog.other_user_id]);

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
        {loadMessages && Array.isArray(loadMessages) && loadMessages.length > 0 ? (
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