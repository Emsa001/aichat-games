import { Alert, CodeMockup, Textarea } from "react-daisyui";
import MessageInput from "./input";
import Bubble from "./bubble";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import SetUp from "../Setup";

interface User {
    id: string;
    username: string;
    admin: boolean;
}

interface Data {
    user: User | null;
    roomId: string;
    socket: Socket | null;
    setViewer: (value: boolean) => void;
    isViewer: boolean;
}

interface UserMessages {
    username: string;
    message: string;
    color: "info" | "success" | "error" | "warning" | undefined;
    type: string;
}

export default function ChatBox({ user, roomId, socket, isViewer, setViewer }: Data) {
    const [messages, setMessages] = useState<UserMessages[]>([]);
    const [timer, setTimer] = useState(-1);
    const [allowInput, setAllowInput] = useState(false);

    function StartTimer(startTime: number) {
        setTimer(startTime);
        const intervalId = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
            setTimer(0);
        }, startTime * 1000);
    }

    useEffect(() => {
        if (socket) {
            socket.on("message", (data) => {
                setMessages((prev) => [...prev, data]);
            });

            socket.on("systemMessage", (data) => {
                setMessages((prev) => [
                    ...prev,
                    { username: "SYSTEM", message: data?.text, type: data?.type, color: data?.color },
                ]);
                if(data?.time)
                    StartTimer(data?.time);
                if(data?.type == "question")
                    setAllowInput(true);
            });

            socket.on("kick", (data) => {
                if (user?.username === data?.username) setViewer(true);

                setMessages((prev) => [
                    ...prev,
                    { username: "SYSTEM", message: `${data?.username} has been kicked`, type: "info", color: "error" },
                ]);
            });
        }

        return () => {
            if (socket) {
                socket.off("message");
                socket.off("systemMessage");
                socket.off("question");
                socket.off("kick");
            }
        };
    });


    const TimerElement = () => {
        if (timer <= 0) return;
        return (
            <div className="absolute flex items-center justify-center w-20 h-20 bg-gray-900 -top-5 -left-5 rounded-full">
                {timer}
            </div>
        );
    };

    return (
        <div className="lg:h-full">
            <div className="flex flex-col h-full justify-between mx-auto">
                <div className="relative mx-auto shadow-2xl bg-gray-600 rounded-2xl min-h-[500px] h-full mb-10 p-10 w-full">
                    <div className="overflow-y-auto max-h-[900px]">
                        {messages.map((message, index) => {
                            if (message.type === "info" || message.type === "question") {
                                return (
                                    <Alert key={index} className="mx-auto my-5" status={message.color}>
                                        <span>{message.message}</span>
                                    </Alert>
                                );
                            }

                            return (
                                <Bubble
                                    header={message.username}
                                    message={message.message}
                                    key={index}
                                    side={message.username === user?.username ? "end" : "front"}
                                />
                            );
                        })}
                    </div>
                    <TimerElement />
                </div>

                {!isViewer && (
                    <MessageInput
                        user={user}
                        roomId={roomId}
                        socket={socket}
                        allowInput={allowInput}
                        setAllowInput={setAllowInput}
                    />
                )}
            </div>
        </div>
    );
}
