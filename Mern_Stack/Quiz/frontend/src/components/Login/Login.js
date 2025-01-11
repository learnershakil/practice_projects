import { useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
let navigate;

function Login({ mode, profile, setProfile }) {

    const inputStyle = { backgroundColor: mode.card2, textDecoration: "none", fontSize: 'small', marginBottom: '2rem', borderStyle: 'solid', border: 'solid 1px', borderColor: mode.txt, borderRadius: '2rem', textAlign: 'center', height: '6%', width: '60%', color: mode.txt, transition: 'all 0.5s' }
    navigate = useNavigate();
    useEffect(() => {
        if (profile != null) {
            navigate('/dashboard');
        }
    }, []);
    return (
        <div id="loginView" style={{ backgroundColor: mode.mainBG }}>
            <div id="loginBox" style={{ backgroundColor: mode.card, boxShadow: '5px 5px 5px gray' }}>
                <h1 style={{ color: mode.txt }}>Login</h1>
                <form id="inputs" action="/" method="post">
                    <input type="text" name="user" id="user" placeholder="Username" className="input" style={inputStyle} />
                    <input type="password" name="pass" id="pass" placeholder="Password" className="input" style={inputStyle} />
                    <input type='button' value="Login" className="input" id="submit" style={Object.assign({ ...inputStyle }, { backgroundColor: mode.submit })} onClick={() => submit(setProfile)} />
                    <Link to="/reg" className="input" style={Object.assign({ ...inputStyle }, { backgroundColor: mode.submit2 })}>Sign Up</Link>
                </form>
            </div>
        </div>
    )
}
export default Login;

function submit(setProfile) {
    let user = document.getElementById("user");
    let pass = document.getElementById("pass");
    if (user.value.length === 0 || pass.value.length === 0) {
        alert("Please fill all the fields");
        return;
    }
    if (user.value.includes(" ")) {
        alert("Username can't contain spaces");
        return;
    }
    if (login(user.value, pass.value, null, setProfile)) {
        navigate('/dashboard');
    }
}

function login(user, pass, autoCode, setProfile) {
    var but = document.getElementById("submit");
    if (but != null) {
        but.value = "";
        but.style.backgroundImage = "url('/pics/loading.gif')"
        but.style.backgroundRepeat = "no-repeat";
        but.style.backgroundSize = "contain";
        but.style.backgroundPosition = "center";
    }
    var body = {
        user: user,
        pass: pass,
        autoCode: autoCode,
        checked: true
    }
    setTimeout(function () {
        fetch("/login", {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json" },
            mode: 'cors'
        }).then(async function (response) {
            if (response.status === 200) {
                response.json().then((data) => {
                    console.log(data);
                    setProfile(data);
                    let x = JSON.stringify({ user: user, autoCode: data.autoCode })
                    document.cookie = `user=${x};max-age=${60 * 60 * 24 * 365}`;
                    
                    return true;
                });
                navigate('/dashboard');
            }
            else {
                alert('Last Used password on this device is wrong')
                return false;
            }
        }).finally(() => {
            if (but != null) {
                but.style.backgroundImage = "none";
                but.value = "Login";
            }
        })
    }, 2000);
}

export { login }