"use client";

import { Game, Player } from "@/types";
import { use, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { api } from "@/config.json";
import { useSearchParams } from "next/navigation";
import SetUp from "@/components/Setup";
import ChatBox from "@/components/ChatBox";
import GeneralInfo from "@/components/GameInfo/general";
import UsersList from "@/components/GameInfo/users";
import Settings from "@/components/Setup/settings";


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

        socket.on("data", (data: any) => {
            if(data?.game) setGame(data?.game);
            if(data?.user) setUser(data?.user || null);
            if(data?.players){
                const updatedPlayers = data.players || [];
            
                const userIndex = updatedPlayers.findIndex((player: Player) => player.id === user?.id);
                let updatedPlayersWithoutUser = updatedPlayers;
                let removedUser: Player | null = null;
                
                if (userIndex !== -1)
                    removedUser = updatedPlayersWithoutUser.splice(userIndex, 1)[0];
                setPlayers(updatedPlayersWithoutUser);
                if (removedUser) {
                    setPlayers(prevPlayers => [removedUser as Player, ...prevPlayers]);
                }
            }
        });
        
        return () => {
            socket.off("data");
        };
    }, [socket, user]);

    useEffect(() => {
        if (socket) {
            console.log(searchParams.get("id"));
            socket.emit("joinGame", { id: searchParams.get("id") });
        }
    }, [socket]);


    // if(!game) return "Loading...";

    return (
        <main className="bg-gray-800 min-h-screen">
            <SetUp socket={socket} />
            <h1 className="text-center pt-5">AI Games</h1>
            <div className="grid grid-cols-1 grid-rows-4 lg:grid-cols-3 lg:grid-rows-3 gap-4 p-8 h-full">
                <div className="col-span-2 row-start-2 row-span-3 lg:row-span-3 relative">
                    <ChatBox user={user} game={game} socket={socket} />
                </div>
                <div className="col-span-2 lg:col-start-3 lg:row-span-2 flex flex-col gap-2">
                    <GeneralInfo game={game} />
                    <UsersList user={user} game={game} players={players} socket={socket} />
                    <Settings user={user} game={game} socket={socket} />
                </div>
                <div className="col-start-3 row-start-3"></div>
            </div>
        </main>
    );
}
