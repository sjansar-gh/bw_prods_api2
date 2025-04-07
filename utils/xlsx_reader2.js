import xlsx from "xlsx";
import * as fw from "./file_writer.js";
import { logger } from "./logger.js";
import * as db_util from "../db/db_util.js";
import fs from "fs";
import * as constants from "../constants/constant.js";

export function convertExcelToJson2(sheet_name) {
  const upload_folder = constants.uploads_folder;
  // Read the file
  const excel_file_path = `${upload_folder}/${sheet_name}`;
  try {
    const sheet_exist = fw.doesFileExist(excel_file_path);
    if (sheet_exist) {
      const workbook = xlsx.readFile(excel_file_path);

      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert excel sheet to JSON data
      const json_data = xlsx.utils.sheet_to_json(worksheet, {
        header: 0,
        defval: "",
      });

      // Convert excel sheet to JSON data
      //json_data = sheetToJsonArray(worksheet);

      if (json_data) {
        logger.info(`json_data length: ${json_data.length}`);

        //write json data to json file
        const json_file_path = `${upload_folder}/products_json_latest.json`;
        let status = "error";
        fw.createJsonFile(json_file_path, json_data);
        if (fw.doesFileExist(json_file_path)) {
          status = "success";
        } else {
          status = "error";
        }

        //get latest excel file
        // const latest_excel_file = fw.getLatestExcelFile(upload_folder);
        // logger.info(`latest_excel_file: ${latest_excel_file}`);
        // console.log(`latest_excel_file: ${latest_excel_file}`);
        return status;
      }
    }
  } catch (error) {
    logger.error(`Error! in convertExcelToJson2() - ${error}`);
    return "error";
  }
}

function sheetToJsonArray(sheet) {
  var result = [];
  var row;
  var rowNum;
  var colNum;
  var header = [];
  var jsonObj;
  let numHeaders = ["gtin", "weight", "price"];
  var range = xlsx.utils.decode_range(sheet["!ref"]);

  for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    row = [];
    jsonObj = {};
    if (rowNum === 0) {
      for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
        var nextCell = sheet[xlsx.utils.encode_cell({ r: rowNum, c: colNum })];
        if (typeof nextCell === "undefined") {
          header.push("");
        } else header.push(nextCell.w.toString());
      }
    } else {
      for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
        var nextCell = sheet[xlsx.utils.encode_cell({ r: rowNum, c: colNum })];
        if (typeof nextCell === "undefined") {
          if (numHeaders.includes(header[colNum]))
            jsonObj[header[colNum]] = Number(0);
          else jsonObj[header[colNum]] = "";
        } else {
          if (numHeaders.includes(header[colNum])) {
            if (!isNaN(nextCell.w))
              jsonObj[header[colNum]] = Number(nextCell.w);
            else jsonObj[header[colNum]] = Number(0);
          } else jsonObj[header[colNum]] = nextCell.w;
        }
      }
      result.push(jsonObj);
    }
  }
  return result;
}

//Insert latest json file to DB
export async function insertNewProductsToDB() {
  let data_inserted = false;
  const upload_folder = constants.uploads_folder;
  try {
    const json_file_exist = fs.existsSync(
      `${upload_folder}/products_json_latest.json`
    );
    if (json_file_exist) {
      data_inserted = await db_util.insertLatestProducts();
      logger.info(`insertNewProductsToDB() - data_inserted ${data_inserted}`);
    } else {
      logger.error("JSON file products_json_latest.json does not exist");
    }
  } catch (error) {
    logger.error(`Error! in db_util.insertDataInBatches(): ${error}`);
    data_inserted = false;
  }
  return data_inserted;
}
