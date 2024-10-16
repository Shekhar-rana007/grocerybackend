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

    // Fetch products from the database based on the search filters
    const products = await product.find(searchFilter);

    // Check if products were found
    if (products.length === 0) {
      return res.status(200).json({
        message: "No products found",
        success: true,
        data: [],
      });
    }

    // Return the found products
    return res.status(200).json({
      message: `${products.length} product(s) found`,
      success: true,
      data: products,
    });

  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      message: "An error occurred while searching for products",
      success: false,
      error: error || error,
    });
  }
};

export const globalSearchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyword } = req.query; // Capture the search keyword from query parameters

    // If no keyword is provided, return an error
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({
        message: "Please provide a valid search keyword",
        success: false,
      });
    }

    // Prepare the search filter
    const searchFilter = {
      $or: [
        { name: { $regex: keyword, $options: "i" } }, // Search in name (case-insensitive)
        { category: { $regex: keyword, $options: "i" } }, // Search in category
        { color: { $regex: keyword, $options: "i" } }, // Search in color
        { weight: { $regex: keyword, $options: "i" } }, // Search in weight
      ],
    };

    // Check if the keyword is a valid number for the price field
    const numericPrice = parseFloat(keyword as string);
    if (!isNaN(numericPrice)) {
      // If it is a valid number, add the price filter separately
      const priceFilter = { price: numericPrice };
      // Combine the search filter with price filter
      const products = await product.find({ $or: [searchFilter.$or, priceFilter] });
      return res.status(200).json({
        message: `${products.length} product(s) found`,
        success: true,
        data: products,
      });
    }

    // Fetch products that match the filter (excluding price)
    const products = await product.find(searchFilter);

    // Check if any products are found
    if (products.length === 0) {
      return res.status(200).json({
        message: "No products found matching the search criteria",
        success: true,
        data: [],
      });
    }

    // Return the found products
    return res.status(200).json({
      message: `${products.length} product(s) found`,
      success: true,
      data: products,
    });

  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      message: "An error occurred while searching for products",
      success: false,
      error:  error,
    });
  }
};


