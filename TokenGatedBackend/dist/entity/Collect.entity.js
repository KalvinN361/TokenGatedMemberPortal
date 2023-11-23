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
exports.CollectEntity = void 0;
const typeorm_1 = require("typeorm");
const PVBase_entity_1 = require("./PVBase.entity");
let CollectEntity = exports.CollectEntity = class CollectEntity extends PVBase_entity_1.PVBaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ length: 32 }),
    __metadata("design:type", String)
], CollectEntity.prototype, "shortName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 64 }),
    __metadata("design:type", String)
], CollectEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1024 }),
    __metadata("design:type", String)
], CollectEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1024 }),
    __metadata("design:type", String)
], CollectEntity.prototype, "bgImage", void 0);
exports.CollectEntity = CollectEntity = __decorate([
    (0, typeorm_1.Entity)('Collects')
], CollectEntity);
