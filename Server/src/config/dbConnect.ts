import { connect } from "mongoose";

const connectDB =async ():Promise<void> => {
    try{
        if (process.env.CONN_STRING){
            await connect(process.env.CONN_STRING);
            console.log("Connected to DB successfully!!");
        }
        else
            throw new Error("Connection string not defined");
    }
    catch (err){
        console.log("Error connecting to Database..");
    }
}

export default connectDB