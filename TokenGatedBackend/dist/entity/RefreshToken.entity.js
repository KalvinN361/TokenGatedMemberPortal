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
exports.RefreshTokenEntity = void 0;
const typeorm_1 = require("typeorm");
const Owner_entity_1 = require("./Owner.entity");
const PVBase_entity_1 = require("./PVBase.entity");
let RefreshTokenEntity = exports.RefreshTokenEntity = class RefreshTokenEntity extends PVBase_entity_1.PVBaseEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RefreshTokenEntity.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RefreshTokenEntity.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Owner_entity_1.OwnerEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Owner_entity_1.OwnerEntity)
], RefreshTokenEntity.prototype, "owner", void 0);
exports.RefreshTokenEntity = RefreshTokenEntity = __decorate([
    (0, typeorm_1.Entity)('RefreshTokens')
], RefreshTokenEntity);