import mongoose from "mongoose";
const DATABASE_URL =
  "mongodb+srv://Angad:Angad123123@cluster0.b1ggh4r.mongodb.net/";
const connectDb = async () => {
  try {
    const connectedData = await mongoose.connect(`${DATABASE_URL}gamerental`);
    console.log(`mongoDb Connected at Host`, connectedData.connection.host);
  } catch (error) {
    console.log("mongodb connection failed", error);
    process.exit(1);
  }
};
export default connectDb;
