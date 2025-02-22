import { connect } from 'mongoose';

export const dbConnect = async () => {
    try{
        await connect(process.env.MDB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    console.log("Mongoose connected successfully")
    }catch(err){
        console.log("Error occured while connecting to Mongodb");
    }
}