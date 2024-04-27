import { CodeMockup, Textarea } from "react-daisyui";
import MessageInput from "./input";
import Bubble from "./bubble";

export default function ChatBox() {
    return (
        <div className="relative overflow-hidden">
            <div className="flex flex-col h-screen justify-between mx-auto">

                <div className="mx-auto shadow-2xl bg-gray-600 rounded-2xl h-full mb-10 p-10 w-full">
                    <Bubble message="Hello there how are you" header="Anakin" side="front"/>
                    <Bubble message="Hello there how are you" side="end"/>
                </div>

                <MessageInput />
            </div>
        </div>
    )
}
