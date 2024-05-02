import { Game } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "react-daisyui";

interface Data {
    game: Game;
}

export default function GameCard({ game }: Data) {
    const [timer, setTimer] = useState(0);

    const joinGame = (game: Game) => {
        if (!game.canJoin) return;
        window.location.href = `/room?id=${game.id}`;
    };

    useEffect(() => {
        const updateTimers = () => {
            const startTime = new Date(game.startTime).getTime();
            const currentTime = new Date().getTime();
            const timeDifference = Math.max(0, startTime - currentTime);

            const updatedTimers = Math.floor(timeDifference / 1000);

            setTimer(updatedTimers);
        };

        updateTimers();
        const timerInterval = setInterval(updateTimers, 1000);

        return () => clearInterval(timerInterval);
    }, [game.startTime]);

    const gameStatus = game.status === "waiting" ? `Start in: ${timer}` : "Already started";

    return (
        <div key={game.id} className="bg-gray-700 rounded-2xl shadow-2xl flex flex-col p-5 min-h-[250px]">
            <h1 className="font-bold text-2xl">{game.name}</h1>
            <p className="text-sm">{game.description}</p>
            <div className="mt-3">
                <p>
                    Players: {game.players}/{game.maxPlayers}
                </p>
                <p className="">{gameStatus}</p>
            </div>
            <Button className="mt-auto w-full" disabled={!game.canJoin} onClick={() => joinGame(game)}>
                Join Game
            </Button>
        </div>
    );
}
