import { BaseEntity, PrizeEntity } from '../entity';

export interface BasePrizeRequest {
    prize: PrizeEntity;
}
export interface BaseEventPrizeRequest {
    eventId: string;
}
export interface PrizeRequest {
    prizeId: string;
}

export interface PrizeRequestWallet {
    prizeId: string;
    walletAddress: string;
}
export interface AddPrizeRequest {
    prize: Omit<PrizeEntity, BaseEntity>;
}

export interface PrizeCountRequest {
    eventId: string;
}
export interface GetAllUnclaimedByEventRequest {
    eventId: string;
}
export interface UpdatePrizeRequest extends BasePrizeRequest {}

export interface ArchivePrizeRequest extends PrizeRequest {}

export interface DeletePrizeRequest extends PrizeRequest {}

export interface ClaimPrizeRequest extends PrizeRequest {}

export interface ClaimPrizeWalletRequest extends PrizeRequestWallet {
    walletAddress: string;
}
export interface RemoveHoldPrizeRequest extends BaseEventPrizeRequest {
    walletAddress: string;
    quantity: number;
}
