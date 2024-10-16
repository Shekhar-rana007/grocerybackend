import express, { Request, Response, NextFunction } from "express";
import { productRoutes } from "./Routes/productroutes"; 
import connectDB from "./config/connectDb";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", productRoutes); 

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    success: false,
    error: err.message,
  });
});

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
