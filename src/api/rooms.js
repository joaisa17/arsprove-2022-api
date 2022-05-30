import { Router } from 'express';

const Rooms = Router();

Rooms.post('/rooms/reserve', (req, res) => {

    res.status(req.user?200:401).end();
});

export default Rooms;