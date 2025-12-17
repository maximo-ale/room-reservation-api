export interface RoomData{
    name: string,
    description?: string,
    capacity: number,
    available?: boolean,
}

export interface SimplifiedRoomData{
    roomId: string,
    name: string,
}

export interface UpdateRoomData{
    name?: string,
    description?: string,
    capacity?: number,
    available?: boolean,
}