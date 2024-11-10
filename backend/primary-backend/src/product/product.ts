import { Request, Response } from "express";
import prisma from "../db";

const express = require("express");
const products = express.Router();

products.get("/get-product/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.send("Please provide productId").status(404);
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
  const { user_id } = req.params;
  if (!user_id) {
    return res.send("Please provide user id").status(404);
  }
  const user_products = await prisma.product.findMany({
    where: {
      user: user_id,
    },
  });
  return res.json(user_products);
});

products.post("/create", async (req: Request, res: Response) => {
  const { name, product_url, price, source, user } = req.body;
  if (!name || !product_url || !price || !source || !user) {
    return res.send("Please provide the required creds").status(404);
  }
  const create_prod = await prisma.product.create({
    data: {
      name,
      product_url,
      source,
      user,
    },
  });
  if (create_prod) {
    return res.send("success");
  }
  return res.send("Please try again").status(404);
});

products.delete("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.send("Please provide product id").status(404);
  }
  const del_prod = await prisma.product.delete({
    where: {
      id: Number(id),
    },
  });
  if (del_prod) {
    return res.send("success");
  }
  return res.send("Please try again").status(404);
});

products.put("/update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, source, product_url } = req.body;
  const update = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      name,
      source,
      product_url,
    },
  });
  if (update) {
    return res.send('updated successfully')
  }
  return res.send('Please try again').status(404)
});