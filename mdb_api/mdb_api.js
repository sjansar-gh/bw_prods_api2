import { dbConnect } from "../db/db_connect.js";
import { ProductModel } from "../db/models/product_model.js";
import * as fs from "fs";
import { logger } from "../utils/logger.js";
import * as constants from "../constants/constant.js";

await dbConnect(); //mongoose
//await createAdmin();

export async function getBySKU(skuId) {
  const query = { sku: skuId };
  const product = await ProductModel.findOne(query);
  // console.log(product);
  return product;
}

export async function getByGTIN(gtinId) {
  logger.info(`gtin: ${gtinId}`);
  //const gtinInt64 = Long.fromString(gtinId);
  const gtinInt64 = parseInt(gtinId);

  const query = { gtin: gtinInt64 };
  const product = await ProductModel.findOne(query);
  // console.log(product);
  return product;
}

export async function getSKUs() {
  const query = "";
  const projection = { _id: 0, sku: 1 };
  const skus = await ProductModel.find({}, projection).limit(100);
  logger.info(`skus: ${skus?.length}`);
  return skus;
}

export async function getSKUsLike(skuStr) {
  const query = "";
  const projection = { _id: 0, sku: 1 };
  const pattern = `^${skuStr}`;
  const regex = new RegExp(pattern, "i");
  const skus = await ProductModel.find(
    { sku: { $regex: regex } },
    projection
  ).limit(10);

  logger.info(`skus: ${skus?.length}`);
  return skus;
}

export async function editProduct(sku, prodJson) {
  //
  //console.log('sku = ', sku, ', prodJson = ', prodJson);
  const filter = { sku };
  const update = prodJson; //{ attribute_set_code: 'My Brasswork Filter Attributes' };

  // The result of `findOneAndUpdate()` is the document _before_ `update` was applied
  let doc = await ProductModel.findOneAndUpdate(filter, update);
  logger.info(`attribute_set_code = ${doc.attribute_set_code}`);
  //

  doc = await ProductModel.find(filter);
  //console.log(JSON.stringify(doc));
  return "Updated";
}

export async function getProdsByCategory(catStr) {
  const query = "";
  const projection = { _id: 0, sku: 1 };
  const pattern = catStr;
  const regex = new RegExp(pattern, "i");
  const products = await ProductModel.find({
    categories: { $regex: regex },
  }).limit(10);

  //console.log('products: ', products);
  return products;
}

export async function getUniqueCategories() {
  const query = "";
  const projection = { _id: 0, categories: 1 };
  const categories = await ProductModel.find({}, projection).distinct(
    "categories"
  );

  logger.info(`total categories: ${categories.length}`);
  return categories;
}

const BATCH_SIZE = 1000; // Adjust as needed

export async function insertDataInBatches() {
  let success = false;
  const json_file_path = `${constants.uploads_folder}/products_json_latest.json`;
  try {
    const data = JSON.parse(
      //fs.readFileSync("./uploads/products_json_latest.json")
      fs.readFileSync(json_file_path)
    );

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      await ProductModel.insertMany(batch);
      logger.info(`Inserted batch ${i / BATCH_SIZE + 1}`);
    }
    success = true;
  } catch (err) {
    logger.error(`Error inserting data: ${err}`);
    success = false;
  } finally {
    logger.info("insertDataInBatches() completed");
    return success;
  }
}

export async function getAllProducts() {
  const query = "";
  const projection = { _id: 0 };
  const all_products = await ProductModel.find({}, projection);
  if (all_products) {
    logger.info(`all_products from DB: ${all_products.length}`);
  }
  return all_products;
}

export async function deleteAllProducts() {
  let deleted_resp = {};
  try {
    deleted_resp = await ProductModel.deleteMany({});
    logger.info(`Products deleted_resp = ${JSON.stringify(deleted_resp)}`);
  } catch (error) {
    logger.error(`Error! in mdb_api.deleteAllProducts() ${error}`);
  }
  return deleted_resp;
}
