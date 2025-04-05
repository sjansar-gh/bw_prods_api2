import express from "express";
import "dotenv/config";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { logger } from "./utils/logger.js";
import { logEntry } from "./utils/log_util.js";

//https
const https = await import("node:https");
import fs from "fs";

import * as prod_api from "./mdb_api/mdb_api.js";
import * as auth_api from "./mdb_api/user_api.js";
import { upload_router } from "./routers/excel_upload_router.js";
import { download_router } from "./routers/excel_download_router.js";
import * as constants from "./constants/constant.js";

// import { read_xlx_file } from './utils/xlsx_reader.js'
// import { read_xlx_file2 } from './utils/xlsx_reader2.js'

const PORT = process.env.PORT | 8000;
const app = express();
app.use(cors(constants.CORS_OPT));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//xlsx
//read_xlx_file();
//Read xlsx file and convert to json file.
//read_xlx_file2();
//insertDataInBatches();

//Routes
app.use("/api/upload", upload_router);
app.use("/api/download", download_router);

//Root
app.get("/api/", (req, res) => {
  logEntry(req);
  return res.status(200).json({
    msg: "welcome to node api",
  });
});

//Products by sku
app.get("/api/products/:sku", async (req, res) => {
  logEntry(req);
  let sku = req.params.sku;
  const product = await prod_api.getBySKU(sku);
  if (product) {
    logger.info(`sku: ${product.sku}`);
    res.status(200).json(product);
  } else {
    res.status(200).json(product);
  }
});

//Products by gtin
app.get("/api/products/gtin/:gtin", async (req, res) => {
  logEntry(req);
  let gtin = req.params.gtin;
  const product = await prod_api.getByGTIN(gtin);
  if (product != null) {
    logger.info(`gtin: ${product.gtin}`);
    res.status(200).json(product);
  } else {
    res.status(200).json(product);
  }
});

//Get skus
app.get("/api/skus", async (req, res) => {
  logEntry(req);
  const skus = await prod_api.getSKUs();
  if (skus != null) {
    logger.info(`skus: ${skus.length}`);
    let skusArr = [];
    for (let skuObj of skus) {
      //logger.info(skuObj.sku);
      skusArr.push(skuObj.sku);
    }
    res.status(200).json(skusArr);
  } else {
    res.status(200).json(skus);
  }
});

//Get skus by regex
app.get("/api/skus/:skuStr", async (req, res) => {
  logEntry(req);
  let skuLike = req.params.skuStr;
  const skus = await prod_api.getSKUsLike(skuLike);
  if (skus != null) {
    logger.info(`skus: ${skus?.length}`);
    let skusArr = [];
    for (let skuObj of skus) {
      //logger.info(skuObj.sku);
      skusArr.push(skuObj.sku);
    }
    res.status(200).json(skusArr);
  } else {
    res.status(200).json(skus);
  }
});

//Product update
app.put("/api/products/update", async (req, res) => {
  logEntry(req);
  let sku = req.query.sku;
  let prodJson = req.body;
  logger.info(`sku: ${sku}`);
  logger.info(`prodJson: ${prodJson}`);

  let resp = await prod_api.editProduct(sku, prodJson);
  return res.status(200).json({
    msg: resp,
  });
});

//Get categories
app.get("/api/categories", async (req, res) => {
  logEntry(req);
  let category = req.query.category;
  logger.info(`category: ${category}`);
  const products = await prod_api.getProdsByCategory(category);
  if (products != null) {
    //logger.info(products);
    res.status(200).json(products);
  } else {
    res.status(200).json("{}");
  }
});

//Get unique categories
app.get("/api/unique_categories", async (req, res) => {
  logEntry(req);
  const categories = await prod_api.getUniqueCategories();
  if (categories != null) {
    // logger.info(JSON.stringify(categories))
    res.status(200).json(categories);
  } else {
    res.status(200).json("[]");
  }
});

