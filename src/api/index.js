import { Router } from 'express';

import Auth from './auth';
import Account from './account';
import Booking from './booking';
import CMS from './cms';

const API = Router();

API.use(Auth);
API.use(Account);
API.use(Booking);
API.use(CMS);

export default API;