import { Alert, CodeMockup, Divider, Textarea } from "react-daisyui";
import MessageInput from "./input";
import Bubble from "./bubble";
import { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import SetUp from "../Setup";
import { Game, Player } from "@/types";
import { StartTimer } from "@/utils/timer";

interface Data {
    user: Player | null;
    game: Game | null;
    socket: Socket | null;
}

interface Messages {
    username: string | undefined;
    text: string;
    type: string;
    color: "info" | "success" | "error" | "warning" | undefined;
}

export default function ChatBox({ user, game, socket }: Data) {
    const [messages, setMessages] = useState<Messages[]>([]);
    const [timer, setTimer] = useState(-1);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
        if (socket) {
            socket.on("message", (data) => {
                if(data.text){
                    data.text = data.text.replaceAll(`${user?.name}`,"You");  
                    setMessages((prev) => [...prev, data]);
                }
            });
            socket.on("timer", (data) => {
                setTimer(data.time);
                StartTimer(data?.time, setTimer);
            });
        }

        return () => {
            if (socket) {
                socket.off("message");
                socket.off("timer");
            }
        };
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const TimerElement = () => {
        if (timer <= 0) return;
        return (
            <div className="absolute flex items-center justify-center w-20 h-20 bg-gray-900 -top-5 -left-5 rounded-full">
                {timer}
            </div>
        );
    };

    return (
        <>
            <div className="lg:h-full">
                <div className="flex flex-col h-full justify-between mx-auto">
                    <div className="relative mx-auto shadow-2xl bg-gray-600 rounded-2xl min-h-[70vh] mb-10 w-full">
                        <div className="overflow-y-auto px-10 pb-24 max-h-[70vh]">
                            {messages.map((message, index) => {
                                switch (message.type) {
                                    case "info":
                                        return (
                                            <Divider key={index} className="text-center my-5" color={message.color}>
                                                <div dangerouslySetInnerHTML={{ __html: message.text }} />
                                            </Divider>
                                        );
                                    case "alert":
                                        return (
                                            <Alert key={index} className="mx-auto my-5" status={message.color}>
                                                <div dangerouslySetInnerHTML={{ __html: message.text }} />
                                            </Alert>
                                        );
                                    default:
                                        const isUser = message.username === user?.name;
                                        return (
                                            <Bubble
                                                header={isUser ? "You" : message.username}
                                                message={message.text.toLocaleLowerCase()}
                                                key={index}
                                                side={isUser ? "end" : "front"}
                                            />
                                        );
                                }
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                        <TimerElement />
                    </div>

                    {!user?.viewer && <MessageInput user={user} game={game} socket={socket} />}
                </div>
            </div>
        </>
    );
}
