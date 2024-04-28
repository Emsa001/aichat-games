export interface Game {
    id: string;
    name: string;
    players: number;
    maxPlayers: number;
    viewers: string[];
    description: string;
    color: string;
    status: string;
    canJoin: boolean;
    canWrite: boolean;
    startTime: Date;
}

export interface Player {
    id: string;
    name: string;
    admin: boolean;
    viewer: boolean;
}