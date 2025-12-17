export interface CreateReservationData{
    userId: string,
    roomId: string,
    startTime: Date,
    endTime: Date,
    attendees: number,
}

export interface ReservationData{
    userId: string,
    roomId: string,
    startTime: Date,
    endTime: Date,
    attendees: number,
}

export interface SimplifiedReservationData{
    id: string,
    startTime: Date,
    endTime: Date,
    status: 'confirmed' | 'cancelled',
}

export interface ReservationDetails{
    id: string,
    userId: string,
    roomId: string,
    startTime: Date,
    endTime: Date,
    attendees: number,
    status: 'confirmed' | 'cancelled',
    createdAt: Date,
}

export interface ReservationFilters{
    start?: Date,
    end?: Date,
    userId?: string,
    roomId?: string,
    status?: 'confirmed' | 'cancelled',
    limit?: number,
    offset?: number,
    sort?: 'oldest' | 'newest',
}
