import { BaseEntity, EventEntity } from '../entity';

export interface BaseEventRequest {
    event: EventEntity;
}

export interface EventRequest {
    eventId: string;
}

export interface AddEventRequest {
    event: Omit<EventEntity, BaseEntity>;
}

export interface UpdateEventRequest extends BaseEventRequest {}

export interface ArchiveEventRequest extends EventRequest {}

export interface DeleteEventRequest extends EventRequest {}