//User service routes
//Get all users
app.get("/api/users", async (req, res) => {
  logEntry(req);
  const users = await auth_api.getAllUsers();
  if (users) {
    logger.info(users);
    res.status(200).json(users);
  } else {
    res.status(200).json("[]");
  }
});

//Get user profile
app.get("/api/user", async (req, res) => {
  logEntry(req);
  let email_id = req.query.email;
  if (email_id) {
    const user_found = await auth_api.getUserProfile(email_id);
    if (user_found) {
      logger.info(`user_found = ${user_found}`);
      res.status(200).json(user_found);
    } else {
      res.status(200).json({ email: email_id, msg: "user_not_found" });
    }
  } else {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ email: email_id, msg: "bad_request" });
  }
});

//createUser()
app.post("/api/users", async (req, resp) => {
  logEntry(req);
  const userPayload = req.body;
  let userCteated = null;

  if (userPayload) {
    userCteated = await auth_api.createUser(userPayload);

    if (userCteated) {
      resp.status(StatusCodes.CREATED).json({
        email: userCteated.email,
        status: "created",
      });
    } else {
      resp.status(StatusCodes.OK).json({
        email: userPayload.email,
        status: "exists",
      });
    }
  }
});

app.put("/api/users", async (req, resp) => {
  logEntry(req);
  let email_id = req.query.email;
  let user_json = req.body;

  logger.info(`email_id: ${email_id}`);
  logger.info(`user_json: ${user_json}`);

  if (!email_id || Object.keys(user_json).length === 0) {
    return resp.status(StatusCodes.BAD_REQUEST).json({
      msg: "bad_request",
      status: "failed",
    });
  }

  let update_resp = await auth_api.updateUser(email_id, user_json);
  if (update_resp) {
    return resp.status(StatusCodes.OK).json({
      email: email_id,
      status: update_resp,
    });
  } else {
    return resp.status(StatusCodes.BAD_REQUEST).json({
      email: email_id,
      status: "failed",
    });
  }
});

//login
app.post("/api/users/login", async (req, resp) => {
  logEntry(req);
  const { email, password } = req.body;
  let user = null;
  logger.info(`cookies: ${JSON.stringify(req.cookies)}`);
  logger.info(`headers: ${JSON.stringify(req.headers)}`);

  if (email && password) {
    user = await auth_api.userExist(email, password);
  }

  if (user) {
    const userWithToken = generateWebToken(user);

    //cookies
    resp.cookie("token", userWithToken.token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });

    resp.status(200).json({
      name: user.last_name + ", " + user.first_name,
      email,
      status: "success",
      admin: user.admin,
      token: userWithToken.token,
    });
  } else {
    resp.status(StatusCodes.BAD_REQUEST).json({
      email,
      status: "failed",
    });
  }
});

app.delete("/api/users", async (req, resp) => {
  logEntry(req);
  let email_id = req.query.email;

  if (email_id) {
    let del_resp = await auth_api.deleteUser(email_id);
    logger.info(`deleteResp = ${del_resp}`);
    if (del_resp.deletedCount > 0) {
      resp.status(StatusCodes.OK).json({
        email: email_id,
        status: "deleted",
      });
    } else {
      resp.status(StatusCodes.OK).json({
        email: email_id,
        status: "not_exist",
      });
    }
  } else {
    resp.status(StatusCodes.OK).json({ msg: "Email param is mandatory" });
  }
});

const generateWebToken = (user) => {
  const token = jwt.sign(
    {
      email: user.email,
      admin: user.admin,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1m",
    }
  );
  user.token = token;
  return user;
};

app.listen(PORT, () => {
  console.log("bw_api server started ...");
  console.log(`bw_api server listening on ${PORT}`);
  logger.info("bw_api server started ...");
  logger.info(`bw_api server listening on ${PORT}`);
});

const server = https.createServer(
  {
    key: fs.readFileSync("./secrets/private_key.pem"),
    cert: fs.readFileSync("./secrets/certificate.pem"),
    passphrase: "brasswork_secret",
  },
  app
);

// server.listen(443, () => {
//     logger.info('HTTPS server listening');
// });
