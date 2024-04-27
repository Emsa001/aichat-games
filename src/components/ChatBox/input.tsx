import { useState } from "react";
import { Button, Textarea } from "react-daisyui";
import { Socket } from "socket.io-client";

interface User {
    id: string;
    username: string;
    admin: boolean;
}

interface Data {
    user: User | null,
    roomId: string,
    socket: Socket | null,
    allowInput: boolean,
    setAllowInput: (value: boolean) => void;
}

export default function MessageInput({user, roomId, socket, allowInput, setAllowInput }:Data) {
    const [message, setMessage] = useState<string>("");

    const handleSendMessage = (e : any) => {
        e?.preventDefault();
        socket?.emit("message", { roomId, userId: user?.id, message });
        setMessage("");
        setAllowInput(false);
    }

    const handleKeyDown = (e : any) => {
        if (e?.key === 'Enter' && !e?.shiftKey) {
            e?.preventDefault();
            handleSendMessage(e);
        }
    };

    return (
        <div className="w-full mx-auto mb-12">
            <div className="relative">
                <form onSubmit={handleSendMessage}>
                    <Textarea
                        disabled={!allowInput}
                        className="w-full pr-[80px]"
                        placeholder="Your message"
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                    />
                    <Button className="absolute top-1/2 right-[10px] transform -translate-y-1/2" type="submit">Send</Button>
                </form>
            </div>
        </div>
    );
}
