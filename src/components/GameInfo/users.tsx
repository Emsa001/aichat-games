import { useEffect, useState } from "react";
import { Button, CodeMockup } from "react-daisyui";
import { MdOutlineReportProblem } from "react-icons/md";
import { Socket } from "socket.io-client";
import { Bounce, ToastContainer, toast } from 'react-toastify';

const colorVariants = {
    selected: "bg-red-500 text-white",
    default: "hover:bg-red-500 hover:text-white",
};

interface User {
    id: string;
    username: string;
    admin: boolean;
}

interface Data {
    user: User | null,
    socket: Socket | null,
    users: string[],
    isViewer: boolean,
}

export default function UsersList({socket, users, user, isViewer}:Data){
    const [vote, setVote] = useState("");
    const [canVote, setCanVote] = useState(false);
    const [timer, setTimer] = useState(-1);

    const handleVote = (voteUser: string) => {
        if (!canVote || isViewer) return;

        setVote(voteUser);
    };
    
    function StartTimer(startTime:number) {
        setTimer(startTime);
        const intervalId = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);
    
        setTimeout(() => {
            clearInterval(intervalId);
            setTimer(0);
        }, startTime * 1000);
    }

    useEffect(() => {   
        if (timer === 0 && canVote) {
            socket?.emit("vote", { vote, userId: user?.id });
            setVote("");
            setCanVote(false);
        }
    }, [timer, canVote, socket, user, vote]);
      

    useEffect(() => {
        socket?.on("start-vote", (time:number) => {
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
                <CodeMockup.Line status="info"className="mb-3">Users: {users?.length}</CodeMockup.Line>
                {users?.map((user: any) => {
                    return (
                        <CodeMockup.Line
                            key={user}
                            className={`${
                                vote == user ? colorVariants["selected"] : colorVariants["default"]
                            } cursor-pointer`}
                            onClick={() => handleVote(user)}
                        >
                            {user}
                        </CodeMockup.Line>
                    );
                })}
            </CodeMockup>
            <ToastContainer />
        </div>
    );
}
