import { useState, useEffect } from 'react';
import { CodeMockup } from "react-daisyui";
import { Game } from "@/types";

export default function GeneralInfo({ game }: { game: Game | null }) {
    const [timer, setTimer] = useState<number>(0); // Set initial timer to 0

    useEffect(() => {
        if (game) {
            const startTime = new Date(game.startTime).getTime();
            const updateTimer = () => {
                const currentTime = new Date().getTime();
                const timeDifference = Math.max(0, startTime - currentTime);
                setTimer(Math.floor(timeDifference / 1000));
            };

            const interval = setInterval(updateTimer, 1000);

            updateTimer();

            return () => clearInterval(interval);
        } else {
            setTimer(0);
        }
    }, [game]);

    if (!game) {
        return <p>No game information available.</p>;
    }

    const TimerElement = () => {
        if (game.status == "waiting") {
            return <CodeMockup.Line className="text-info">Start in: {timer} seconds</CodeMockup.Line>;
        } else if (game.status == "started") {
            return <CodeMockup.Line className="text-info">Game is running</CodeMockup.Line>;
        } else {
            return <CodeMockup.Line className="text-info">Game is over</CodeMockup.Line>;
        }
    }

    return (
        <CodeMockup className="w-full">
            <CodeMockup.Line className="text-warning">Game: {game.name}</CodeMockup.Line>
            <CodeMockup.Line className="text-success">Room ID: {game.id}</CodeMockup.Line>
            <TimerElement />
        </CodeMockup>
    );
}