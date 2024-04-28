"use client";

import Image from "next/image";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import io, { Socket } from "socket.io-client";

import { v4 as uuidv4 } from "uuid";
import { CodeMockup } from "react-daisyui";
import ChatBox from "@/components/ChatBox";
import UsersList from "@/components/GameInfo/users";
import GeneralInfo from "@/components/GameInfo/general";
import SetUp from "@/components/Setup";
import Settings from "@/components/Setup/settings";

// const API = "http://c2r7s5.42wolfsburg.de:5555";
const API = "http://localhost:5555";

export default function Home() {
    const [socket, setSocket] = useState<Socket | null>(null);

    interface User {
        id: string;
        username: string;
        admin: boolean;
        viewer: boolean;
    }
    
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<string[]>([]);
    const [roomId, setRoomId] = useState("");
    const [isViewer, setViewer] = useState(false);
    const [game, setGame] = useState(null);

    const handleJoinChat = (roomId: string) => {
        if (roomId.trim() !== "") {
            if (socket) (socket as any).disconnect();

            const newSocket = io(API, {
                transports: ["websocket"],
            });

            setSocket(newSocket);
            newSocket.emit("join", { roomId, userId: uuidv4() });
        }
    };

    function showLogin() {
        return Swal.fire({
            title: "Enter the Room ID",
            input: "text",
            inputAttributes: {
                autocapitalize: "off",
            },
            showCancelButton: false,
            allowOutsideClick: false,
            confirmButtonText: "Look up",
            showLoaderOnConfirm: true,
            allowEscapeKey: false,
            preConfirm: async (roomId: string) => {
                try {
                    // if (roomId.length < 5)
                    //     return Swal.showValidationMessage("Room Id must be at least 5 characters long.");

                    const response = await axios.post(`${API}/checkRoom`, {
                        roomId,
                    });
                    if (response?.data?.error) {
                        return Swal.showValidationMessage(response.data.error);
                    }
                    setRoomId(roomId);

                    return [roomId];
                } catch (error) {
                    return Swal.showValidationMessage("An error occurred while connecting to the server.");
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                handleJoinChat(result?.value?.[0] || "");
            }
        });
    }

    useEffect(() => {
        showLogin();
    }, []);

    interface Message {
        message: string;
        username?: string;
        info?: boolean;
        joined?: boolean;
    }

    interface UserListData {
        chatUsernames: string[];
    }

    useEffect(() => {
        if (socket) {
            socket.on("user", (data: User) => {
                setUser(data);
            });
        }
    
        // Clean up the event listener
        return () => {
            if (socket) {
                socket.off("user");
            }
        };
    }, [socket]);
    
    useEffect(() => {
        if (socket && user) {
            socket.on("userList", (data: UserListData) => {
                const userList = data?.chatUsernames.filter((item) => item != user?.username);
                setUsers(userList);
            });
        }
    
        return () => {
            if (socket) {
                socket.off("userList");
            }
        };
    }, [socket, user]); 
    
    if(!user) return ;

    return (
        <main className="bg-gray-800 overflow-x-hidden lg:overflow-hidden h-full lg:h-screen">
            <SetUp socket={socket}/>
            <h1 className="text-center pt-5">AI Games</h1>
            <div className="grid grid-cols-1 grid-rows-4 lg:grid-cols-3 lg:grid-rows-3 gap-4 p-8 h-full">
                <div className="col-span-2 row-start-2 row-span-3 lg:row-span-3 relative">
                    <ChatBox user={user} roomId={roomId} socket={socket} isViewer={isViewer} setViewer={setViewer} />
                </div>
                <div className="col-span-2 lg:col-start-3 lg:row-span-2 flex flex-col gap-2">
                    <GeneralInfo name={"Who's the AI"} roomId={roomId}/>
                    <UsersList user={user} users={users} socket={socket} isViewer={isViewer} />
                    <Settings user={user} socket={socket} roomId={roomId} />
                </div>
                <div className="col-start-3 row-start-3"></div>
            </div>
        </main>
    );
}
