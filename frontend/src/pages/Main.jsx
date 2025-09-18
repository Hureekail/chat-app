import { AiOutlineSearch } from "react-icons/ai"; 
import { IoIosChatbubbles } from "react-icons/io"; 
import { IoMdContact } from "react-icons/io"; 
import { IoMdSettings } from "react-icons/io";
import "../styles/searchBar.css";
import { useState, useEffect, useRef } from "react";
import api from "../api";

import Settings from "./Settings"
import Contacts from "./Contacts"
import ChatList from "./ChatList"

const isMobile = window.innerWidth <= 640;

const Main = () => {

  const [openTab, setOpenTab] = useState({
    settings: false,
    chatList: true,
    contacts: false,
  });

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
          <div className="container bg-gray-200 dark:bg-black p-4 flex justify-center">
              <div className="box">
                <form name="search">
                    <input type="text" className="search-input"/>
                </form>
                <i><AiOutlineSearch className="w-8 h-8"/></i>
              </div>
          </div>
      {openTab.settings === true && (
          <div>
            <Settings/>
          </div>
        )
      }
      {openTab.chatList === true && (
          <div>
            <ChatList onOpenChat={(id) => { setSelectedChatId(id) }}/>
          </div>
        )
      }
      {selectedChatId && (
        <div className="p-3 text-center text-sm text-gray-600">Open chat ID: {selectedChatId}</div>
      )}
      {openTab.contacts === true && (
          <div>
            <Contacts/>
          </div>
        )
      }
        {!selectedChatId && (
          <div className="fixed bottom-0 left-0 w-full flex justify-center">
                <div className="container bg-gray-200 shadow-lg p-4 flex justify-center items-center gap-15">
                    <button
                      onClick={() => setOpenTab({ settings: false, chatList: false, chat: false, contacts: true })}
                      className="active:scale-95 transition-transform duration-100"  
                    >
                      <IoMdContact className={`w-15 h-15 ${openTab.contacts === true ? "text-blue-400" : "text-gray-400 dark:text-gray-400"}`}/>
                    </button>
                    <button 
                      onClick={() => setOpenTab({ settings: false, chatList: true, chat: false, contacts: false })}
                      className="active:scale-95 transition-transform duration-100"
                    >
                      <IoIosChatbubbles className={`w-15 h-15 ${openTab.chatList === true ? "text-blue-400" : "text-gray-400 dark:text-gray-400"}`}/>
                    </button>
                    <button
                      onClick={() => setOpenTab({ settings: true, chatList: false, chat: false, contacts: false })}
                      className="active:scale-95 transition-transform duration-100"
                    >
                      <IoMdSettings className={`w-15 h-15 ${openTab.settings === true ? "text-blue-400" : "text-gray-400 dark:text-gray-400"}`}/>
                    </button>
                </div>
          </div>
        )}
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