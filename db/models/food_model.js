import {Schema, model} from 'mongoose';

export const FoodSchema = new Schema({
        name: {type: String, require: true}
    });

export const FoodModel = new model('food', FoodSchema);
// const apple_food = new FoodModel({
//     name: 'Apple'
// })

// apple_food.save();