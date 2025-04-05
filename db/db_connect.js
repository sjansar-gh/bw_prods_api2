import { connect } from "mongoose";
import { logger } from "../utils/logger.js";

export const dbConnect = async () => {
  try {
    await connect(process.env.MDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongoose connected successfully");
    logger.info("Mongoose connected successfully");
  } catch (err) {
    console.log("Error occured while connecting to Mongodb");
    logger.info(`Error! ${err}`);
  }
};
