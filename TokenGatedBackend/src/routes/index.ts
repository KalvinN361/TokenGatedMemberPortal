import Router from 'express';
import { v2routes } from './v2';

export const routes = Router();

routes.use(v2routes);