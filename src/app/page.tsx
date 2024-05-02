"use client";

import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Game } from "@/types";

import { Button, CodeMockup } from "react-daisyui";
import { Bounce, toast } from "react-toastify";
import Link from "next/link";
import { api } from "@/config.json";
import GameCard from "@/components/Card/game";

export default function Home() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [online, setOnline] = useState(0);
    const [timers, setTimers] = useState<{ [key: number]: number }>({});

    const createGame = () => {
        if (!socket) return;

        console.log("Creating game");
        socket.emit("createGame", { name: "GuessAI" });
    };

    useEffect(() => {
        const newSocket = io(api, {
            transports: ["websocket"],
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("update", (data: any) => {
                setGames(data?.games || []);
                setOnline(data?.online || 0);
            });

            socket.on("error", (data: any) => {
                if (!data?.text) return;
                toast.error(data?.text, {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    theme: "dark",
                    transition: Bounce,
                });
            });
        }

        return () => {
            if (socket) {
                socket.off("online");
                socket.off("error");
            }
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        socket.emit("join");
    }, [socket]);

    if (!Array.isArray(games)) {
        return <p>No game information available.</p>;
    }

    return (
        <main className="bg-gray-800 min-h-screen w-screen">
            <div className="flex flex-col justify-center items-center w-full">
                <h1 className="text-center text-3xl p-5">{online} Online</h1>
                <Button onClick={createGame}>Create Game</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-8">
                {games?.map((game, index) => {
                    if (!game) return null;

                    return <GameCard key={index} game={game} />
                })}
            </div>
        </main>
    );
}
