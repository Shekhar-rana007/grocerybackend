import { createProduct, getAllProducts, globalSearchProducts, searchProducts } from "../Controllers"

const express = require("express")

const router= express.Router()
router.post("/createproduct", createProduct)
router.get("/allproducts", getAllProducts)
router.get("/products/search", searchProducts);
router.get("/products/globalsearch", globalSearchProducts);

export {router as productRoutes}