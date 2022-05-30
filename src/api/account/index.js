import { Router } from 'express';

import Register from './register';
import Delete from './delete';

const Account = Router();

Account.use(Register);
Account.use(Delete);

export default Account