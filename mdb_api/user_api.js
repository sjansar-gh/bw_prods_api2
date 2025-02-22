//import { dbConnect } from "../db/db_connect.js"
import bcrypt from "bcrypt";
import { UserModel } from "../db/models/user_model.js";

  export async function userExist(user_email, user_password) {
    const user = await UserModel.findOne({ email: user_email });
    if(user){
      const hash = user.password;
      const matched = bcrypt.compareSync(user_password, hash);
      console.log('find matched: ', matched);
    }
    if(user){
      return user;
    }else return null;
  }
  
  export async function createUser(userPayload){
    if(userPayload){
        let userExist = await UserModel.findOne({ email: userPayload.email });
        if(userExist){
            console.log(`User ${userPayload.email} already exists`);
            return null;
        }else{
            //const userCreated = await UserModel.create(userPayload);
            const newUser = new UserModel(userPayload);
            const userCreated = await newUser.save();
            console.log('userCreated', userCreated);
            return userCreated;
        }
    }
  }

  export async function getAllUsers() {
    const projection = { _id: 0, password: 0}
    const users = await UserModel.find({}, projection).sort({admin: -1});
    if(users){
      return users;
    }else return null;
  }

  export async function getUserProfile(email_id) {
    const projection = { _id: 0, password: 0 }
    const user_found = await UserModel.findOne({ email: email_id }, projection);
    console.log('user_found = ', user_found);
    if(user_found && user_found.email){
      return user_found;
    }else return null;
  }

  export async function deleteUser(email_id){
    const delResp = await UserModel.deleteOne({ email: email_id });
    return delResp;
  }

  export async function updateUser(email_id, user_payload){ 
    if(user_payload){
        const filter = { email: email_id };
        const update_payload = { 
            first_name: user_payload.first_name, 
            last_name: user_payload.last_name, 
            password: user_payload.password
        }
        const user_b4_updated = await UserModel.findOneAndUpdate(filter, update_payload);
        //console.log('user_b4_updated = ', JSON.stringify(user_b4_updated));

        const user_post_updated = await UserModel.find(filter);
        //console.log(JSON.stringify(user_post_updated));
        return 'updated';
        
    }else{
        return null;
    }
  }

