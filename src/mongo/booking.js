import DataManager from '.';

import InRange from '../utils/inRange';
import ms from 'ms';

const minSessionTime = ms('20m');
const maxSessionTime = ms('2h');

const times = {
    open: ms('9h'),
    close: ms('20h')
};

const closedDays = [
    7 // Sunday
];

/**
 * @param {Date} from 
 * @param {Date} to 
 */
function inOpenHours(from, to) {
    from.setSeconds(0);
    from.setMilliseconds(0);

    to.setSeconds(0);
    from.setMilliseconds(0);

    if (
        closedDays.includes(from.getDay()) ||
        closedDays.includes(to.getDay())
    ) return false;

    const fromCopy = new Date(from.valueOf());
    const toCopy = new Date(to.valueOf());

    fromCopy.setHours(0);
    fromCopy.setMinutes(0);

    toCopy.setHours(0);
    toCopy.setMinutes(0);

    const timeFrom = from - fromCopy;
    const timeTo = to - toCopy;

    return (
        InRange(timeFrom, times.open, times.close) &&
        InRange(timeTo, times.open, times.close)
    );
}


class BookingManager {
    async getAllSessions() {
        const collection = DataManager.collection('bookedSessions');
        if (!collection) return 500;

        const result = await collection.find();
        const arr = await result.toArray();
        return arr || 404;
    }

    /**
     * @param {Object<string, any>}
     * @param {Date} dateFrom 
     * @param {Date} dateTo 
     */
    async bookSession(user, dateFrom, dateTo, payload) {
        if (
            (dateTo - dateFrom) < 0 ||
            (dateFrom - new Date()) < 0 ||
            !InRange(
                dateTo - dateFrom,
                minSessionTime,
                maxSessionTime
            ) ||

            !inOpenHours(
                dateFrom,
                dateTo
            )
        ) return 403;

        const collection = DataManager.collection('bookedSessions');
        if (!collection) return 500;

        const existing = await collection.findOne({
            dateFrom: { $lt: dateTo },
            dateTo: { $gt: dateFrom }
        });

        if (existing) return 403;

        const insert = {
            author: user.username,
            dateFrom,
            dateTo,
            ...(payload || {})
        };

        const result = await collection.insertOne(insert);
        return result.insertedId;
    }

    /** @param {string} _id */
    async deleteSession(_id) {
        const collection = DataManager.collection('bookedSessions');
        if (!collection) return 500;

        const result = await collection.deleteOne({ _id });
        return result.deletedCount > 0? 200:404;
    }
}

export default new BookingManager();