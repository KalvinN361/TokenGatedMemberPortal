import { Request, Response, Router } from 'express';
import { authenticate } from '../../../scripts/utilities';

export const whoAmIRoute = Router();

whoAmIRoute.post(
    '/Auth/WhoAmI',
    authenticate,
    async (req: Request, res: Response) => {
        res.send(req.decodedAddress);
    }
);
