import { useNavigate } from 'react-router-dom';
import './profile.css'
let dp = '';
function Profile({ mode, profile, setProfile }) {
    let navigate = useNavigate();
    if (profile.dp == '') {
        dp = '/pics/profilePlaceholder.png';
    }
    return (
        <>
            <div id="profile" onClick={slide} >
                <img src={dp} alt="" id='dp' />
            </div>
            <div id="sidebar" style={{ backgroundColor: mode.mainbg3 }}>
                <img src={dp} alt="" />
                <div style={{color:mode.txt}} onClick={()=>navigate('/account')}>Account</div>
                <div style={{color:mode.txt}} onClick={()=>logout(setProfile, navigate)}>Logout</div>
            </div>
        </>
    );
}

export default Profile;

function slide() {
    if (document.getElementById('sidebar').style.transform == '') {
        document.getElementById('sidebar').style.transform = 'translateX(-100%)';
        document.getElementById('dp').src = '/pics/close.png';
    }

    else {
        document.getElementById('sidebar').style.transform = '';
        document.getElementById('dp').src = dp;
    }
}

function logout(setProfile, navigate){
    setProfile(null);
    navigate('/');
    document.cookie = `user={};max-age=${60 * 60 * 24 * 365}`
}