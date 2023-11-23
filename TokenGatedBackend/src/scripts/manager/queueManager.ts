import { dataSource, setDataSource } from '../utilities/database';
import { QueueEntity, OwnerEntity } from '../../entity';

export const addToQueue = async (
    eventId: string,
    ownerId: string,
    quantity: number,
    transactionType: string
) => {
    // Find the highest position in the queue
    const highestPositionQueue = await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .select('MAX(q.position)', 'maxPosition')
        .where('q.eventId = (:eventId)', {
            eventId: eventId,
        })
        .getRawOne();
    const highestPosition = highestPositionQueue
        ? highestPositionQueue.maxPosition
        : 0;
    // Insert new entries with positions starting from the highest position + 1
    for (let i = 0; i < quantity; i++) {
        await dataSource
            .createQueryBuilder(QueueEntity, 'q')
            .insert()
            .into(QueueEntity)
            .values({
                eventId: eventId,
                ownerId: ownerId,
                position: highestPosition + 1 + i,
                transactionType: transactionType,
            })
            .execute();
    }
};
export const removeHoldQueue = async (
    eventId: string,
    ownerId: string,
    quantity: number
) => {
    let queue = await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .where('q.eventId = :eventId', {
            eventId: eventId,
        })
        .andWhere('q.ownerId = :ownerId', {
            ownerId: ownerId,
        })
        .andWhere('q.hold = :hold', {
            hold: true,
        })
        .take(quantity)
        .getMany();
    for (const queueItem of queue) {
        queueItem.hold = false;
        // Update the queueItem in the data source
        await dataSource.getRepository(QueueEntity).save(queueItem);
    }
};
export const removeFailedHoldQueue = async (
    eventId: string,
    ownerId: string,
    quantity: number
) => {
    let queue = await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .where('q.eventId = :eventId', {
            eventId: eventId,
        })
        .andWhere('q.ownerId = :ownerId', {
            ownerId: ownerId,
        })
        .take(quantity)
        .getMany();

    for (const queueItem of queue) {
        await dataSource.getRepository(QueueEntity).remove(queueItem);
    }
};
// HERE this removes the items in the queue that are on hold for more than 2 minutes
export const remoteTimeHoldQueue = async (eventId: string) => {
    const twoMinutesAgo = new Date();
    twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);

    const twoMinutesAgoISOString = twoMinutesAgo.toISOString().slice(0, -1);

    const queue = await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .where('q.eventId = :eventId', { eventId })
        .andWhere('q.hold = :hold', { hold: true })
        .andWhere('q.createdDate <= :twoMinutesAgo', {
            twoMinutesAgo: twoMinutesAgoISOString,
        })
        .getMany();
    for (const queueItem of queue) {
        await dataSource.getRepository(QueueEntity).remove(queueItem);
    }
};

export const currentPositionQueue = async (
    eventId: string,
    ownerId: string
) => {
    let queue = await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .where('q.eventId = (:eventId)', {
            eventId: eventId,
        })
        .getMany();

    return await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .select('q.position') // Select the 'position' column
        .where(
            'q.eventId = :eventId AND q.ownerId = :ownerId AND q.position != :position AND q.hold = :hold',
            {
                eventId: eventId,
                ownerId: ownerId,
                position: 0,
                hold: false,
            }
        )
        .orderBy('q.position', 'ASC')
        .getMany();
};
export const currentPositionTransactionTypeQueue = async (
    eventId: string,
    ownerId: string
) => {
    return await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .select('q.transactionType')
        .where(
            'q.eventId = :eventId AND q.ownerId = :ownerId AND q.position != :position AND q.hold = :hold',
            {
                eventId: eventId,
                ownerId: ownerId,
                position: 0,
                hold: false,
            }
        )
        .orderBy('q.position', 'ASC')
        .getMany();
};
export const queueCount = async (eventId: string) => {
    return await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .where('q.eventId = (:eventId)', {
            eventId: eventId,
        })
        .getCount();
};

export const updateQueueSpinStatus = async (
    eventId: string,
    position: number,
    status: 'Waiting' | 'Spinning' | 'WaitingSpin' | 'Finished'
) => {
    return await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .update(QueueEntity)
        .set({ status: status })
        .where('eventId = :eventId AND position = :position', {
            eventId: eventId,
            position: position,
        })
        .execute();
};
export const getNextInQueue = async (eventId: string) => {
    await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .update(QueueEntity)
        .set({ position: 0, status: 'Finished' })
        .where('eventId = :eventId AND position = (:position)', {
            eventId: eventId,
            position: 1,
        })
        .execute();
    let queue = await getAllByEventId(eventId);
    for (let q of queue) {
        if (q.position === 0) continue;
        await dataSource
            .createQueryBuilder(QueueEntity, 'q')
            .update(QueueEntity)
            .set({ position: 0 })
            .where('id = (:id) AND ownerId = (:ownerId)', {
                id: q.id,
                ownerId: q.ownerId,
            })
            .execute();
    }
    await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .update(QueueEntity)
        .set({ status: 'WaitingSpin' })
        .where('eventId = :eventId AND position = (:position)', {
            eventId: eventId,
            position: 1,
        })
        .execute();

    let next = (await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .where('q.eventId = (:eventId)', {
            eventId: eventId,
        })
        .orderBy('q.position', 'ASC')
        .getOne()) as QueueEntity;
    let newOwner = await dataSource
        .createQueryBuilder(OwnerEntity, 'o')
        .where('o.id = (:id)', {
            id: next.ownerId,
        })
        .getOne();
    return { newOwner, next };
};

export const moveToEnd = async (eventId: string) => {
    let queuedOwners = await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .where('q.eventId = (:eventId)', {
            eventId: eventId,
        })
        .orderBy('q.position', 'ASC')
        .getMany();

    let queueLength = queuedOwners.length;
    for (let q = 0; q < queueLength + 1; q++) {
        let newPosition = 0;
        if (q === 0) {
            newPosition = queueLength + 1;
        } else {
            newPosition = queuedOwners[q].position - 1;
        }
        try {
            await dataSource
                .createQueryBuilder(QueueEntity, 'q')
                .update(QueueEntity)
                .set({ position: newPosition })
                .where('q.eventId = (:eventId) AND q.id = (:id)', {
                    eventId: eventId,
                    id: queuedOwners[q].id,
                })
                .execute();

            return await dataSource
                .createQueryBuilder(QueueEntity, 'q')
                .where('q.eventId = (:eventId)', {
                    eventId: eventId,
                })
                .orderBy('q.position', 'ASC')
                .getOne();
        } catch (err) {
            console.log(err);
        }
    }
};

export const getAllByEventId = async (eventId: string) => {
    return await dataSource
        .createQueryBuilder(QueueEntity, 'q')
        .where('q.eventId = (:eventId)', {
            eventId: eventId,
        })
        .getMany();
};
