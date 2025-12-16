import statsRepository from './statsRepository.js';

class StatsService{
    // Top 3 most reserved rooms
    async topRooms(){
        const topRooms = await statsRepository.topRooms();
        return topRooms;
    }

    // Top 3 users with most reservations
    async topUsers(){
        const topUsers = await statsRepository.topUsers();
        return topUsers;
    }
}

export default new StatsService();