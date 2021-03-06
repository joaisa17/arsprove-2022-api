import { Router } from 'express';
import AccountManager from '../../mongo/account';

import ValidateParams from '../utils/params';
import Suspend from '../../utils/suspend';

const Register = Router();

Register.post('/account/register', async (req, res) => {
    //await Suspend(3000);

    if (!ValidateParams(req, {
        username: /^[a-z0-9_-]{3,16}$/i,
        password: /^[^\n]{3,128}$/
    })) return res.status(400).end();

    const status = await AccountManager.register(
        req.body.username.toLowerCase(),
        req.body.password
    );

    if (status !== 200) return res.status(status).end();

    const token = AccountManager.generateToken(req.body.username);
    res.send(token);
});

export default Register;