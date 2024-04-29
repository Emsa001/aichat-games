"use client";

import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Game } from "@/types";

import { Button, CodeMockup } from "react-daisyui";
import { Bounce, toast } from "react-toastify";
import Link from "next/link";
import { api } from "@/config.json";

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

    useEffect(() => {
        // Function to update timers
        const updateTimers = () => {
            const updatedTimers: { [key: number]: number } = {};

            games.forEach((game: Game, index: number) => {
                const startTime = new Date(game.startTime).getTime();
                const currentTime = new Date().getTime();
                const timeDifference = Math.max(0, startTime - currentTime); 

                updatedTimers[index] = Math.floor(timeDifference / 1000);
            });

            setTimers(updatedTimers);
        };

        updateTimers();
        const timerInterval = setInterval(updateTimers, 1000);

        return () => clearInterval(timerInterval);
    }, [games]);

    if (!Array.isArray(games)) {
        return <p>No game information available.</p>;
    }

    const joinGame = (game: Game) => {
        if(!game.canJoin) return;
        window.location.href = `/room?id=${game.id}`;
    }

    return (
        <main className="bg-gray-800 min-h-screen">
            <h1 className="text-center text-3xl p-5">{online} Online</h1>
            <Button onClick={createGame}>Create Game</Button>

            <div className="grid grid-cols-1 grid-rows-4 lg:grid-cols-3 lg:grid-rows-3 gap-4 p-8 h-full">
                {games?.map((game, index) => {
                    if (!game) return null;

                    console.log(game.players)

                    return (
                        <div
                            key={index}
                            className={`bg-gray-700 rounded-2xl shadow-2xl flex flex-col p-5 min-h-[250px]`}
                        >
                            <h1>{game.name}</h1>
                            <p>{game.description}</p>
                            <p>
                                Players: {game.players}/{game.maxPlayers}
                            </p>
                            {game.status === "waiting" ? (<p>Start in: {timers[index]}</p>) : "Already started"}
                            <Button className="mt-auto w-full" disabled={!game.canJoin} onClick={() => joinGame(game)}>
                                Join Game
                            </Button>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
