"use client";

import { Game, Player } from "@/types";
import { use, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { api } from "@/config.json";
import { useSearchParams } from "next/navigation";
import ChatBox from "@/components/ChatBox";
import GeneralInfo from "@/components/GameInfo/general";
import UsersList from "@/components/GameInfo/users";
import Settings from "@/components/Setup/settings";
import Swal from "sweetalert2";

export default function Room() {
    const [game, setGame] = useState<Game | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [user, setUser] = useState<Player | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const newSocket = io(api, {
            transports: ["websocket"],
        });

        setSocket(newSocket);
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("close", (data: any) => {
            Swal.fire({
                title: data?.title || "Connection lost",
                text: data?.message || "Please refresh the page to reconnect",
                icon: data?.icon || "error",
                confirmButtonText: "Go to lobby",
            }).then(() => {
                window.location.href = "/";
            });
        });

        socket.on("data", (data: any) => {
            if (data?.game) setGame(data?.game);
            if (data?.user) setUser(data?.user || null);
            if (data?.players) {
                const updatedPlayers = data.players || [];

                const userIndex = updatedPlayers.findIndex((player: Player) => player.id === user?.id);
                let updatedPlayersWithoutUser = updatedPlayers;
                let removedUser: Player | null = null;

                if (userIndex !== -1) removedUser = updatedPlayersWithoutUser.splice(userIndex, 1)[0];
                setPlayers(updatedPlayersWithoutUser);
                if (removedUser) {
                    setPlayers((prevPlayers) => [removedUser as Player, ...prevPlayers]);
                }
            }
        });

        return () => {
            socket.off("close");
            socket.off("data");
        };
    }, [socket, user]);

    useEffect(() => {
        if (socket) {
            console.log(searchParams.get("id"));
            socket.emit("joinGame", { id: searchParams.get("id") });
        }
    }, [socket]);

    return (
        <main className="bg-gray-800 px-2 h-screen p-12">
            <div className="grid gap-4 mx-auto justify-center h-full">
                <div className="md:row-span-2 row-start-2 md:w-[50vw] max-w-[600px]">
                    <ChatBox user={user} game={game} socket={socket} />
                </div>
                <div className="flex flex-col gap-4 ">
                    <GeneralInfo game={game} />
                    <UsersList user={user} game={game} players={players} socket={socket} />
                </div>
                <div className="md:col-start-2 mt-auto mb-12">
                    <Settings user={user} game={game} socket={socket} />
                </div>
            </div>
        </main>
    );
}
