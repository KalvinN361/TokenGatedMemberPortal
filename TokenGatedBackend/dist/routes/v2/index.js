"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v2routes = void 0;
const express_1 = require("express");
const unauthenticated_1 = require("./unauthenticated");
const authenticated_1 = require("./authenticated");
exports.v2routes = (0, express_1.Router)();
exports.v2routes.use(unauthenticated_1.unauthenticatedRoutes);
exports.v2routes.use(authenticated_1.authenticatedRoutes);
