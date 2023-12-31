"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataEntity = void 0;
const typeorm_1 = require("typeorm");
const PVBase_entity_1 = require("./PVBase.entity");
let MetadataEntity = exports.MetadataEntity = class MetadataEntity extends PVBase_entity_1.PVBaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ length: 16 }),
    __metadata("design:type", String)
], MetadataEntity.prototype, "tokenId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 256 }),
    __metadata("design:type", String)
], MetadataEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 256 }),
    __metadata("design:type", String)
], MetadataEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 512 }),
    __metadata("design:type", String)
], MetadataEntity.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 512 }),
    __metadata("design:type", String)
], MetadataEntity.prototype, "imageSmall", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 512 }),
    __metadata("design:type", String)
], MetadataEntity.prototype, "animation", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 512 }),
    __metadata("design:type", String)
], MetadataEntity.prototype, "animationSmall", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MetadataEntity.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MetadataEntity.prototype, "contractId", void 0);
exports.MetadataEntity = MetadataEntity = __decorate([
    (0, typeorm_1.Entity)('Metadata')
], MetadataEntity);
