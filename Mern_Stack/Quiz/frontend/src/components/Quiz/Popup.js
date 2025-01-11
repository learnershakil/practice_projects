
function Popup({mode, setState, pausedTime, setPausedTime}){
    
    return(
        <div id='popup' style={{color: mode.txt}}>
            <div style={{backgroundColor: mode.mainbg3, borderColor: mode.navBG}}>
                <h3>You Were Away for</h3>
                <h4>{pausedTime}</h4>
                <span className="hoverable" style={{backgroundColor:mode.button, color:mode.navTxt}} 
                onClick={()=>{
                    closePopup(setState, setPausedTime);
                }}
                >Reusume Quiz</span>
            </div>
        </div>
    );
}

export default Popup;
function closePopup(setState, setPausedTime){
    document.getElementById('popup').style.zIndex = -1;
    setPausedTime('00:00');
    setState('resumed');
}