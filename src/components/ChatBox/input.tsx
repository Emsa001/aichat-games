import { Button, Textarea } from "react-daisyui";

export default function MessageInput() {

    const handleSendMessage = (e : any) => {
        e.preventDefault();
        console.log("Message sent");
    }

    const handleKeyDown = (e : any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    return (
        <div className="w-full mx-auto mb-12">
            <div className="relative">
                <form onSubmit={handleSendMessage}>
                    <Textarea
                        className="w-full pr-[80px]"
                        placeholder="Your message"
                        onKeyDown={handleKeyDown}
                    />
                    <Button className="absolute top-1/2 right-[10px] transform -translate-y-1/2" type="submit">Send</Button>
                </form>
            </div>
        </div>
    );
}
