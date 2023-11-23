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
exports.ShopEntity = void 0;
const typeorm_1 = require("typeorm");
const PVBase_entity_1 = require("./PVBase.entity");
const Asset_entity_1 = require("./Asset.entity");
let ShopEntity = exports.ShopEntity = class ShopEntity extends PVBase_entity_1.PVBaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ShopEntity.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16 }),
    __metadata("design:type", String)
], ShopEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric' }),
    __metadata("design:type", Number)
], ShopEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Asset_entity_1.AssetEntity, (asset) => asset['shop']),
    (0, typeorm_1.JoinColumn)({ name: 'assetId' }),
    __metadata("design:type", Asset_entity_1.AssetEntity)
], ShopEntity.prototype, "asset", void 0);
exports.ShopEntity = ShopEntity = __decorate([
    (0, typeorm_1.Entity)('Shops')
], ShopEntity);
