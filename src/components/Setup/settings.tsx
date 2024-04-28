import Link from "next/link";
import { Button } from "react-daisyui";
import { Socket } from "socket.io-client";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Game, Player } from "@/types";


interface Data {
    user: Player | null,
    game: Game | null,
    socket: Socket | null,
}

export default function Settings({user, game, socket}:Data){
    const AdminSettings = () => {
        if(user?.admin != true) return ;

        const handleStartGame = () => {
            socket?.emit("startGame", { gameId: game?.id });
        }

        return (
            <div className="flex flex-col mt-10 gap-2">
                <Button className="w-full" onClick={handleStartGame}>Start Game</Button>
                <Button className="w-full">End Round</Button>
            </div>
        )
    }

    const handleInvite = () => {
        if(game == null) return ;
        navigator?.clipboard?.writeText(`http://localhost:3000?room=${game.id}`);
        toast.success('Invitation copied!', {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            theme: "dark",
            transition: Bounce,
            toastId: "invitation"
        });
    }

    return (
        <div className="flex flex-col gap-2 mt-5">
            <Button color="success" className="w-full text-lg uppercase rounded-2xl" onClick={handleInvite} disabled={!game?.canJoin}>Invite</Button>
            <a href="/">
                <Button color="error" className="w-full text-lg uppercase rounded-2xl">Leave</Button>
            </a>
            <AdminSettings />
            <ToastContainer />
        </div>
    )
}