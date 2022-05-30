import { Router } from 'express';
import AccountManager from '../../mongo/account';

import ValidateParams from '../utils/params';
import Suspend from '../../utils/suspend';

const Delete = Router();

Delete.delete('/account/manage', async (req, res) => {
    //await Suspend(3000);

    if (!ValidateParams(req, {
        username: 'string',
        password: 'string'
    })) return res.status(400).end();

    const authStatus = await AccountManager.authorize(
        req.body.username,
        req.body.password
    );

    if (authStatus !== 200) return res.status(authStatus).end();

    const status = await AccountManager.delete(
        req.body.username
    );

    res.status(status).end();
});

export default Delete;