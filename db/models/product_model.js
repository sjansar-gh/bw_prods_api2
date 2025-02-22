import mongoose, { Schema, model } from "mongoose";
import mongooseLong from 'mongoose-long';

mongooseLong(mongoose);
const {Types: {Long}} = mongoose;

export const ProductSchema = new Schema({
    sku: { type: String, require: true },
    attribute_set_code: { type: String, require: true },
    categories: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String },
    weight: { type: Number, require: true },
    price: { type: Number, require: true },
    meta_title: { type: String },
    meta_description: { type: String },
    gtin: { type: Number, require: true },
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
},{
    versionKey: false
}
);

export const ProductModel = new model("product", ProductSchema, 'bw_products');
//export const ProductModel = new model("product", ProductSchema, 'bw_products2');

// const p1 = new ProductModel({
//     sku: 'FF611SJA2',
//     attribute_set_code: 'Mine Brasswork Filter Attributes',
//     categories: 'Default Category/Door Handles/Door Handles on Backplate,Default Category/Door Handles/Door Handles on Backplate/Black Door Handles on Backplate',
//     name: 'Foxcote Foundries FF611EP Lever on Fleur de Lys Euro Backplate Black Antique',
//     description: 'The Foxcote Foundries FF611EP Lever on Fleur de Lys Euro Backplate Black Antique is a stunning door handle that effortlessly combines elegance and vintage charm. Crafted by skilled artisans, the lever features intricate fleur de lys detailing on a beautifully aged black antique backplate. With a comfortable grip and durable construction, this lever adds a touch of sophistication to any interior. Perfect for adding a timeless appeal to your doors.',
//     weight: 943,
//     price: 11.54,
//     meta_title: 'Foxcote Foundries FF611EP Lever on Fleur de Lys Euro Backplate Black Antique',
//     meta_description: 'Foxcote Foundries FF611EP Lever on Fleur de Lys Euro Backplate Black Antique',
//     gtin: 5055364111235,
//     brand: 'FOXCOTE FOUNDRIES',
//     product_brand: 'FOXCOTE FOUNDRIES',
//     delivery_information: '1 to 2 days Dispatch',
//     exclude_from_google_feed: 'No',
//     finish: 'BLACK ANTIQUE',
//     google_custom_label_0: '#VALUE!',
//     google_custom_label_1: 'low',
//     google_title: 'Foxcote Foundries FF611EP Lever on Fleur de Lys Euro Backplate Black Antique',
//     google_product_category: 'Hardware > Building Materials > Door Hardware > Door Knobs & Handles',
//     product_type_0: 'Door Handles > Door Handles on Backplate ',
//     product_type_1: 'in_stock',
//     size: '#VALUE!',
//     backset_size: '#VALUE!',
//     fixing_centre: '#VALUE!',
//     style: 'Traditional',
//     unit: 'Pair',
//     related_skus: 'FF613,FF612',
//     related_position: '1,2',
//     upsell_skus: 'V5EP70CTBKE,ZSC76EPSS,FFN02,FF88',
//     upsell_position: '1,2,9,14'
// });

// p1.save();

