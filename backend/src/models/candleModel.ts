// backend/src/models/candleModel.ts

import { Schema, model, Document } from "mongoose";

interface ICandle extends Document {
    s: string; // symbol
    t: number; // timestamp
    o: number; // open
    h: number; // high
    l: number; // low
    c: number; // close
    v: number; // volume
}

const candleSchema = new Schema<ICandle>({
    s: { type: String, required: true }, // symbol
    t: { type: Number, required: true }, // timestamp
    o: { type: Number, required: true }, // open
    h: { type: Number, required: true }, // high
    l: { type: Number, required: true }, // low
    c: { type: Number, required: true }, // close
    v: { type: Number, required: true }, // volume
});

export const CandleModel = model<ICandle>("Candle", candleSchema);
