import 'dotenv/config';
if (
    !process.env.PORT ||
    !process.env.DB ||
    !process.env.DBUSERNAME ||
    !process.env.DBPASSWORD ||
    !process.env.TOKEN_SECRET
) throw new Error('Missing .env config information. Check README.md for more info');

import express from 'express';

import API from './api';
import AccountManager from './mongo/account';
import cors from 'cors';

const app = express();
const port = process.env.PORT;

app.use(cors({ origin: true }));
app.use(express.json());
app.use(API);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);

    setInterval(() => {
        console.log('Performing hourly token check on database...');
        AccountManager.checkExpiredTokens();
    }, 1000 * 60 * 60);
});