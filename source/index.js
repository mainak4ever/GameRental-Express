import connectDb from "./database/index.js";
import app from "./App.js";
import dotenv from "dotenv";
dotenv.config();

connectDb()
  .then(
    app.listen(8001, () => {
      console.log(`server running at port `, 8001);
    })
  )
  .catch((err) => {
    console.log("DB connection Error ", err);
  });
