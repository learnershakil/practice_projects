import profile from '../Schemas/profile.js';

function reg(req, res) {
    const body = req.body;
    profile.find({ user: body.user }).then((data) => {
        console.log(data);
        if (data.length != 0) {
            res.status(409).send('user already exists');
            console.log('already exists');
            return;
        }
        else {
            console.log('new user here')
            let user = new profile({ Name: body.name, user: body.user, pass: body.pass, autoCode: -1, dp: "", no_quiz: 0, corrects: 0, wrongs: 0, quizes: [] });
            user.save();
            res.status(200).send('profile created successfully');
        }
    });
}

export default reg;