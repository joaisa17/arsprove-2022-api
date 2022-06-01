import { Router } from 'express';
import { ObjectId } from 'mongodb';

import BookingManager from '../mongo/booking';

import ValidateParams from './utils/params';
import FloorDate from '../utils/floorDate';

const Booking = Router();

Booking.get('/sessions', async (req, res) => {
    if (!ValidateParams(req, {
        month: ['string', 'number']
    }, 'query')) return res.status(400).end();

    const start = FloorDate(
        new Date(req.query.month)
    );
    if (!start) return res.status(400).end();

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    end.setMilliseconds(999);

    const groupedSessions = await BookingManager.getSessionsInRange(start, end);
    if (typeof groupedSessions === 'number') return res.status(groupedSessions).end();

    res.send(groupedSessions);
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