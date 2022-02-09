import { Pool } from "pg";
import config from "config";
import logger from "./logger";

function connect() {
    try {
        const pool = new Pool(config.get<object>('dbConnectionCredentials'));
        if (pool) logger.info("Successfully connected to db");
        return pool;
    } catch (error: any) {
        logger.error(`Could not connect to db: ${error.message}`);
    }
}

export default connect;