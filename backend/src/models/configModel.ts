
// backend/src/models/configModel.ts

import { Schema, model, Document } from "mongoose";

interface IConfig extends Document {
    symbol: string;
    interval: string;
}

const configSchema = new Schema<IConfig>({
    symbol: { type: String, required: true, unique: true },
    interval: { type: String, required: true },
});

export const ConfigModel = model<IConfig>("Config", configSchema);

