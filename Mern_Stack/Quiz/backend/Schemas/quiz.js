import mongoose, { Schema } from "mongoose";

const quizSchema = mongoose.Schema({
    author: String,
    title: String,
    desc: String,
    questions: [{type:Schema.Types.ObjectId, ref:'question'}],
    time: Number
});

export default mongoose.model('quiz', quizSchema);