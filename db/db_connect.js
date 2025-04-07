import { connect } from "mongoose";
import { logger } from "../utils/logger.js";
import { mdb_url } from "../constants/constant.js";

export const dbConnect = async () => {
  try {
    await connect(mdb_url, {
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
