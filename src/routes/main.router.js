"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const v1_router_1 = __importDefault(require("./v1.router"));
const router = express_1.default.Router();
router.get("/check", (req, res) => {
    res.sendStatus(200);
});
router.use("/api/v1", v1_router_1.default);
exports.default = router;
