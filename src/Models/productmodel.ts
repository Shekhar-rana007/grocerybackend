import mongoose, { Schema, Document, Model } from "mongoose";

interface ProductDoc extends Document {
    name: string,
  price: string,
  category: string,
  color: string,
  weight: string
}

const productSchema = new Schema<ProductDoc>({
    name: { type: String, required: [true, "Product name is required"] },
    color: { type: String, required: [true, "Product color is required"] },
    category: { type: String, required: [true, "Product category is required"] },
    weight: { type: String, required: [true, "Product weight is required"] },
    price: { type: String, required: [true, "Product price is required"], default: "0" }
}, {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            }
        },
        timestamps: true
    });


const product: Model<ProductDoc> = mongoose.model<ProductDoc>("product", productSchema);

export default product;
