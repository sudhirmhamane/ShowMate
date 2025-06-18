import mongoose, { connect } from "mongoose";

const URI = process.env.MONGODB_URI;

const connectDb  = async ()=>{
    try {
        await mongoose.connect(`${URI}/showmate`);
        console.log("Database Connection Sucessfully.")
    } catch (error) {
        console.error("Database Connection Failed!",error.message);
    }
}

export default connectDb;