import { Router } from 'express';

import Auth from './auth';
import Account from './account';
import Rooms from './rooms';

const API = Router();

API.use(Auth);
API.use(Account);
API.use(Rooms);

export default API;