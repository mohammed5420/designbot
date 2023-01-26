import mongoose from "mongoose";
import "dotenv/config"

const connection = mongoose.connect(process.env.CONNECTION_STRING as string, (err) => {
  console.log(err);
});

export default connection;
