import { CodeMockup } from "react-daisyui";

interface GameData{
    name:string,
    roomId:string
}

export default function GeneralInfo({name,roomId}:GameData) {
    return (
        <CodeMockup className="w-full">
            <CodeMockup.Line className="text-warning">Game: {name}</CodeMockup.Line>
            <CodeMockup.Line className="text-success">Room ID: {roomId}</CodeMockup.Line>
        </CodeMockup>
    );
}
