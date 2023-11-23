import { Router } from 'express';
import { assetRoute } from './assets';
import { claimRoute } from './claims';
import { contractRoute } from './contracts';
import { mediaRoute } from './media';
import { ownerRoute } from './owners';
import { whoAmIRoute } from './whoami';
import { asset1155Route } from './assets1155';
import { token1155Route } from './tokens1155';

export const authenticatedRoutes = Router();

authenticatedRoutes.use(assetRoute);
authenticatedRoutes.use(claimRoute);
authenticatedRoutes.use(mediaRoute);
authenticatedRoutes.use(ownerRoute);
authenticatedRoutes.use(contractRoute);
authenticatedRoutes.use(whoAmIRoute);
authenticatedRoutes.use(asset1155Route);
authenticatedRoutes.use(token1155Route);
