import { IoMdContact } from "react-icons/io"; 

import { AiFillWechat } from "react-icons/ai"; 
import { IoMdSettings } from "react-icons/io"; 

const ButtomTabs = () => {
    return (
    <div className="container bg-white shadow-lg p-5 flex justify-center items-center gap-15">
        <button>
            <IoMdContact className="w-15 h-15 text-blue-500"/>
        </button>
        <IoMdContact className="w-15 h-15 text-blue-500"/>
        <AiFillWechat className="w-17 h-17"/>
        <IoMdSettings className="w-15 h-15"/>
    </div>
)
}

export default ButtomTabs;