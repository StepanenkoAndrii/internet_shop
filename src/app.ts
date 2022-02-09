import express from "express";
import config from "config";
import bodyParser from "body-parser";
import connect from "./utils/connect";
import logger from "./utils/logger";
import mainRouter from "./routes/main.router";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

const port = config.get<number>('port') || 8000;
const pool = connect();

app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
    try {
        app.use('', mainRouter);
    } catch (error: any) {
        logger.error(`Either server connection or routes error: ${error.message}`);
    }
});

export default pool;