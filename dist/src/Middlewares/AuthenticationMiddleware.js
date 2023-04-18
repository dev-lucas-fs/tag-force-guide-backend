"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jwt = __importStar(require("jsonwebtoken"));
const NotFoundError_1 = __importDefault(require("../Errors/NotFoundError"));
const Prisma_1 = require("../Configs/Prisma");
async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader)
            return generateUnauthorizedResponse(res);
        const token = authHeader.split(" ")[1];
        if (!token)
            return generateUnauthorizedResponse(res);
        const { id } = jwt.verify(token, process.env.JWT_SECRET ?? "segredo");
        console.log(id);
        const user = await Prisma_1.prisma.user.findFirst({ where: { id } });
        if (user === null)
            return generateUnauthorizedResponse(res);
        req.userId = user.id;
    }
    catch (err) {
        console.log(err);
    }
    return next();
}
exports.authenticateToken = authenticateToken;
function generateUnauthorizedResponse(res) {
    res.status(http_status_1.default.UNAUTHORIZED).send(NotFoundError_1.default);
}
