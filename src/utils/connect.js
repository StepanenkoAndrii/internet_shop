"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
function connect() {
    try {
        const pool = new pg_1.Pool(config_1.default.get('dbConnectionCredentials'));
        if (pool)
            logger_1.default.info("Successfully connected to db");
        return pool;
    }
    catch (error) {
        logger_1.default.error(`Could not connect to db: ${error.message}`);
    }
}
exports.default = connect;
