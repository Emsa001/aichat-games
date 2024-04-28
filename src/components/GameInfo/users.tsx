import { useEffect, useState } from "react";
import { Button, CodeMockup } from "react-daisyui";
import { MdOutlineReportProblem } from "react-icons/md";
import { Socket } from "socket.io-client";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Game, Player } from "@/types";

const colorVariants = {
    selected: "bg-red-500 text-white",
    default: "hover:bg-red-500 hover:text-white",
};

interface Data {
    user: Player | null;
    game: Game | null;
    players: Player[];
    socket: Socket | null;
}

export default function UsersList({ user, game, players, socket }: Data) {
    const [vote, setVote] = useState<Player | null>(null);
    const [canVote, setCanVote] = useState(false);
    const [timer, setTimer] = useState(-1);

    console.log(players)

    const handleVote = (voteUser: Player) => {
        if (!canVote) return;

        setVote(voteUser);
    };

    function StartTimer(startTime: number) {
        setTimer(startTime);
        const intervalId = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
            setTimer(0);
        }, startTime * 1000);
    }

    useEffect(() => {
        if (timer === 0 && canVote) {
            socket?.emit("vote", { vote, userId: user?.id });
            setVote(null);
            setCanVote(false);
        }
    }, [timer, canVote, socket, user, vote]);

    useEffect(() => {
        socket?.on("start-vote", (time: number) => {
            StartTimer(time);
            setCanVote(true);
        });

        socket?.on("end-vote", () => {
            setTimer(-1);
            setCanVote(false);
        });

        return () => {
            socket?.off("start-vote");
            socket?.off("end-vote");
        };
    }, [socket]);

    const TimerElement = () => {
        if (timer < 0) return;
        return (
            <p className="absolute top-3 right-3">
                Vote in: <b>{timer}</b>
            </p>
        );
    };

    return (
        <div>
            <CodeMockup className="w-full relative max-h-[600px] overflow-auto">
                <TimerElement />
                <CodeMockup.Line status="info" className="mb-3">
                    Users: {game?.players}/{game?.maxPlayers}
                </CodeMockup.Line>
                {players?.map((player: Player, index) => {

                    if(user?.id == player.id){
                        return (
                            <CodeMockup.Line
                                key={index}
                                className="bg-gray-700  cursor-pointer"
                            >
                            You
                            </CodeMockup.Line>
                        );
                    }

                    return (
                        <CodeMockup.Line
                            key={index}
                            className={`${
                                vote == player ? colorVariants["selected"] : colorVariants["default"]
                            } cursor-pointer`}
                            onClick={() => handleVote(player)}
                        >
                            {player.name}
                        </CodeMockup.Line>
                    );
                })}
            </CodeMockup>
            <ToastContainer />
        </div>
    );
}
