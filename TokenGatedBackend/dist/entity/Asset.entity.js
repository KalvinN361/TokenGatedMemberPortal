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
exports.AssetEntity = void 0;
const typeorm_1 = require("typeorm");
const PVBase_entity_1 = require("./PVBase.entity");
const Attribute_entity_1 = require("./Attribute.entity");
const Contract_entity_1 = require("./Contract.entity");
const Owner_entity_1 = require("./Owner.entity");
const Claim_entity_1 = require("./Claim.entity");
const Shop_entity_1 = require("./Shop.entity");
let AssetEntity = exports.AssetEntity = class AssetEntity extends PVBase_entity_1.PVBaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ length: 16 }),
    __metadata("design:type", String)
], AssetEntity.prototype, "tokenId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssetEntity.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssetEntity.prototype, "contractId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 64 }),
    __metadata("design:type", String)
], AssetEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 256 }),
    __metadata("design:type", String)
], AssetEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssetEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 512 }),
    __metadata("design:type", String)
], AssetEntity.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 512 }),
    __metadata("design:type", String)
], AssetEntity.prototype, "imageSmall", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 512 }),
    __metadata("design:type", String)
], AssetEntity.prototype, "animation", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 512 }),
    __metadata("design:type", String)
], AssetEntity.prototype, "animationSmall", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], AssetEntity.prototype, "reserve", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Attribute_entity_1.AttributeEntity, (attribute) => attribute['asset']),
    __metadata("design:type", Array)
], AssetEntity.prototype, "attributes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Contract_entity_1.ContractEntity, (contract) => contract['assets']),
    __metadata("design:type", Contract_entity_1.ContractEntity)
], AssetEntity.prototype, "contract", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Owner_entity_1.OwnerEntity, (owner) => owner['assets']),
    __metadata("design:type", Owner_entity_1.OwnerEntity)
], AssetEntity.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Claim_entity_1.ClaimEntity, (claim) => claim['asset']),
    __metadata("design:type", Claim_entity_1.ClaimEntity)
], AssetEntity.prototype, "claim", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Shop_entity_1.ShopEntity, (shop) => shop['asset']),
    __metadata("design:type", Shop_entity_1.ShopEntity)
], AssetEntity.prototype, "shop", void 0);
exports.AssetEntity = AssetEntity = __decorate([
    (0, typeorm_1.Entity)('Assets')
], AssetEntity);
