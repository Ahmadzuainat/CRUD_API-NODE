import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  img: { type: String, default: "" },
}, {
  timestamps: true
});

export const Product = mongoose.model('Product', productSchema);
