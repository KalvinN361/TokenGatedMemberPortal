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
exports.getAllByAssetIds = exports.getAllByAssetId = exports.remove = exports.update = exports.archive = exports.add = exports.getOne = exports.getAll = void 0;
const database_1 = require("../utilities/database");
const getAll = (entity, archived = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield database_1.dataSource
            .createQueryBuilder(entity, 'e')
            .leftJoinAndSelect('e.attributes', 'attributes')
            .where('e.archived = (:archived)', {
            archived: archived,
        })
            .getMany();
    }
    catch (_a) {
        return yield database_1.dataSource
            .createQueryBuilder(entity, 'e')
            .where('e.archived = (:archived)', {
            archived: archived,
        })
            .getMany();
    }
});
exports.getAll = getAll;
const getOne = (entity, id, archived = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(entity);
        return yield database_1.dataSource
            .createQueryBuilder(entity, 'e')
            .leftJoinAndSelect('e.attributes', 'attributes')
            .where('e.archived = (:archived) AND e.id = (:id)', {
            archived: archived,
            id: id,
        })
            .getOne()
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            return result;
        }));
    }
    catch (_b) {
        return yield database_1.dataSource
            .createQueryBuilder(entity, 'e')
            .where('e.archived = (:archived) AND e.id = (:id)', {
            archived: archived,
            id: id,
        })
            .getOne()
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            return result;
        }));
    }
});
exports.getOne = getOne;
const add = (entity, values) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity, 'e')
        .insert()
        .into(entity)
        .values(values)
        .execute()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        let test = result.identifiers;
        let ids = test.filter((item) => item.id !== undefined);
        /*for (let res in result.identifiers) {
            let data = await getOne(entity, result.identifiers[res].id);
            resultData.push(data);
        }*/
        return yield database_1.dataSource
            .createQueryBuilder(entity, 'e')
            .where('e.id IN (:...ids)', { ids: ids })
            .getMany()
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            return result;
        }));
    }));
});
exports.add = add;
const archive = (entity, id, archived = false) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity, 'e')
        .update(entity)
        .set({ archived: true })
        .where('id = :id AND archived = :archived', {
        id: id,
        archived: archived,
    })
        .execute()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        return result;
    }))
        .catch((error) => {
        return {
            error: error,
            message: 'Could not be archived, check if data is correct',
        };
    });
});
exports.archive = archive;
const update = (entity, data, archived = false) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity, 'e')
        .update(entity)
        .set(data)
        .whereInIds(data)
        .andWhere('archived = :archived', { archived: archived })
        .execute()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        return result;
    }))
        .catch((error) => {
        return {
            error: error,
            message: 'Could not be updated, check if data is correct',
        };
    });
});
exports.update = update;
const remove = (entity, id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity, 'e')
        .delete()
        .from(entity)
        .where('id = :id', { id: id })
        .execute()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        return result;
    }));
    /*.catch((error) => {
            return {
                error: error,
                message: 'Could not be removed, check if data is correct',
            };
        });*/
});
exports.remove = remove;
const getAllByAssetId = (entity, assetId, archived = false) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity, 'e')
        .where('e.archived = (:archived) AND e.assetId = (:assetId)', {
        archived: archived,
        assetId: assetId,
    })
        .getMany()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        return result;
    }))
        .catch((error) => {
        return {
            error: error,
            message: 'Target does not contain Asset Ids',
        };
    });
});
exports.getAllByAssetId = getAllByAssetId;
const getAllByAssetIds = (entity, assetIds, archived = false) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.dataSource
        .createQueryBuilder(entity, 'e')
        .where('e.archived = (:archived) AND e.assetId IN (:...assetIds)', {
        archived: archived,
        assetIds: assetIds,
    })
        .getMany()
        .then((result) => __awaiter(void 0, void 0, void 0, function* () {
        return result;
    }))
        .catch((error) => {
        return {
            error: error,
            message: 'Target does not contain Asset Ids',
        };
    });
});
exports.getAllByAssetIds = getAllByAssetIds;
