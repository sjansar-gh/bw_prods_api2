//import { fs } from 'node:fs';
import * as fs from "fs";
import path from "path";
import xlsx from "xlsx";
//import { getAllProducts, insertDataInBatches } from "../mdb_api/mdb_api.js";
import * as db_util from "../db/db_util.js";
import { logger } from "./logger.js";
import * as constants from "../constants/constant.js";

const downloads_folder = constants.downloads_folder;
//const content = 'Some content!';

//create json file from json data.
export function createJsonFile(filePath, content) {
  fs.writeFile(filePath, JSON.stringify(content, null, 2), (err) => {
    if (err) {
      logger.error(`Error! createJsonFile() - ${err}`);
    } else {
      logger.info(`json file ${filePath} created`);
    }
  });
}

//convert json file to excel file.
export function convertJSONToExcel(json_file, excel_file_name) {
  const json_file_path = `${downloads_folder}/${json_file}`;
  try {
    let products_data = fs.readFileSync(json_file_path, { encoding: "utf-8" });
    if (products_data) {
      const json_data = JSON.parse(products_data);
      createExcelFile(json_data, excel_file_name);
    } else {
      logger.error("Error in convertJSONToExcel()");
    }
  } catch (err) {
    logger.error(`Error! convertJSONToExcel()- ${err}`);
  }
}

//create excel file from json data.
function createExcelFile(json_data, excel_file_name) {
  //const excel_file_name = "products_sheet.xlsx";
  try {
    const work_sheet = xlsx.utils.json_to_sheet(json_data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, work_sheet, "Sheet1");

    //Save excel file to disk
    const excel_file_path = `${downloads_folder}/${excel_file_name}`;
    xlsx.writeFile(workbook, excel_file_path);
    logger.info(`Excel file created successfully at: ${excel_file_path}`);
  } catch (err) {
    logger.error(`Error! in createExcelFile() ${err}`);
  }
}

//fetch all products from MDB and then create json file.
export async function createProductsJsonFile(json_file) {
  let json_file_created = false;
  try {
    const prods = await db_util.getAllProducts();
    logger.info(`total prods: ${prods?.length}`);
    if (!prods || !(prods.length > 1000)) {
      throw Error("Error in db_util.getAllPructs()");
    }
    const json_prods = JSON.stringify(prods, null, 2);
    fs.writeFileSync(`${downloads_folder}/${json_file}`, json_prods, {
      encoding: "utf-8",
    });
    const stat_json_file = fs.statSync(`${downloads_folder}/${json_file}`);
    if (stat_json_file && stat_json_file.size > 0) {
      logger.info(`${json_file} created`);
      json_file_created = true;
    }
  } catch (err) {
    logger.error(`Error! ${err}`);
  }
  return json_file_created;
}

//Get latest Excel file
export function getLatestExcelFile(dirPath) {
  let latest_file = null;
  let latest_file_size = 0;
  let latest_m_time = 0;
  let upload_folder = constants.uploads_folder;

  try {
    // let src_file = `${upload_folder}/product_sheet_3_26_2025_12_46_55.xlsx`;
    // let dest_file = `${upload_folder}/products_sheet_latest.xlsx`;
    // const files_exists = fs.existsSync(
    //   `${upload_folder}/product_sheet_3_26_2025_12_46_55.xlsx`
    // );
    // if (files_exists) {
    //   fs.copyFileSync(src_file, dest_file);
    // }
    // logger.info(`file ${dest_file} created`);
    // logger.info(`${src_file} exist: ${files_exists}`);

    let files = fs.readdirSync(dirPath);
    files = files.filter((f) => f.endsWith(".xlsx"));
    if (files) {
      logger.info(`Total xlsx files: ${files.length}`);
    }

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile() && stats.mtimeMs > latest_m_time) {
        latest_file = file;
        latest_file_size = stats.size;
        latest_m_time = stats.mtimeMs;
      }
    }
    logger.info(`Latest excel file: ${latest_file}, size: ${latest_file_size}`);
  } catch (error) {
    logger.error(`Error! occurred in getLatestExcelFile() ${error}`);
  }
  return latest_file;
}

export function doesFileExist(file_path) {
  let file_exist = false;
  try {
    file_exist = fs.existsSync(file_path);
  } catch (error) {
    logger.error(`Error! occurred in doesFileExist ${error}`);
  }
  return file_exist;
}
