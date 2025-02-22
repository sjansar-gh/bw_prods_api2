import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export const userSchema = new Schema({
    email: { type: String, require: true, unique: true },
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    password: { type: String, require: true },
    admin: { type: Boolean, require: true } 
},{
    versionKey: false
});

// userSchema.pre(/^find/, function(next){
//     console.log('1- findOne: ', this);
//     console.log('2- findOne: ', this._conditions);
//     next();
// });

userSchema.pre("save", function(next) {
    console.log('... pre save');
    //if(this.isModified("password")){
        this.password = bcrypt.hash(this.password, 10);
    //}
    next();
});

userSchema.pre("findOneAndUpdate", function(next) {
    console.log('... pre update - user: ');
    console.log('_conditions: ', this._conditions);
    console.log('_update: ', this._update);
    console.log('password: ', this._update.password);
    const hash = bcrypt.hashSync(this._update.password, 10);
    console.log('hash: ', hash);
    const matched = bcrypt.compareSync(this._update.password, hash);
    console.log('matched: ', matched);
    this._update.password = hash;
    //next();
});

export const UserModel = new model("user", userSchema, 'bw_users');


// let admin_user = new UserModel({
//     email: "sjansar@yahoo.com",
//     first_name: "Javed",
//     last_name: "Syed",
//     password: "All@his1",
//     admin: true
// });

// export async function createAdmin(){
//     let user = await UserModel.findOne({ email: 'sjansar@yahoo.com' });
//     if(user){
//         console.log('Admin user Javed exists');
//         return;
//     }

//     await admin_user.save();
//     console.log('Admin user created');
// }


