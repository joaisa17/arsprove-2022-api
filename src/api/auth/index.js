import { Router } from 'express';

import DataManager from '../../mongo';
import AccountManager from '../../mongo/account';

import Login from './login';
import Logout from './logout';

const Auth = Router();

Auth.use('*', (req, _, next) => {
    if (
        !req.headers.authorization ||
        !req.headers.authorization.match(/Bearer [^\s]+/)
    ) return next();

    const token = req.headers.authorization.split(/ /)[1];
    AccountManager.authorizeToken(token).then(async username => {
        const collection = await DataManager.collection('users');
        if (!collection) return next();

        const user = await collection.findOne({
            username
        }, {
            projection: {
                _id: 0,
                password: 0
            }
        });

        req.user = user;
        next();
    }).catch(() => {
        console.log('None');
        next();
    });
});

Auth.get('/auth', (req, res) => {
    if (!req.user) return res.status(401).end();
    res.send(req.user);
});

Auth.use(Login);
Auth.use(Logout);

export default Auth;