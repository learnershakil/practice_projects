import quiz from "../Schemas/quiz.js";

async function handleQuiz(req, res){
    console.log('hit on server');
    
    let target = await quiz.findById(req.body.id).populate({
        path: 'questions',
        populate:{path: 'options'}
    });
    console.log(target);
    res.status(200).json(target);
    
}

export default handleQuiz;