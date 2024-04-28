import { Game, Player } from "@/types";
import { use, useEffect, useState } from "react";
import { Button, Textarea } from "react-daisyui";
import { Socket } from "socket.io-client";

interface Data {
    game: Game | null,
    socket: Socket | null,
}

export default function MessageInput({game, socket }:Data) {
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        socket?.emit("test", { text: "test" });
    },[socket]);

    const handleSendMessage = (e : any) => {
        e?.preventDefault();
        socket?.emit("test", { text: message });
        setMessage("");
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
                        // disabled={!game?.canWrite}
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
