import profile from "../Schemas/profile.js";

function login(body, res) {
    profile.findOne({ user: body.user }).then((data) => {
        if (data.length == 0) {
            res.status(404).send('User does not exist');
            return;
        }
        if (body.pass != null || body.autoCode != null) {
            if (body.pass == data.pass) {
                let autoCode = Math.round(Math.random() * 100000000);
                data.autoCode = autoCode;
                profile.updateOne({ user: body.user }, { autoCode: autoCode }).exec();

                res.status(200).json({
                    name: data.Name,
                    user: data.user,
                    dp: data.dp,
                    no_quiz: data.no_quiz,
                    autoCode: data.autoCode,
                    corrects: data.corrects,
                    wrongs: data.wrongs
                });
            }
            else if (body.autoCode == data.autoCode) {
                res.status(200).json({
                    name: data.Name,
                    user: data.user,
                    dp: data.dp,
                    autoCode: data.autoCode,
                    no_quiz: data.no_quiz,
                    corrects: data.corrects,
                    wrongs: data.wrongs
                });
            }
            else {
                res.status(401).send("Wrong password entered");
            }
        }
    })

}

export default login;