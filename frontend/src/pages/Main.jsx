import { IoIosChatbubbles } from "react-icons/io"; 
import { IoMdContact } from "react-icons/io"; 
import { IoMdSettings } from "react-icons/io";
import "../styles/searchBar.css";
import { useState, useEffect } from "react";
import api from "../api";

import Settings from "./Settings"
import Contacts from "./Contacts"
import ChatList from "./ChatList"
import Chat from "./Chat"
import ButtomTabs from "../components/ui/ButtomTabs"
import { AnimatePresence, motion } from "framer-motion"

const isMobile = window.innerWidth <= 640;

const Main = () => {

  const [openTab, setOpenTab] = useState({
    settings: false,
    chatList: true,
    contacts: false,
  });

  const DEFAULT_DIALOGS = [
    {
      id: 3,
      created: 1758201067,
      modified: 1758201067,
      other_user_id: "6",
      unread_count: 0,
      username: "hureekail",
      last_message: {
        id: 4,
        text: "Люблю Лизу",
        sent: 1758201215,
        edited: 1758201215,
        read: true,
        file: null,
        sender: "41",
        recipient: "6",
        out: true,
        sender_username: "Vlados",
      },
    },
    {
      id: 4,
      created: 1758201067,
      modified: 1758201067,
      other_user_id: "5",
      unread_count: 10,
      username: "Елизавета",
      last_message: {
        id: 4,
        text: "Я тебя тоже люблю",
        sent: 1758201215,
        edited: 1758201215,
        read: true,
        file: null,
        sender: "6",
        recipient: "6",
        out: true,
        sender_username: "Vlados",
      },
    },
  ];

  const [dialogs, setDialogs] = useState(DEFAULT_DIALOGS);
  const [loading, setLoading] = useState(false);
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

  const [selectedChatId, setSelectedChatId] = useState(null);


  if (isMobile) {
    return (
      <div>
      {openTab.settings === true && (
          <div>
            <Settings/>
          </div>
        )
      }
      {openTab.chatList === true && (
          <div>
            <ChatList dialogs={dialogs} onOpenChat={(id) => { setSelectedChatId(id) }}/>
          </div>
        )
      }
      {openTab.contacts === true && (
          <div>
            <Contacts/>
          </div>
        )
      }
        
        <div className="fixed bottom-0 left-0 w-full flex justify-center">
          <div className="container bg-gray-200 shadow-lg p-3 flex justify-center items-center gap-17">
            <button
              onClick={() => setOpenTab({ settings: false, chatList: false, chat: false, contacts: true })}
              className="active:scale-95 transition-transform duration-100"  
              >
                <IoMdContact className={`w-12 h-12 ${openTab.contacts === true ? "text-blue-400" : "text-gray-400 dark:text-gray-400"}`}/>
           </button>
           <button 
              onClick={() => setOpenTab({ settings: false, chatList: true, chat: false, contacts: false })}
              className="active:scale-95 transition-transform duration-100"
            >
                <IoIosChatbubbles className={`w-12 h-12 ${openTab.chatList === true ? "text-blue-400" : "text-gray-400 dark:text-gray-400"}`}/>
            </button>
            <button
              onClick={() => setOpenTab({ settings: true, chatList: false, chat: false, contacts: false })}
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
                  onClose={() => setSelectedChatId(0)} 
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