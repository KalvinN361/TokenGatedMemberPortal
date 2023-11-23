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
exports.AttributeEntity = void 0;
const typeorm_1 = require("typeorm");
const PVBase_entity_1 = require("./PVBase.entity");
const Asset_entity_1 = require("./Asset.entity");
let AttributeEntity = exports.AttributeEntity = class AttributeEntity extends PVBase_entity_1.PVBaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ length: 64 }),
    __metadata("design:type", String)
], AttributeEntity.prototype, "traitType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AttributeEntity.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AttributeEntity.prototype, "metadataId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AttributeEntity.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Asset_entity_1.AssetEntity, (asset) => asset.attributes),
    __metadata("design:type", Asset_entity_1.AssetEntity)
], AttributeEntity.prototype, "asset", void 0);
exports.AttributeEntity = AttributeEntity = __decorate([
    (0, typeorm_1.Entity)('Attributes')
], AttributeEntity);
