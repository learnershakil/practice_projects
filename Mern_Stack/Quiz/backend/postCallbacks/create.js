import option from "../Schemas/option.js";
import profile from "../Schemas/profile.js";
import Quiz from "../Schemas/quiz.js";
import question from "../Schemas/question.js";

async function create(req, res) {
    let data = req.body;
    let questions = await compile(data);
    let quiz = new Quiz({ author: data.author, title: data.name, desc: data.desc, questions: questions, time: data.time });
    await quiz.save();    
    const user = await profile.findOne({ user: data.author });
    if (user == null) {
        res.status(404).send("User doesn't exist");
        return;
    }
    else{
        let userQuizes = user.quizes;
        userQuizes.push(quiz._id);
        user.quizes = userQuizes;
        await user.save();
        res.status(200).send('Quiz Created successfully');
    }
    
}

export default create;

async function compile(data) {
    let questions = [];
    for (const key of Object.keys(data.questions)) {
        let options = [];
        for (const opKey of Object.keys(data.questions[key].options)) {
            const op = new option({ text: opKey, isCorrect: Boolean(data.questions[key].options[opKey]) })
            await op.save();
            options.push(op._id);
        }
        let Qs = new question({ statement: data.questions[key].statement, type: 'mcqs', options: options });
        await Qs.save();
        questions.push(Qs._id);
    }
    return questions;
}