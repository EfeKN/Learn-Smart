import logo from "@/assets/chatbot-logo.jpg";
import Image from "next/image";
import { useState } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";

export default function PageHandler() {

    const [open, setOpen] = useState(true);

    return (
        <div className="flex">
            <div className={`bg-chatbot-color-1 h-screen p-5 pt-8 ${open ? "w-60" : "w-20"} duration-300 relative`}>
                <FaAngleDoubleRight className={`p-1 bg-white text-3xl rounded-full absolute -right-3 top-9 border-2 border-chatbot-color-2 cursor-pointer ${!open ? 'rotate-0 transition duration-500' : 'rotate-180 transition duration-500'}`} onClick={() => setOpen(!open)}/>
                <div className="inline-flex items-center">
                    <Image
                        className="text-4xl rounded-full float-left mr-3"
                        src={logo}
                        alt="logo"
                        width={40}
                        height={40}
                    />
                    <h1 className={`text-white origin-left font-medium duration-300 text-2xl ${!open && "scale-0"}`}>
                        Zikirmatik
                    </h1>
                </div>
            </div>
            <div className="p-10"><h1 className="text-2xl font-semibold">Chat Screen</h1></div>
        </div>
    );
}