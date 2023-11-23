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
exports.whoAmIRoute = void 0;
const express_1 = require("express");
const utilities_1 = require("../../../scripts/utilities");
exports.whoAmIRoute = (0, express_1.Router)();
exports.whoAmIRoute.post('/Auth/WhoAmI', utilities_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(req.decodedAddress);
}));
