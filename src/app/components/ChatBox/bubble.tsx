import { ChatBubble } from "react-daisyui";

export default function Bubble({ header, time, avatar, side, message }: { header?: string, time?: string, avatar?: string, side?: string, message: string }) {
    return (
        <ChatBubble end={side === "end" ? true : false}>
            {header && (
                <ChatBubble.Header>
                    {header} {time && <ChatBubble.Time>{time}</ChatBubble.Time>}
                </ChatBubble.Header>
            )}
            {avatar && (
                <ChatBubble.Avatar src={avatar} />
            )}
            <ChatBubble.Message>{message}</ChatBubble.Message>
        </ChatBubble>
    );
}
