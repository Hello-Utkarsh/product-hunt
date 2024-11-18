import { Request, Response } from "express";
import products from "./product/product";
import { fetchProducts } from "./scheduler/scheduler";
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const port = 3000;
const cron = require("node-cron");

cron.schedule("0 0,6,12,18 * * *", () => {
  fetchProducts();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.use(bodyParser.json());
app.use(cors());
app.use("/product", products);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
