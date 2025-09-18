import { IoIosChatbubbles } from "react-icons/io"; 
import { IoMdContact } from "react-icons/io"; 
import { AiFillWechat } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";

import { useState, useEffect, useRef } from "react";

import Settings from "./Settings"
import Contacts from "./Contacts"
import ChatList from "./ChatList"
import ButtomTabs from "../components/ui/ButtomTabs"
import WebSocketStatus from "../components/WebSocketStatus"

const isMobile = window.innerWidth <= 640;

const Chats = () => {

  const [openTab, setOpenTab] = useState({
    settings: false,
    chatList: false,
    contacts: false,
  });


  if (isMobile) {
    return (
      <div>
        <WebSocketStatus />
        {openTab.settings === true && (
            <div>
              <Settings/>
            </div>
          )
        }
        {openTab.chatList === true && (
            <div>
              <ChatList/>
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
                <div className="container bg-white shadow-lg p-5 flex justify-center items-center gap-20">
                    <button
                      onClick={() => setOpenTab({ settings: false, chatList: false, chat: false, contacts: true })}
                      className="active:scale-95 transition-transform duration-100"  
                    >
                      <IoMdContact className={`w-15 h-15 ${openTab.contacts === true ? "text-blue-400" : "text-gray-400 dark:text-white"}`}/>
                    </button>
                    <button 
                      onClick={() => setOpenTab({ settings: false, chatList: true, chat: false, contacts: false })}
                      className="active:scale-95 transition-transform duration-100"
                    >
                      <IoIosChatbubbles className={`w-15 h-15 ${openTab.chatList === true ? "text-blue-400" : "text-gray-400 dark:text-white"}`}/>
                    </button>
                    <button
                      onClick={() => setOpenTab({ settings: true, chatList: false, chat: false, contacts: false })}
                      className="active:scale-95 transition-transform duration-100"
                    >
                      <IoMdSettings className={`w-15 h-15 ${openTab.settings === true ? "text-blue-400" : "text-gray-400 dark:text-white"}`}/>
                    </button>
                </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <WebSocketStatus />
          <div className="flex mt-50">
              <ButtomTabs />
          </div>
        </div>
    )
    }
}

export default Chats;