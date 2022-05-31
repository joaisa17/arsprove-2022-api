import { Router } from 'express';

import Auth from './auth';
import Account from './account';
import Booking from './booking';

const API = Router();

API.use(Auth);
API.use(Account);
API.use(Booking);

export default API;