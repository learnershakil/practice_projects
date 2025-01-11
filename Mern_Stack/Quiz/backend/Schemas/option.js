import mongoose, { Schema } from "mongoose";

const opSchema = mongoose.Schema({
    text: String,
    isCorrect: Boolean,
});

export default mongoose.model('option', opSchema);