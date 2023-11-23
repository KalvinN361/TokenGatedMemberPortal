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
exports.allViewableMediaByAsset = exports.getMediaByAsset = void 0;
const entity_1 = require("../../entity");
const assetManager_1 = require("./assetManager");
const baseManager_1 = require("./baseManager");
const getMediaByAsset = (assetId) => __awaiter(void 0, void 0, void 0, function* () {
    let asset = (yield (0, assetManager_1.getAssetOne)(assetId));
    let media = (yield (0, baseManager_1.getAll)(entity_1.MediaEntity));
    let viewableMedia = yield (0, exports.allViewableMediaByAsset)(media, asset);
});
exports.getMediaByAsset = getMediaByAsset;
const allViewableMediaByAsset = (media, asset) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let viewableMedia = [];
    let contractId = asset.contractId;
    let team = (_a = asset.attributes.filter((attr) => attr.traitType === 'Colorway')[0]) === null || _a === void 0 ? void 0 : _a.value;
    let story = asset.name;
    for (let m of media) {
        if (m.map.all) {
            viewableMedia.push(m);
        }
        if (m.map.contracts.length > 0) {
            if (m.map.contracts.includes(contractId) &&
                !viewableMedia.includes(m)) {
                viewableMedia.push(m);
            }
        }
        if (m.map.teams.length > 0) {
            if (m.map.teams.includes(team) && !viewableMedia.includes(m)) {
                viewableMedia.push(m);
            }
        }
        if (m.map.stories.length > 0) {
            if (m.map.stories.includes(story) && !viewableMedia.includes(m)) {
                viewableMedia.push(m);
            }
        }
        if (m.map.assets.length > 0) {
            if (m.map.assets.includes(asset.id) && !viewableMedia.includes(m)) {
                viewableMedia.push(m);
            }
        }
    }
    return viewableMedia;
});
exports.allViewableMediaByAsset = allViewableMediaByAsset;
