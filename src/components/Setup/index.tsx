import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Data {
    socket: Socket | null
}

interface SetupData{
    title: string,
    time: number,
}

export default function SetUp({socket}:Data)
{
    const [isAnnouncement, setAnnouncement] = useState(false);
    const [title, setTitle] = useState("");
    const [timer, setTimer] = useState(-1);

    function StartTimer(startTime:number) {
        setTimer(startTime);
        const intervalId = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);
    
        setTimeout(() => {
            clearInterval(intervalId);
            setAnnouncement(false);
        }, startTime * 1000);
    }

    useEffect(() => {
        if (socket) {
            socket.on("setup", (data: SetupData) => {
                setTitle(data.title);
                setAnnouncement(true);
                StartTimer(data.time);
            });
        }
    
        // Clean up the event listener
        return () => {
            if (socket) {
                socket.off("setup");
            }
        };
    },[socket]);

    if(isAnnouncement){
        return (
            <div className="absolute w-screen h-screen flex flex-col gap-10 items-center justify-center z-10 backdrop-blur-sm">
                <div className="text-center bg-gray-800 p-10 rounded-2xl shadow-2xl">
                    <h1 className="text-4xl">{title.toUpperCase()}</h1>
                    <h1 className="text-6xl text-violet-500 font-semibold ">{timer}</h1>
                </div>
            </div>
        )
    }

    return;
}