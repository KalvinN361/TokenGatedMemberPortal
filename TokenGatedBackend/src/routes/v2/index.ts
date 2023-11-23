import { Router } from 'express';
import { unauthenticatedRoutes } from './unauthenticated';
import { authenticatedRoutes } from './authenticated';

export const v2routes = Router();

v2routes.use(unauthenticatedRoutes);
v2routes.use(authenticatedRoutes);