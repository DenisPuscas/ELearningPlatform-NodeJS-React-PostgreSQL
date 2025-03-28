import { ChatCenteredText, PaperPlaneRight, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react"
import axios from "axios";
import "./chat.css"

export const Chat = () => {
    const [isOpen, setOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatRef = useRef(null);
    const iconRef = useRef(null);
    const scrollableDivRef = useRef(null);

    const handleSubmit = async () => {
        setMessages((prevMessages) => [...prevMessages, { type: 'que', text: prompt }]);
        setPrompt('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:4000/api/chat/generate', {
                prompt,
            });
            setMessages((prevMessages) => [...prevMessages, { type: 'res', text: res.data.response }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages((prevMessages) => [...prevMessages, { type: 'err', text: 'Error fetching response.' }]);
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    useEffect(() => {
        const div = scrollableDivRef.current;
        if (div) {
            div.scrollTo({
                top: div.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    return (
        <div className="chat">
            {isOpen ?
                <div className="chatPanel" ref={chatRef}>
                    <div className="chatScreen" ref={scrollableDivRef}>
                        {messages && messages.length > 0 && messages.map((msg) => (
                            <div className={`chatMessageContainer ${msg.type}`}>
                                <div className={`chatMessage ${msg.type}`}> {msg.text} </div>
                            </div>
                        ))}
                        {loading &&
                            <div className={"chatMessageContainer"}>
                                <div className="chatMessage res"> . . . </div>
                            </div>
                        }
                    </div>
                    <input className="chatInput" type="text" placeholder="Ask something."
                        value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={handleKeyDown} />
                    <PaperPlaneRight className="chatSendIcon" size={30} onClick={handleSubmit} />
                    <X className="chatCloseBtn" onClick={() => setOpen(false)} />
                </div>
                :
                <ChatCenteredText
                    className="chatIcon"
                    size={30}
                    ref={iconRef}
                    onClick={() => setOpen(true)}
                />
            }
        </div>
    )
}