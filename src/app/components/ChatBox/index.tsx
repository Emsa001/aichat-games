import { Textarea } from "react-daisyui";
import MessageInput from "./input";
import Bubble from "./bubble";

export default function ChatBox() {
    return (
        <div className="relative overflow-hidden">
            <div className="flex flex-col h-screen justify-between">

                <div className="mx-auto shadow-2xl bg-gray-600 rounded-2xl w-[90vw] h-full my-10 p-10">
                    <Bubble message="Hello there how are you" header="Anakin" side="front"/>
                    <Bubble message="Hello there how are you" side="end"/>
                </div>

                <MessageInput />
            </div>
        </div>
    )
}
