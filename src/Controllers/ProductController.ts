import express, { Request, Response, NextFunction } from "express";

import { createProductInputs } from "../dto";
import product from "../Models/productmodel";


export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
   
    const { name, price, weight, color, category } = <createProductInputs>req.body;

    if (!name || !price || !weight || !color || !category) {
      return res.status(400).json({
        message: "All fields are required: name, price, weight, color, category",
        success: false,
      });
    }
 
    const existingProduct = await product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        message: "A product with the same name already exists",
        success: false,
      });
    }

    const newProduct = new product({
      name,
      price,
      weight,
      color,
      category,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      data: savedProduct,
    });

  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while creating the product",
      success: false,
      error:  error,
    });
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allProducts = await product.find();
    if (allProducts.length === 0) {
      return res.status(200).json({
        message: "No products found",
        success: true,
        data: [],
      });
    }

    return res.status(200).json({
      message: "Products retrieved successfully",
      success: true,
      data: allProducts,
    });

  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while retrieving products",
      success: false,
      error: error,
    });
  }
};

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, category, color, weight } = req.query;

    const searchFilter: any = {};

    if (name) {
      searchFilter.name = { $regex: name, $options: "i" }; 
    }
    if (price) {
      searchFilter.price = price; 
    }
    if (category) {
      searchFilter.category = { $regex: category, $options: "i" }; 
    }
    if (color) {
      searchFilter.color = { $regex: color, $options: "i" }; 
    }
    if (weight) {
      searchFilter.weight = { $regex: weight, $options: "i" }; 
    }

    const products = await product.find(searchFilter);

    if (products.length === 0) {
      return res.status(200).json({
        message: "No products found",
        success: true,
        data: [],
      });
    }

    return res.status(200).json({
      message: `${products.length} product(s) found`,
      success: true,
      data: products,
    });

  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while searching for products",
      success: false,
      error: error || error,
    });
  }
};

export const globalSearchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyword } = req.query; 

    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({
        message: "Please provide a valid search keyword",
        success: false,
      });
    }

    const searchFilter = {
      $or: [
        { name: { $regex: keyword, $options: "i" } }, 
        { category: { $regex: keyword, $options: "i" } }, 
        { color: { $regex: keyword, $options: "i" } }, 
        { weight: { $regex: keyword, $options: "i" } }, 
        { price: { $regex: keyword, $options: "i" } }, 
      ],
    };

    const products = await product.find(searchFilter);

    if (products.length === 0) {
      return res.status(200).json({
        message: "No products found matching the search criteria",
        success: true,
        data: [],
      });
    }

    return res.status(200).json({
      message: `${products.length} product(s) found`,
      success: true,
      data: products,
    });

  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while searching for products",
      success: false,
      error:  error,
    });
  }
};


