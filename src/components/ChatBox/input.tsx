import { Game, Player } from "@/types";
import { use, useEffect, useRef, useState } from "react";
import { Button, Textarea } from "react-daisyui";
import { Socket } from "socket.io-client";

interface Data {
    user: Player | null,
    game: Game | null,
    socket: Socket | null,
}

export default function MessageInput({user, game, socket }:Data) {
    const [message, setMessage] = useState<string>("");
    const textarea_ref = useRef<HTMLTextAreaElement>(null);

    const handleSendMessage = (e : any) => {
        if(user?.canWrite === false) return;

        e?.preventDefault();
        socket?.emit("message", { gameId:game?.id, text: message });
        setMessage("");
    }

    const handleKeyDown = (e : any) => {
        if (e?.key === 'Enter' && !e?.shiftKey) {
            e?.preventDefault();
            handleSendMessage(e);
        }
    };

    useEffect(() => {
        textarea_ref?.current?.focus();
    });

    return (
        <div className="w-full mx-auto mb-12">
            <div className="relative">
                <form onSubmit={handleSendMessage}>
                    <Textarea
                        ref={textarea_ref}
                        disabled={!user?.canWrite}
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
