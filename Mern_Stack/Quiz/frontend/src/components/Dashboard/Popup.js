import { useNavigate } from "react-router-dom";

function Popup({mode, data}){
    let navigate = useNavigate();
    return(
        <div id='popup' style={{color: mode.txt}}>
            <img src="/pics/close.png" alt="" className="hoverable" style={{backgroundColor:mode.mainBG}} onClick={closePopup}/>
            <div style={{backgroundColor: mode.mainbg3, borderColor: mode.navBG}}>
                <h2>{data.title}</h2>
                <div className="quizDetail">
                    <span><b>Author:</b> {data.author}</span>
                    <span><b>Time:</b> {data.time} Mins</span>
                </div>
                <p className="quizDesc">
                    {data.desc}
                </p>
                <span className="hoverable" style={{backgroundColor:mode.button, color:mode.navTxt}} onClick={()=>{
                    navigate('/quiz', {state: {id:data.id}});
                }}>Start Quiz</span>
            </div>
        </div>
    );
}

export default Popup;
function closePopup(){
    document.getElementById('popup').style.zIndex = -1;
}
