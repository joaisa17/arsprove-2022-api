import { Router } from 'express';
import { ObjectId } from 'mongodb';

import BookingManager from '../mongo/booking';

import ValidateParams from './utils/params';

const Booking = Router();

Booking.get('/sessions', async (req, res) => {
    const sessions = await BookingManager.getAllSessions();
    typeof sessions !== 'number'? res.send(sessions):res.status(sessions);
});

Booking.post('/session/reserve', async (req, res) => {
    if (!req.user) return res.status(401).end();

    if (!ValidateParams(req, {
        dateFrom: ['number', 'string'],
        dateTo: ['number', 'string']
    })) return res.status(400).end();

    const id = await BookingManager.bookSession(
        req.user,
        new Date(req.body.dateFrom),
        new Date(req.body.dateTo)
    );

    typeof id === 'number'
    ?res.status(id).end()
    :res.send(id);
});

Booking.delete('/session/reserve', async (req, res) => {
    if (!req.user) return res.status(401).end();

    if (!ValidateParams(req, { id: 'string' })) return res.status(400).end();

    const status = await BookingManager.deleteSession(
        new ObjectId(req.body.id)
    );
    res.status(status).end();
});

export default Booking;