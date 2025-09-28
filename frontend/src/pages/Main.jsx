import { IoIosChatbubbles } from "react-icons/io";
import { IoMdContact } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import "../styles/searchBar.css";
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api";

import Settings from "./Settings";
import Contacts from "./Contacts";
import ChatList from "./ChatList";
import Chat from "./Chat";
import ButtomTabs from "../components/ui/ButtomTabs";
import { AnimatePresence, motion } from "framer-motion";

const isMobile = window.innerWidth <= 640;

// WebSocket message types
const WentOnline = 1
const WentOffline = 2
const TextMessage = 3
const FileMessage = 4
const IsTyping = 5
const MessageRead = 6
const ErrorOccurred = 7
const MessageIdCreated = 8
const NewUnreadCount = 9
const TypingStopped = 10 

// Prefetch knobs
const PREFETCH_COUNT = 5; // limit number of dialogs to prefetch
const PREFETCH_CONCURRENCY = 2; // limit concurrent requests

const Main = () => {
  const [openTab, setOpenTab] = useState({
    settings: false,
    chatList: true,
    contacts: false,
  });
  
  const [dialogs, setDialogs] = useState([]);
  const [messagesByUserId, setMessagesByUserId] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const wsRef = useRef(null);
  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    setLoading(true);
    api
      .get("api/dialogs/")
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setDialogs(items);
        // Prefetch messages for the first few dialogs with a small concurrency cap
        const targets = (items || []).slice(0, PREFETCH_COUNT);
        const queue = [...targets];
        let active = 0;

        return new Promise((resolve) => {
          if (queue.length === 0) return resolve();

          const next = () => {
            if (queue.length === 0 && active === 0) return resolve();
            while (active < PREFETCH_CONCURRENCY && queue.length > 0) {
              const dialog = queue.shift();
              if (!dialog) break;
              active += 1;
              api
                .get(`api/messages/${dialog.other_user_id}/`)
                .then((r) => {
                  const msgItems = Array.isArray(r.data) ? r.data : (r.data?.data || []);
                  setMessagesByUserId((prev) => ({ ...prev, [dialog.other_user_id]: msgItems }));
                })
                .catch(() => {})
                .finally(() => {
                  active -= 1;
                  next();
                });
            }
          };
          next();
        });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addDialog = (dialog) => {
    setDialogs((prev) => {
      if (prev.some(d => d.other_user_id === dialog.other_user_id)) return prev;
      return [dialog, ...prev];
    });
  };

  console.log("selectedChatId:", selectedChatId);
  console.log("dialogs:", dialogs);

  // Centralized WebSocket connection
  useEffect(() => {
    const wsUrl = `ws://localhost:8000/chat_ws/`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {};
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 WS message received:", data);
        
        if (data.msg_type === TextMessage) { 
          const messageUserId = String(data.sender) === String(currentUserId) 
            ? String(data.recipient) 
            : String(data.sender);
          
          // Add message to messagesByUserId
          setMessagesByUserId(prev => {
            const newMessage = {
              id: data.random_id || data.db_id,
              text: data.text,
              out: String(data.sender) === String(currentUserId),
              read: false,
              sent: data.sent || Math.floor(Date.now() / 1000),
              sender: data.sender,
              recipient: data.recipient,
              sender_username: data.sender_username,
              file: data.file
            };
            
            return {
              ...prev,
              [messageUserId]: [...(prev[messageUserId] || []), newMessage]
            };
          });
          
          // Update dialog list
          setDialogs(prevDialogs => {
            const idx = prevDialogs.findIndex(d => String(d.other_user_id) === messageUserId);
            if (idx === -1) {
              // If dialog doesn't exist, fetch dialogs
              api.get("api/dialogs/").then((res) => {
                const items = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setDialogs(items);
              });
              return prevDialogs;
            }
            
            const updatedDialogs = [...prevDialogs];
            const dialog = { ...updatedDialogs[idx] };
            dialog.last_message = {
              text: data.text,
              sent: data.sent || Math.floor(Date.now() / 1000),
              read: false,
              sender: data.sender,
              out: String(data.sender) === String(currentUserId),
            };
            
            // Increment unread count if incoming message
            if (String(data.sender) === String(dialog.other_user_id)) {
              dialog.unread_count = (dialog.unread_count || 0) + 1;
            }
            
            updatedDialogs[idx] = dialog;
            return updatedDialogs;
          });
        } else if (data.msg_type === MessageIdCreated) {
          // Replace temporary ID with real database ID
          setMessagesByUserId(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(userId => {
              updated[userId] = updated[userId].map(msg => 
                msg.id === data.random_id ? { 
                  ...msg, 
                  id: data.db_id,
                  sent: data.sent || msg.sent
                } : msg
              );
            });
            return updated;
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    ws.onerror = () => {};
    ws.onclose = () => {};

    return () => {
      try { ws.close(); } catch (_) {}
      if (wsRef.current === ws) wsRef.current = null;
    };
  }, []);

  const handleOpenContacts = () => setOpenTab({ settings: false, chatList: false, chat: false, contacts: true });
  const handleOpenChats = () => setOpenTab({ settings: false, chatList: true, chat: false, contacts: false });
  const handleOpenSettings = () => setOpenTab({ settings: true, chatList: false, chat: false, contacts: false });

  const updateDialogLastMessage = (userId, message) => {
    setDialogs(prev =>
      prev.map(dialog =>
        String(dialog.other_user_id) === String(userId)
          ? {
              ...dialog,
              last_message: {
                text: message,
                sent: Math.floor(Date.now() / 1000),
                read: false,
                sender: currentUserId,
                out: true,
              },
              unread_count: 0,
            }
          : dialog
      )
    );
  };

  const sendMessage = (userId, text) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }
    
    const randomId = -Date.now();
    const tempMessage = {
      id: randomId,
      text,
      out: true,
      read: false,
      sent: Math.floor(Date.now() / 1000),
      sender: currentUserId,
      recipient: userId,
      sender_username: localStorage.getItem("username"),
      file: null
    };
    
    // Optimistically add to local state
    setMessagesByUserId(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), tempMessage]
    }));
    
    // Update dialog last message
    updateDialogLastMessage(userId, text);
    
    // Send via WebSocket
    wsRef.current.send(JSON.stringify({
      msg_type: 3, // TextMessage
      text,
      user_pk: String(userId),
      random_id: randomId
    }));
  };

  console.log(messagesByUserId)
  if (isMobile) {
    return (
      <div>
        {openTab.settings === true && (
          <div>
            <Settings />
          </div>
        )}
        {openTab.chatList === true && (
          <div>
            <ChatList
              dialogs={dialogs}
              onOpenChat={(id) => { setSelectedChatId(id) }}
              onCreateChat={(user) => {
                const newDialog = {
                  id: user.pk,
                  other_user_id: user.pk,
                  username: user.username,
                  photo: user.photo || null,
                  last_message: null,
                  unread_count: 0,
                  pk: user.pk, 
                  create: true, 
                };
                addDialog(newDialog);
                setSelectedChatId(user.pk);
              }}
            />
          </div>
        )}
        {openTab.contacts === true && (
          <div>
            <Contacts />
          </div>
        )}
        
        <div className="fixed bottom-0 left-0 w-full flex justify-center">
          <div className="container bg-gray-200 shadow-lg p-3 flex justify-center items-center gap-17">
            <button
              onClick={handleOpenContacts}
              className="active:scale-95 transition-transform duration-100"  
              >
                <IoMdContact className={`w-12 h-12 ${openTab.contacts === true ? "text-blue-400" : "text-gray-400 dark:text-gray-400"}`}/>
           </button>
           <button 
              onClick={handleOpenChats}
              className="active:scale-95 transition-transform duration-100"
            >
                <IoIosChatbubbles className={`w-12 h-12 ${openTab.chatList === true ? "text-blue-400" : "text-gray-400 dark:text-gray-400"}`}/>
            </button>
            <button
              onClick={handleOpenSettings}
              className="active:scale-95 transition-transform duration-100"
            >
              <IoMdSettings className={`w-12 h-12 ${openTab.settings === true ? "text-blue-400" : "text-gray-400 dark:text-gray-400"}`}/>
            </button>
          </div>
        </div>
          <AnimatePresence mode="wait">
            {selectedChatId ? (
              <motion.div
                initial={{ x: 400 }}
                animate={{ x: 0 }}
                exit={{ x: 400 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-white dark:bg-black"
              >
                <Chat
                  dialog={dialogs.find(dialog => dialog.id === selectedChatId)}
                  messages={
                  selectedChatId
                  ? (dialogs.find(d => d.id === selectedChatId) && messagesByUserId[dialogs.find(d => d.id === selectedChatId).other_user_id]) || []
                  : []
                  }
                  onSendMessage={sendMessage}
                  onClose={() => {setSelectedChatId(0)}}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
      </div>
    )
  } else {
    return (
      <div>
        <div className="flex mt-50">
            <ButtomTabs />
        </div>
      </div>
    )
  }
}

export default Main;