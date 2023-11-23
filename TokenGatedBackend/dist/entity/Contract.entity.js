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
exports.ContractEntity = void 0;
const typeorm_1 = require("typeorm");
const PVBase_entity_1 = require("./PVBase.entity");
const Asset_entity_1 = require("./Asset.entity");
const Token1155_entity_1 = require("./Token1155.entity");
let ContractEntity = exports.ContractEntity = class ContractEntity extends PVBase_entity_1.PVBaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 256 }),
    __metadata("design:type", String)
], ContractEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 64 }),
    __metadata("design:type", String)
], ContractEntity.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 64 }),
    __metadata("design:type", String)
], ContractEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: ['ERC20', 'ERC721', 'ERC1155'], default: 'ERC721' }),
    __metadata("design:type", String)
], ContractEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: ['custom', 'hypermint', 'aspen'], default: 'hypermint' }),
    __metadata("design:type", String)
], ContractEntity.prototype, "minter", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: [1, 5, 137, 8001], default: 1 }),
    __metadata("design:type", Number)
], ContractEntity.prototype, "chainId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 512 }),
    __metadata("design:type", String)
], ContractEntity.prototype, "chainURL", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 256 }),
    __metadata("design:type", String)
], ContractEntity.prototype, "chainAPIKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ContractEntity.prototype, "partnerContractId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", String)
], ContractEntity.prototype, "abi", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 512 }),
    __metadata("design:type", String)
], ContractEntity.prototype, "deployedBlock", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ContractEntity.prototype, "burnable", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 64, nullable: true }),
    __metadata("design:type", String)
], ContractEntity.prototype, "burnNow", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ContractEntity.prototype, "maxSupply", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Asset_entity_1.AssetEntity, (asset) => asset['contract']),
    __metadata("design:type", Array)
], ContractEntity.prototype, "assets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Token1155_entity_1.Token1155Entity, (token1155) => token1155['contract']),
    __metadata("design:type", Array)
], ContractEntity.prototype, "tokens1155", void 0);
exports.ContractEntity = ContractEntity = __decorate([
    (0, typeorm_1.Entity)('Contracts')
], ContractEntity);
