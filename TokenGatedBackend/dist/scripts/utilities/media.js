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
exports.getMediaForAssetAndType = exports.getMediaForAsset = void 0;
const entity_1 = require("../../entity");
const database_1 = require("./database");
const getMediaForAsset = (asset) => __awaiter(void 0, void 0, void 0, function* () {
    if (!asset)
        return null;
    const allMedia = (yield database_1.dataSource
        .createQueryBuilder(entity_1.MediaEntity, 'm')
        .where('m.archived=:archived', {
        archived: false,
    })
        .getMany());
    return getAllMedia(allMedia, asset);
});
exports.getMediaForAsset = getMediaForAsset;
const getMediaForAssetAndType = (asset, type) => __awaiter(void 0, void 0, void 0, function* () {
    if (!asset)
        return null;
    const allMedia = (yield database_1.dataSource
        .createQueryBuilder(entity_1.MediaEntity, 'm')
        .where('m.archived=:archived and m.type=:type', {
        archived: false,
        type: type,
    })
        .getMany());
    return getAllMedia(allMedia, asset);
});
exports.getMediaForAssetAndType = getMediaForAssetAndType;
const getAllMedia = (allMedia, asset) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mediaArray = [];
    const contractId = asset.contractId;
    const team = (_a = asset.attributes.filter((attr) => attr.traitType === 'Colorway')[0]) === null || _a === void 0 ? void 0 : _a.value;
    const story = asset.name;
    for (const media of allMedia) {
        if (media.map.all) {
            mediaArray.push(media);
        }
        if (media.map.contracts.length > 0) {
            if (media.map.contracts.includes(contractId) &&
                !mediaArray.includes(media)) {
                mediaArray.push(media);
            }
        }
        if (media.map.teams.length > 0) {
            if (media.map.teams.includes(team) && !mediaArray.includes(media)) {
                mediaArray.push(media);
            }
        }
        if (media.map.stories.length > 0) {
            if (media.map.stories.includes(story) &&
                !mediaArray.includes(media)) {
                mediaArray.push(media);
            }
        }
        if (media.map.assets.length > 0) {
            if (media.map.assets.includes(asset.id) &&
                !mediaArray.includes(media)) {
                mediaArray.push(media);
            }
        }
    }
    return mediaArray;
});
