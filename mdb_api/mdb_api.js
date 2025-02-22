import { dbConnect } from "../db/db_connect.js"
import { ProductModel } from "../db/models/product_model.js";
import * as fs from 'fs';

await dbConnect(); //mongoose
//await createAdmin();

export async function getBySKU(skuId) {
  const query = { sku: skuId };
  const product = await ProductModel.findOne(query);
  // console.log(product);
  return product;
}

export async function getByGTIN(gtinId) {
  console.log('gtin: ' + gtinId);
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
  const skus = await ProductModel.find({}, projection)
    .limit(100);
  console.log('skus: ', skus?.length);
  return skus;
}

export async function getSKUsLike(skuStr) {
  const query = "";
  const projection = { _id: 0, sku: 1 };
  const pattern = skuStr;
  const regex = new RegExp(pattern, "i");
  const skus = await ProductModel
    .find({ sku: { $regex: regex } }, projection)
    .limit(10);
  
  console.log('skus: ', skus?.length);
  return skus;
}

export async function editProduct(sku, prodJson) {
    //
    //console.log('sku = ', sku, ', prodJson = ', prodJson);
    const filter = { sku };
    const update = prodJson; //{ attribute_set_code: 'My Brasswork Filter Attributes' };

    // The result of `findOneAndUpdate()` is the document _before_ `update` was applied
    let doc = await ProductModel.findOneAndUpdate(filter, update);
    console.log('attribute_set_code = ', doc.attribute_set_code);
    //
    
    doc = await ProductModel.find(filter);
    //console.log(JSON.stringify(doc));
    return 'Updated';
}

export async function getProdsByCategory(catStr) {
  const query = "";
  const projection = { _id: 0, sku: 1 };
  const pattern = catStr;
  const regex = new RegExp(pattern, "i");
  const products = await ProductModel
    .find({ categories: { $regex: regex } })
    .limit(10);
  
  //console.log('products: ', products);
  return products;
}

export async function getUniqueCategories() {
  const query = "";
  const projection = { _id: 0, categories: 1 };
  const categories = await ProductModel.find({}, projection).distinct("categories");
  
  //console.log('categories: ', categories);
  return categories;
}

const BATCH_SIZE = 1000; // Adjust as needed

export async function insertDataInBatches() {
  try {
    const data = JSON.parse(fs.readFileSync('./uploads/data_full.json'));

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      await ProductModel.insertMany(batch);
      console.log(`Inserted batch ${i / BATCH_SIZE + 1}`);
    }
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    //
  }
}

