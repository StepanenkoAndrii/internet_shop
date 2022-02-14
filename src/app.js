"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const body_parser_1 = __importDefault(require("body-parser"));
const connect_1 = __importDefault(require("./utils/connect"));
const logger_1 = __importDefault(require("./utils/logger"));
const main_router_1 = __importDefault(require("./routes/main.router"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
const port = config_1.default.get('port') || 8080;
const pool = (0, connect_1.default)();
app.listen(port, () => {
    logger_1.default.info(`Server started on port ${port}`);
    try {
        app.use('', main_router_1.default);
    }
    catch (error) {
        logger_1.default.error(`Either server connection or routes error: ${error.message}`);
    }
});
exports.default = pool;
