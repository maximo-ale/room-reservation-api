import express from 'express';

import userRoutes from './entities/users/userRoutes.js';
import roomRoutes from './entities/rooms/roomsRoutes.js';
import reservationRoutes from './entities/reservations/reservationsRoutes.js';
import statsRoutes from './entities/stats/statsRoutes.js';

import createTables from './utils/createTables.js';
import errorHandler from './middlewares/errorHandler.js';
import resetDB from './utils/resetDB.js';

const PORT: number | string = process.env.PORT || 3000;

const app = express();

app.use(express.json());

if (process.env.RESET_DB_ON_START?.toLowerCase() === 'true'){
    await resetDB();
}

await createTables();
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log('App listening on port ', PORT);
});

export default app;