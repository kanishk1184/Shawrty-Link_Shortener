import { Schema, model } from "mongoose";
import type { Document } from "mongoose";

export interface Iurl extends Document {
    idx: number,
    url: string,
    shortenUrl: string
}
// Defining the url model

const urlSchema = new Schema<Iurl>({
    idx: Number,
    url: String,
    shortenUrl: String
});

const URL = model<Iurl>('URL', urlSchema);
export default URL