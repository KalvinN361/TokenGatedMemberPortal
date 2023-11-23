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
exports.Token1155Entity = void 0;
const typeorm_1 = require("typeorm");
const PVBase_entity_1 = require("./PVBase.entity");
const Asset1155_entity_1 = require("./Asset1155.entity");
const Contract_entity_1 = require("./Contract.entity");
let Token1155Entity = exports.Token1155Entity = class Token1155Entity extends PVBase_entity_1.PVBaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ length: 16 }),
    __metadata("design:type", String)
], Token1155Entity.prototype, "tokenId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Token1155Entity.prototype, "supply", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Token1155Entity.prototype, "maxSupply", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Token1155Entity.prototype, "contractId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 128 }),
    __metadata("design:type", String)
], Token1155Entity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1024 }),
    __metadata("design:type", String)
], Token1155Entity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 256 }),
    __metadata("design:type", String)
], Token1155Entity.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 256 }),
    __metadata("design:type", String)
], Token1155Entity.prototype, "animation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Asset1155_entity_1.Asset1155Entity, (asset1155) => asset1155['token1155']),
    __metadata("design:type", Array)
], Token1155Entity.prototype, "assets1155", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Contract_entity_1.ContractEntity, (contract) => contract['tokens1155']),
    __metadata("design:type", Contract_entity_1.ContractEntity)
], Token1155Entity.prototype, "contract", void 0);
exports.Token1155Entity = Token1155Entity = __decorate([
    (0, typeorm_1.Entity)('Tokens1155')
], Token1155Entity);
