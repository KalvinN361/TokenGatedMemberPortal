import { Router } from 'express';
import { alchemyRoute } from './alchemy';
import { announcementRoute } from './announcements';
import { assetRouteUA } from './asset';
import { authenticateRoute } from './authentication';
import { blockchainRoute } from './blockchain';
import { chiveRoute } from './chive';
import { claimUnauthenticatedRoute } from './claims';
import { collectRoute } from './collect';
import { companyRoute } from './companies';
import { databaseRoute } from './database';
import { eventRoute } from './events';
import { filebaseRoute } from './filebase';
import { hyperMintRoute } from './hypermint';
import { shopsRoute } from './shop';
import { moralisRoute } from './moralis';
import { openSeaRoute } from './opensea';
import { prizeRoute } from './prizes';
import { queueRoute } from './queues';
import { sheetsRoute } from './googleSheets';
import { utilitiesRoute } from './utilities';
import { unauthenticatedOwnerRoute } from './owner';
import { stripeRoute } from './stripe';

export const unauthenticatedRoutes = Router();

unauthenticatedRoutes.use(alchemyRoute);
unauthenticatedRoutes.use(announcementRoute);
unauthenticatedRoutes.use(assetRouteUA);
unauthenticatedRoutes.use(authenticateRoute);
unauthenticatedRoutes.use(blockchainRoute);
unauthenticatedRoutes.use(chiveRoute);
unauthenticatedRoutes.use(claimUnauthenticatedRoute);
unauthenticatedRoutes.use(collectRoute);
unauthenticatedRoutes.use(companyRoute);
unauthenticatedRoutes.use(databaseRoute);
unauthenticatedRoutes.use(eventRoute);
unauthenticatedRoutes.use(filebaseRoute);
unauthenticatedRoutes.use(hyperMintRoute);
unauthenticatedRoutes.use(shopsRoute);
unauthenticatedRoutes.use(moralisRoute);
unauthenticatedRoutes.use(openSeaRoute);
unauthenticatedRoutes.use(prizeRoute);
unauthenticatedRoutes.use(queueRoute);
unauthenticatedRoutes.use(sheetsRoute);
unauthenticatedRoutes.use(unauthenticatedOwnerRoute);
unauthenticatedRoutes.use(utilitiesRoute);
unauthenticatedRoutes.use(stripeRoute);
