import { useEffect } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
let navigate;

function Signup({ mode, profile }) {
    navigate = useNavigate();
    const inputStyle = { backgroundColor: mode.card2, textDecoration: "none", fontSize: 'small', marginBottom: '2rem', borderStyle: 'solid', border: 'solid 1px', borderColor: mode.txt, borderRadius: '2rem', textAlign: 'center', height: '6%', width: '60', transition: 'all 0.5s', color: mode.navTxt }
    useEffect(()=>{
        if(profile!=null){
            navigate('/dashboard');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    return (
        <div id="loginView" style={{ backgroundColor: mode.mainBG }}>
            <div id="loginBox" style={{ backgroundColor: mode.card, boxShadow: '5px 5px 5px gray' }}>
                <h1 style={{ color: mode.txt }}>Sign Up</h1>
                <form id="inputs" action="/" method="post">
                    <input type="text" name="name" id="name1" placeholder="Full Name" className="input" style={inputStyle} />
                    <input type="text" name="user" id="user" placeholder="Username" className="input" style={inputStyle} />
                    <input type="password" name="pass" id="pass" placeholder="Password" className="input" style={inputStyle} />
                    <input type='button' value="Sign Up" className="input" id="submit" style={Object.assign({ ...inputStyle }, { backgroundColor: mode.button })} onClick={() => { submit('name1', 'user', 'pass', 'submit') }} />
                    <Link to="/login" className="input" style={Object.assign({ ...inputStyle }, { backgroundColor: mode.button })}>Login</Link>
                </form>
            </div>
        </div>
    )
}
export default Signup;

function isEmpty(id) {
    return (document.getElementById(id).value.length === 0)
}
// function submit(){

// }

function submit(name, user, pass, target) {
    target = document.getElementById(target);
    if (isEmpty(name) || isEmpty(user) || isEmpty(pass)) {
        alert("Please fill all the fields");
        return;
    }
    if (document.getElementById(user).textContent.includes(" ")) {
        alert("Username can't contain spaces");
        return;
    }
    target.value = "";
    target.style.backgroundImage = "url('/pics/loading.gif')"
    target.style.backgroundRepeat = "no-repeat";
    target.style.backgroundSize = "contain";
    target.style.backgroundPosition = "center";
    var body = {
        name: document.getElementById('name1').value,
        user: document.getElementById('user').value,
        pass: document.getElementById('pass').value
    }
    console.log(body);
    console.log(JSON.stringify(body));
    setTimeout(function () {
        fetch("/reg", {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json" },
            mode: 'cors'
        }).then(async function (response) {
            if (response.status === 200) {
                if (window.confirm("Account was created successfully. Proceed to login?")){
                    navigate('/login');
                }
            }
            else if(response.status===409){
                alert('This Username is already taken');
            }
        }).finally(() => {
            target.style.backgroundImage = "none";
            target.value = "Sign Up";
        })
    }, 2000);
}