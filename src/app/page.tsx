"use client";

import Image from "next/image";
import { CodeMockup } from "react-daisyui";
import ChatBox from "@/components/ChatBox";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import UsersList from "@/components/Users/list";

const API = "http://localhost:3001";

export default function Home() {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    const [roomId, setroomId] = useState("");
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState(["Emanuel", "John", "Doe", "Jane", "Doe"]);

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
            preConfirm: async (roomId: string) => {
                try {
                    if (roomId.length < 5)
                        return Swal.showValidationMessage(
                            "Room Id must be at least 5 characters long."
                        );

                    const response = await axios.post(`${API}/checkRoom`, {
                        roomId,
                    });
                    if (response?.data?.error) {
                        return Swal.showValidationMessage(response.data.error);
                    }

                    setUsername(response.data.users);
                    setroomId(roomId);

                    return [roomId];
                } catch (error) {
                    return Swal.showValidationMessage(
                        "An error occurred while connecting to the server."
                    );
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                //   handleJoinChat(result.value[0], result.value[1]);
            }
        });
    }

    useEffect(() => {
        //   showLogin();
    }, []);

    return (
        <main className="h-full bg-gray-800 overflow-hidden">
            <div className="grid grid-cols-3 grid-rows-3 gap-4 p-8">
                <div className="col-span-2 row-span-3">
                    <ChatBox />
                </div>
                <div className="row-span-2 col-start-3 flex flex-col gap-2">
                    <CodeMockup className="w-full">
                        <CodeMockup.Line className="text-warning">
                            Game: Who's the AI?
                        </CodeMockup.Line>
                        <CodeMockup.Line className="text-success">
                            Room ID: 123456
                        </CodeMockup.Line>
                    </CodeMockup>
                    <UsersList users={users} />
                </div>
                <div className="col-start-3 row-start-3">
                </div>
            </div>
        </main>
    );
}
