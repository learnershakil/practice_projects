import option from "../Schemas/option.js";
import profile from "../Schemas/profile.js";

async function handleAns(req, res){
    let body = req.body;
    let user = await profile.findOne({user: body.author});
    if(user==null){
        res.status(404).send("user doesn't exist");
        return;
    }

    for(const q of Object.keys(body.questions)){
        if(body.questions[q]==null){
            continue;
        }
        let op = await option.findById(body.questions[q]);
        if (op.isCorrect)user.corrects++;
        else user.wrongs++;
    }
    await user.save();
    res.status(200).send('changes saved');
}

export default handleAns;