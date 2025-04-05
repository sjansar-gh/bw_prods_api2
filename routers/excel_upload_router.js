import express from "express";
import multer from "multer";
import { logger } from "../utils/logger.js";
import { convertExcelToJson1 } from "../utils/xlsx_reader.js";
import {
  convertExcelToJson2,
  insertNewProductsToDB,
} from "../utils/xlsx_reader2.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
export const upload_router = express.Router();

upload_router
  .route("/data_sheet")
  .post(upload.single("file_name"), (req, resp) => {
    try {
      logger.info(req.url);
      logger.info(`form = ${req.body.name}, file = ${req.file.originalname}`);
      const file_name = req.file.originalname;
      resp.status(200).json({
        status: "success",
        msg: `File ${file_name} uploaded successfully`,
      });
    } catch (error) {
      logger.error(
        `Error! ${error} uploading the file ${req.file.originalname}`
      );
      resp.status(200).json({
        status: "error",
        msg: `Error! ${error} uploading the file ${req.file.originalname}.`,
      });
    }
  });

// upload_router.route("/convertToJson").get((req, resp) => {
//   logger.info(req.url);
//   const sheet_name = req.query.sheet;
//   console.log("sheet_name: ", sheet_name);
//   //convertExcelToJson1();
//   convertExcelToJson2();
//   resp.status(200).json({ msg: "convertToJson called" });
// });

//Convert excel to json file
upload_router.route("/convertToJson").get((req, resp) => {
  logger.info(req.url);
  try {
    const sheet_name = req.query.sheet;
    console.log("sheet_name: ", sheet_name);

    //convertExcelToJson1();
    const status = convertExcelToJson2(sheet_name);
    if (status == "success") {
      resp.status(200).json({
        status: "success",
        msg: "excel sheet converted to json successfully",
      });
    } else {
      resp
        .status(200)
        .json({ status: "error", msg: `Error in /convertToJson - ${error}` });
    }
  } catch (error) {
    logger.error(`Error! in /convertToJson - ${error}`);
    resp
      .status(200)
      .json({ status: "error", msg: `Error in /convertToJson - ${error}` });
  }
});

//json file uploaded to MDB
upload_router.route("/insertToDB").get(async (req, resp) => {
  logger.info(req.url);
  try {
    const status = await insertNewProductsToDB();
    if (status) {
      resp.status(200).json({
        status: "success",
        msg: "New data inserted to DB successfully",
      });
    } else {
      resp
        .status(200)
        .json({ status: "error", msg: "New data not inserted to DB" });
    }
  } catch (error) {
    logger.error(`Error! in /insert_new_data - ${error}`);
    resp
      .status(200)
      .json({ status: "error", msg: "Error! in /insert_new_data" });
  }
});
