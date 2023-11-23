import { EntityTarget, ObjectLiteral } from 'typeorm';
import { dataSource } from '../utilities/database';

export const getAll = async <T extends EntityTarget<ObjectLiteral>>(
    entity: T,
    archived: boolean = false
) => {
    try {
        return await dataSource
            .createQueryBuilder(entity, 'e')
            .leftJoinAndSelect('e.attributes', 'attributes')
            .where('e.archived = (:archived)', {
                archived: archived,
            })
            .getMany();
    } catch {
        return await dataSource
            .createQueryBuilder(entity, 'e')
            .where('e.archived = (:archived)', {
                archived: archived,
            })
            .getMany();
    }
};

export const getOne = async <T extends EntityTarget<ObjectLiteral>>(
    entity: T,
    id: string,
    archived: boolean = false
) => {
    try {
        console.log(entity);
        return await dataSource
            .createQueryBuilder(entity, 'e')
            .leftJoinAndSelect('e.attributes', 'attributes')
            .where('e.archived = (:archived) AND e.id = (:id)', {
                archived: archived,
                id: id,
            })
            .getOne()
            .then(async (result) => {
                return result;
            });
    } catch {
        return await dataSource
            .createQueryBuilder(entity, 'e')
            .where('e.archived = (:archived) AND e.id = (:id)', {
                archived: archived,
                id: id,
            })
            .getOne()
            .then(async (result) => {
                return result;
            });
    }
};

export const add = async <T extends EntityTarget<ObjectLiteral>>(
    entity: T,
    values: any
) => {
    return await dataSource
        .createQueryBuilder(entity, 'e')
        .insert()
        .into(entity)
        .values(values)
        .execute()
        .then(async (result) => {
            let test = result.identifiers;
            let ids = test.filter((item) => item.id !== undefined);
            /*for (let res in result.identifiers) {
                let data = await getOne(entity, result.identifiers[res].id);
                resultData.push(data);
            }*/
            return await dataSource
                .createQueryBuilder(entity, 'e')
                .where('e.id IN (:...ids)', { ids: ids })
                .getMany()
                .then(async (result) => {
                    return result;
                });
        });
};

export const archive = async <T extends EntityTarget<ObjectLiteral>>(
    entity: T,
    id: string,
    archived: boolean = false
) => {
    return await dataSource
        .createQueryBuilder(entity, 'e')
        .update(entity)
        .set({ archived: true })
        .where('id = :id AND archived = :archived', {
            id: id,
            archived: archived,
        })
        .execute()
        .then(async (result) => {
            return result;
        })
        .catch((error) => {
            return {
                error: error,
                message: 'Could not be archived, check if data is correct',
            };
        });
};

export const update = async <T extends EntityTarget<ObjectLiteral>>(
    entity: T,
    data: any,
    archived: boolean = false
) => {
    return await dataSource
        .createQueryBuilder(entity, 'e')
        .update(entity)
        .set(data)
        .whereInIds(data)
        .andWhere('archived = :archived', { archived: archived })
        .execute()
        .then(async (result) => {
            return result;
        })
        .catch((error) => {
            return {
                error: error,
                message: 'Could not be updated, check if data is correct',
            };
        });
};

export const remove = async <T extends EntityTarget<ObjectLiteral>>(
    entity: T,
    id: string
) => {
    return await dataSource
        .createQueryBuilder(entity, 'e')
        .delete()
        .from(entity)
        .where('id = :id', { id: id })
        .execute()
        .then(async (result) => {
            return result;
        });
    /*.catch((error) => {
            return {
                error: error,
                message: 'Could not be removed, check if data is correct',
            };
        });*/
};

export const getAllByAssetId = async <T extends EntityTarget<ObjectLiteral>>(
    entity: T,
    assetId: string,
    archived: boolean = false
) => {
    return await dataSource
        .createQueryBuilder(entity, 'e')
        .where('e.archived = (:archived) AND e.assetId = (:assetId)', {
            archived: archived,
            assetId: assetId,
        })
        .getMany()
        .then(async (result) => {
            return result;
        })
        .catch((error) => {
            return {
                error: error,
                message: 'Target does not contain Asset Ids',
            };
        });
};

export const getAllByAssetIds = async <T extends EntityTarget<ObjectLiteral>>(
    entity: T,
    assetIds: Array<string>,
    archived: boolean = false
) => {
    return await dataSource
        .createQueryBuilder(entity, 'e')
        .where('e.archived = (:archived) AND e.assetId IN (:...assetIds)', {
            archived: archived,
            assetIds: assetIds,
        })
        .getMany()
        .then(async (result) => {
            return result;
        })
        .catch((error) => {
            return {
                error: error,
                message: 'Target does not contain Asset Ids',
            };
        });
};
