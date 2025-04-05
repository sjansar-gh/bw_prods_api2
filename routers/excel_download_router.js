import express from "express";
import * as fs from "fs";
import { logger } from "../utils/logger.js";
import { getAllProducts } from "../mdb_api/mdb_api.js";

//
import {
  convertJSONToExcel,
  createProductsJsonFile,
} from "../utils/file_writer.js";

const download_folder = "./downloads";
export const download_router = express.Router();

download_router.route("/excel_sheet").get(async (req, resp) => {
  logger.info(req.url);

  //create products json file
  const json_file = "products_full.json";
  const excel_file_name = "products_sheet.xlsx";
  let json_file_status = await createProductsJsonFile(json_file);

  if (!json_file_status) {
    resp.status(404).json({ msg: "JSON file not created" });
    return;
  }

  //convert json to excel
  convertJSONToExcel(json_file, excel_file_name);

  //
  let stats = fs.statfsSync(`${download_folder}/${excel_file_name}`);
  logger.info(`size = ${stats?.bsize}`);
  const file_size = stats?.bsize | 0;

  var options = {
    root: ".",
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Length": file_size,
      "Content-Disposition": `attachment; filename="${excel_file_name}"`,
    },
  };

  resp
    .status(200)
    .sendFile(`${download_folder}/${excel_file_name}`, options, (err) => {
      if (err) {
        logger.error("Error! " + err);
      } else {
        logger.error("Excel file sent successfully");
      }
    });
});
