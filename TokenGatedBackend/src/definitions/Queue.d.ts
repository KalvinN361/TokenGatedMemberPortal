import { BaseEntity, QueueEntity } from '../entity';
import exp from 'constants';

export interface BaseQueueRequest {
    queue: QueueEntity;
}

export interface BaseEventQueueRequest {
    eventId: string;
}

export interface QueueRequest {
    queueId: string;
}

export interface AddQueueRequest {
    queue: Omit<QueueEntity, BaseEntity>;
}

export interface AddToQueueRequest extends BaseEventQueueRequest {
    walletAddress: string;
    quantity: number;
    transactionType: string;
}
export interface RemoveQueueHoldRequest extends BaseEventQueueRequest {
    walletAddress: string;
    quantity: number;
}
export interface RemoveFailedHoldRequest extends BaseEventQueueRequest {
    walletAddress: string;
    quantity: number;
}
export interface RemoveHoldQueueRequest extends BaseEventQueueRequest {
    walletAddress: string;
}
export interface CurrentPositionRequest {
    eventId: string;
    walletAddress: string;
}

export interface QueueCountRequest extends BaseEventQueueRequest {}

export interface NextInQueueRequest extends BaseEventQueueRequest {}

export interface MoveToEndRequest extends BaseEventQueueRequest {}

export interface UpdateQueueRequest extends QueueRequest {}

export interface DeleteQueueRequest extends QueueRequest {}
