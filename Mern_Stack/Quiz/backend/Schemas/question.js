import mongoose, { Schema } from "mongoose";
import option from './option.js'

const qSchema = mongoose.Schema({
    statement: String,
    type: String,
    options: [{type:Schema.Types.ObjectId, ref:'option'}],
});

export default mongoose.model('question', qSchema);