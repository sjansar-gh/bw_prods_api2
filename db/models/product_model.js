import mongoose, { Schema, model } from "mongoose";
import mongooseLong from "mongoose-long";

mongooseLong(mongoose);
const {
  Types: { Long },
} = mongoose;

export const ProductSchema = new Schema(
  {
    sku: { type: String, require: true },
    attribute_set_code: { type: String, require: true },
    categories: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String },
    weight: { type: Number, require: true, default: 0 },
    price: { type: Number, require: true, default: 0 },
    meta_title: { type: String },
    meta_description: { type: String },
    gtin: { type: Number, require: true, default: 0 },
    brand: { type: String },
    product_brand: { type: String },
    delivery_information: { type: String },
    exclude_from_google_feed: { type: String },
    finish: { type: String },
    google_custom_label_0: { type: String },
    google_custom_label_1: { type: String },
    google_title: { type: String },
    google_product_category: { type: String },
    product_type_0: { type: String },
    product_type_1: { type: String },
    size: { type: String },
    backset_size: { type: String },
    fixing_centre: { type: String },
    style: { type: String },
    unit: { type: String },
    related_skus: { type: String },
    related_position: { type: String },
    upsell_skus: { type: String },
    upsell_position: { type: String },
  },
  {
    versionKey: false,
  }
);

export const ProductModel = new model("product", ProductSchema, "bw_products");
