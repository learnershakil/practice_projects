import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Account.css';

function Account({ mode, profile }) {
    let nav = useNavigate();
    let dp = '/pics/profilePlaceholder.png';
    useEffect(() => {
        if(profile==null)return;
        dp = profile.dp;
        if (profile.dp != '') {
            dp = profile.dp;
        }
        
    }, [profile])
    return (
        <div id="accView" style={{ backgroundColor: mode.mainBG }}>
            <div id="stats">
                <div id="accProfile">
                    <img src={dp} alt="" id='dp' />
                </div>
                <div>
                    <h3>Corrects: {(profile==null)? 0:(profile.corrects)}</h3>
                    <h3>Wrongs: {(profile==null)? 0:(profile.wrongs)}</h3>
                </div>
            </div>
            <div id="friends"></div>
        </div>
    )
}

export default Account;