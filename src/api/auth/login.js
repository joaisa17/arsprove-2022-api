import { Router } from 'express';

import AccountManager from '../../mongo/account';

import ValidateParams from '../utils/params';
import Suspend from '../../utils/suspend';

const Login = Router();

Login.post('/auth/login', async (req, res) => {
    //await Suspend(1000);

    if (!ValidateParams(req, {
        username: 'string',
        password: 'string'
    })) return res.status(400).end();

    const user = req.body.username;
    const pwd = req.body.password;

    const authStatus = await AccountManager.authorize(
        user,
        pwd
    );

    if (authStatus === 200) {
        const token = AccountManager.generateToken(user);

        res.send(token);
    } else res.status(authStatus).end();
});

export default Login;