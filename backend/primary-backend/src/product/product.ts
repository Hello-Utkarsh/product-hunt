import { Request, Response } from "express";
import prisma from "../db";

const express = require("express");
const products = express.Router();

products.get("/get-product/:id", async (req: Request, res: Response) => {
  const id = req.params;
  if (!id || id == undefined) {
    return res.status(400).json({ message: "Please provide productId" });
  }
  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
    },
  });
  if (product) {
    return res.json(product);
  }
  return res.send("Product Not Found");
});

products.get("/user-products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || id == undefined) {
    return res.status(400).json({ message: "Please provide user id" });
  }
  const user_products = await prisma.product.findMany({
    where: {
      user: id,
    },
  });
  if (user_products) {
    return res.json(user_products);
  }
  return res.status(400).json({ message: "Please try again" });
});

products.post("/create", async (req: Request, res: Response) => {
  const { name, product_url, price, source, user } = req.body;
  if (!name || !product_url || !price || !source || !user) {
    return res
      .status(400)
      .json({ message: "Please provide the required data" });
  }
  const create_prod = await prisma.product.create({
    data: {
      name,
      product_url,
      price,
      source,
      user,
    },
  });
  if (create_prod) {
    return res.json(create_prod).status(200);
  }
  return res.status(400).json({ message: "Please try again" });
});

products.delete("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userid } = req.headers;
  if (!id || !userid) {
    return res
      .status(400)
      .json({ message: "Please provide the required data" });
  }
  const del_prod = await prisma.product.delete({
    where: {
      id: Number(id),
      user: Array.isArray(userid) ? "" : userid,
    },
  });
  if (del_prod) {
    return res.status(200).json(del_prod);
  }
  return res.status(400).json({ message: "Please try again" });
});

export default products;
