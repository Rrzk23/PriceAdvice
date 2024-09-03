import { InferSchemaType, Schema, model } from 'mongoose';

const priceSchema = new Schema({
  location: { type: 'string', required: true },
  price: { type: 'string', required: true },
  title: { type: 'string', required: true },
}, { timestamps: true });

type Price = InferSchemaType<typeof priceSchema>;

export default model<Price>('Price', priceSchema);

