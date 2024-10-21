// Import Express.js module
import express from "express";
import dotenv from "dotenv";
import route from "./src/routes";
import db from "./src/libs/db";
import bodyParser from "body-parser";
const cors = require("cors");

import { v2 as cloudinary } from "cloudinary";
import { allow } from "joi";

dotenv.config();
// Initialize the Express application
const app = express();

// Define the port number for the server to listen on
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://dumbmerch-dun.vercel.app/",
    methods: "GET,POST,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(route);
app.use("/uploads", express.static("src/uploads"));
// Define a route for the root URL ('/') and specify the response
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("okeokeoek");
});

// Start the server and have it listen on the defined port
app.listen(port, async () => {
  try {
    await db.$connect();
  } catch (error) {
    await db.$disconnect();
  }
  // Log a message to the console indicating the server is running
});
