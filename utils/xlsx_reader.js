import xlsx from "xlsx";
import * as fw from "./file_writer.js";
import * as constants from "../constants/constant.js";

export function convertExcelToJson1() {
  // Read the file
  const upload_folder_path = constants.uploads_folder;
  //const workbook = xlsx.readFile(`${upload_folder_path}/bw_mini_db_30.xlsx`);
  //const workbook = xlsx.readFile(`${upload_folder_path}/bw_full_data_2024.xlsx`);
  const workbook = xlsx.readFile(
    `${upload_folder_path}/product_sheet_3_26_2025_12_46_55.xlsx`
  );

  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  //const range = worksheet["!ref"];
  //var range = xlsx.utils.decode_range(sheet['!ref']);

  // Convert sheet to JSON
  // const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 0 });
  // console.log('jsonData = ', jsonData);
  // console.log('length = ', jsonData.length)

  let result = sheet2arr(worksheet);
  //console.log('result = ', result);
  console.log("result.length = ", result.length);
  fw.createJsonFile(`${upload_folder_path}/test3_1_full.json`, result);
}

var sheet2arr = function (sheet) {
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
};

export async function insertNewProductsToDB() {
  let data_inserted = false;
  try {
    data_inserted = await db_util.insertDataInBatches();
  } catch (error) {
    logger.error(`Error! in db_util.insertDataInBatches()`);
    data_inserted = false;
  }
  return data_inserted;
}
