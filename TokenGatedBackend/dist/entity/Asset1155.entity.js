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
exports.Asset1155Entity = void 0;
const typeorm_1 = require("typeorm");
const PVBase_entity_1 = require("./PVBase.entity");
const Contract_entity_1 = require("./Contract.entity");
const Owner_entity_1 = require("./Owner.entity");
const Token1155_entity_1 = require("./Token1155.entity");
let Asset1155Entity = exports.Asset1155Entity = class Asset1155Entity extends PVBase_entity_1.PVBaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Asset1155Entity.prototype, "token1155Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Asset1155Entity.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Asset1155Entity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Token1155_entity_1.Token1155Entity, (token1155) => token1155['assets1155']),
    __metadata("design:type", Contract_entity_1.ContractEntity)
], Asset1155Entity.prototype, "token1155", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Owner_entity_1.OwnerEntity, (owner) => owner['assets1155']),
    __metadata("design:type", Owner_entity_1.OwnerEntity)
], Asset1155Entity.prototype, "owner", void 0);
exports.Asset1155Entity = Asset1155Entity = __decorate([
    (0, typeorm_1.Entity)('Assets1155')
], Asset1155Entity);
