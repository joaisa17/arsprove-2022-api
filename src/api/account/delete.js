import { Router } from 'express';
import AccountManager from '../../mongo/account';

import ValidateParams from '../utils/params';
import Suspend from '../../utils/suspend';

const Delete = Router();

Delete.delete('/account/manage', async (req, res) => {
    //await Suspend(3000);
    if (!req.user) return res.status(401).end();

    const status = await AccountManager.delete(
        req.user.username
    );

    res.status(status).end();
});

export default Delete;