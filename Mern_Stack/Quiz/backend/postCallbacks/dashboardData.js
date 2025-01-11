import quiz from "../Schemas/quiz.js";
import profile from "../Schemas/profile.js";

async function dashboardData(req, res){
    
    var body = req.body;
    var data = await profile.findOne({ user: body.user });
    
    if (data.length == 0) {
        res.status(404).send('User does not exist');
        return;
    }
    if (body.autoCode != null) {
        if (body.autoCode == data.autoCode) {
            var quizzes = await quiz.find().sort({_id:-1});
            var response = {}
            var i = 0;
            for (const quiz of quizzes){
                response[i] = {title: quiz.title, author: quiz.author, desc: quiz.desc, time: quiz.time, id:quiz._id}
                i++;
            }
            var leaderboard = {};
            var profiles = await profile.find().sort({corrects:-1});
            i = 0;
            console.log(profiles);
            
            for (const prof of profiles){
                leaderboard[i] = {playerName: prof.Name, corrects: prof.corrects};
                i++;
            }
            response.leaderboard = leaderboard;
            console.log(leaderboard);
            
            res.status(200).json(response);  
        }
        else {
            res.status(401).send("Last used password on this device was wrong");
        }
    }
    else{
        console.log('null');
        
    }
}

export default dashboardData;