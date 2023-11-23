"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllByEventId = exports.moveToEnd = exports.getNextInQueue = exports.updateQueueSpinStatus = exports.queueCount = exports.currentPositionTransactionTypeQueue = exports.currentPositionQueue = exports.remoteTimeHoldQueue = exports.removeFailedHoldQueue = exports.removeHoldQueue = exports.addToQueue = void 0;
const database_1 = require("../utilities/database");
const entity_1 = require("../../entity");
const addToQueue = (eventId, ownerId, quantity, transactionType) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the highest position in the queue
    const highestPositionQueue = yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
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
        yield database_1.dataSource
            .createQueryBuilder(entity_1.QueueEntity, 'q')
            .insert()
            .into(entity_1.QueueEntity)
            .values({
            eventId: eventId,
            ownerId: ownerId,
            position: highestPosition + 1 + i,
            transactionType: transactionType,
        })
            .execute();
    }
});
exports.addToQueue = addToQueue;
const removeHoldQueue = (eventId, ownerId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    let queue = yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
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
        yield database_1.dataSource.getRepository(entity_1.QueueEntity).save(queueItem);
    }
});
exports.removeHoldQueue = removeHoldQueue;
const removeFailedHoldQueue = (eventId, ownerId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    let queue = yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
        .where('q.eventId = :eventId', {
        eventId: eventId,
    })
        .andWhere('q.ownerId = :ownerId', {
        ownerId: ownerId,
    })
        .take(quantity)
        .getMany();
    for (const queueItem of queue) {
        yield database_1.dataSource.getRepository(entity_1.QueueEntity).remove(queueItem);
    }
});
exports.removeFailedHoldQueue = removeFailedHoldQueue;
// HERE this removes the items in the queue that are on hold for more than 2 minutes
const remoteTimeHoldQueue = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const twoMinutesAgo = new Date();
    twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);
    const twoMinutesAgoISOString = twoMinutesAgo.toISOString().slice(0, -1);
    const queue = yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
        .where('q.eventId = :eventId', { eventId })
        .andWhere('q.hold = :hold', { hold: true })
        .andWhere('q.createdDate <= :twoMinutesAgo', {
        twoMinutesAgo: twoMinutesAgoISOString,
    })
        .getMany();
    for (const queueItem of queue) {
        yield database_1.dataSource.getRepository(entity_1.QueueEntity).remove(queueItem);
    }
});
exports.remoteTimeHoldQueue = remoteTimeHoldQueue;
const currentPositionQueue = (eventId, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    let queue = yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
        .where('q.eventId = (:eventId)', {
        eventId: eventId,
    })
        .getMany();
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
        .select('q.position') // Select the 'position' column
        .where('q.eventId = :eventId AND q.ownerId = :ownerId AND q.position != :position AND q.hold = :hold', {
        eventId: eventId,
        ownerId: ownerId,
        position: 0,
        hold: false,
    })
        .orderBy('q.position', 'ASC')
        .getMany();
});
exports.currentPositionQueue = currentPositionQueue;
const currentPositionTransactionTypeQueue = (eventId, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
        .select('q.transactionType')
        .where('q.eventId = :eventId AND q.ownerId = :ownerId AND q.position != :position AND q.hold = :hold', {
        eventId: eventId,
        ownerId: ownerId,
        position: 0,
        hold: false,
    })
        .orderBy('q.position', 'ASC')
        .getMany();
});
exports.currentPositionTransactionTypeQueue = currentPositionTransactionTypeQueue;
const queueCount = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
        .where('q.eventId = (:eventId)', {
        eventId: eventId,
    })
        .getCount();
});
exports.queueCount = queueCount;
const updateQueueSpinStatus = (eventId, position, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
        .update(entity_1.QueueEntity)
        .set({ status: status })
        .where('eventId = :eventId AND position = :position', {
        eventId: eventId,
        position: position,
    })
        .execute();
});
exports.updateQueueSpinStatus = updateQueueSpinStatus;
const getNextInQueue = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
        .update(entity_1.QueueEntity)
        .set({ position: 0, status: 'Finished' })
        .where('eventId = :eventId AND position = (:position)', {
        eventId: eventId,
        position: 1,
    })
        .execute();
    let queue = yield (0, exports.getAllByEventId)(eventId);
    for (let q of queue) {
        if (q.position === 0)
            continue;
        yield database_1.dataSource
            .createQueryBuilder(entity_1.QueueEntity, 'q')
            .update(entity_1.QueueEntity)
            .set({ position: 0 })
            .where('id = (:id) AND ownerId = (:ownerId)', {
            id: q.id,
            ownerId: q.ownerId,
        })
            .execute();
    }
    yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
        .update(entity_1.QueueEntity)
        .set({ status: 'WaitingSpin' })
        .where('eventId = :eventId AND position = (:position)', {
        eventId: eventId,
        position: 1,
    })
        .execute();
    let next = (yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
        .where('q.eventId = (:eventId)', {
        eventId: eventId,
    })
        .orderBy('q.position', 'ASC')
        .getOne());
    let newOwner = yield database_1.dataSource
        .createQueryBuilder(entity_1.OwnerEntity, 'o')
        .where('o.id = (:id)', {
        id: next.ownerId,
    })
        .getOne();
    return { newOwner, next };
});
exports.getNextInQueue = getNextInQueue;
const moveToEnd = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    let queuedOwners = yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
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
        }
        else {
            newPosition = queuedOwners[q].position - 1;
        }
        try {
            yield database_1.dataSource
                .createQueryBuilder(entity_1.QueueEntity, 'q')
                .update(entity_1.QueueEntity)
                .set({ position: newPosition })
                .where('q.eventId = (:eventId) AND q.id = (:id)', {
                eventId: eventId,
                id: queuedOwners[q].id,
            })
                .execute();
            return yield database_1.dataSource
                .createQueryBuilder(entity_1.QueueEntity, 'q')
                .where('q.eventId = (:eventId)', {
                eventId: eventId,
            })
                .orderBy('q.position', 'ASC')
                .getOne();
        }
        catch (err) {
            console.log(err);
        }
    }
});
exports.moveToEnd = moveToEnd;
const getAllByEventId = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity_1.QueueEntity, 'q')
        .where('q.eventId = (:eventId)', {
        eventId: eventId,
    })
        .getMany();
});
exports.getAllByEventId = getAllByEventId;
