import * as mdb_api from "../mdb_api/mdb_api.js";
import { logger } from "../utils/logger.js";

export async function getAllProducts() {
  try {
    const prods = await mdb_api.getAllProducts();
    if (prods && prods.length > 0) {
      return prods;
    }
  } catch (error) {
    logger.error(`Error! in db_util.getAllProducts() - ${error}`);
    return [];
  }
}

export async function insertLatestProducts() {
  let inserted = false;
  try {
    const delete_resp = await mdb_api.deleteAllProducts();
    let delete_count = delete_resp.deletedCount;
    if (delete_resp && delete_resp.acknowledged) {
      console.log("delete_resp: " + JSON.stringify(delete_resp));
      console.log("delete_count = " + delete_count);

      logger.info(`delete_resp: ${JSON.stringify(delete_resp)}`);
      logger.info(`delete_count: ${delete_count}`);
    }

    if (delete_resp.acknowledged && delete_count >= 0)
      inserted = await mdb_api.insertDataInBatches();
    else {
      throw Error(
        `Error! while deleting Products, delete_count = ${delete_count}`
      );
    }
  } catch (error) {
    logger.error(`Error - ${error}`);
    inserted = false;
  }
  return inserted;
}
