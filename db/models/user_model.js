import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { logger } from "./../../utils/logger.js";

export const userSchema = new Schema(
  {
    email: { type: String, require: true, unique: true },
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    password: { type: String, require: true },
    admin: { type: Boolean, require: true },
  },
  {
    versionKey: false,
  }
);

// userSchema.pre(/^find/, function(next){
//     console.log('1- findOne: ', this);
//     console.log('2- findOne: ', this._conditions);
//     next();
// });

userSchema.pre("save", function (next) {
  logger.info("user_pre_save");
  //if(this.isModified("password")){
  this.password = bcrypt.hash(this.password, 10);
  //}
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  logger.info("user_pre_update");
  //   logger.info(`_conditions: ${this._conditions}`);
  //   logger.info(`_update: ${this._update}`);
  //   logger.info(`password: ${this._update.password}`);
  const hash = bcrypt.hashSync(this._update.password, 10);
  logger.info(`hash: ${hash}`);
  const matched = bcrypt.compareSync(this._update.password, hash);
  logger.info(`matched: ${matched}`);
  this._update.password = hash;
  //next();
});

export const UserModel = new model("user", userSchema, "bw_users");
