import { Router } from 'express';

import AccountManager from '../../mongo/account';

import Suspend from '../../utils/suspend';

const Logout = Router();

Logout.post('/auth/logout', async (req, res) => {
    //await Suspend(1000);

    if (
        !req.user ||
        !req.headers.authorization ||
        !req.headers.authorization.match(/Bearer [^\s]+/)
    ) return res.status(401).end();

    const token = req.headers.authorization.split(/ /)[1];
    const expireStatus = await AccountManager.expireToken(token);

    res.status(expireStatus).end();
});

export default Logout;