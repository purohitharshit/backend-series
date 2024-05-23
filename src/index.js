import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";
import { app } from "./app.js";

// const app = express();

// app.get("/", (req, res) => {
//   res.send("sdf");
// });

dotenv.config({
  path: "./.env",
});

// 2nd approach to connect DB - make a separate file in 'db' folder and write the logic there and then call the function here in index.js
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !", err);
  });

// 1st approach to connect DB - not professionally used

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express";
// const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("ERROR: ", error);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("ERROR: ", error);
//     throw error;
//   }
// })();
