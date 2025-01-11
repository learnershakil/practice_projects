import { useLocation, useNavigate } from "react-router-dom";
import './QuizApp.css'
import { useEffect, useRef, useState } from "react";
import QsPallet from "./QsPallet";
import Popup from "./Popup";

function QuizApp({ mode, profile }) {
    var state = useLocation().state;
    var Id = useRef();
    var quizRef = useRef();
    const [quizData, setData] = useState({});
    const [quizState, setQuizState] = useState('yet');
    const [time, setTime] = useState("00:00");
    const [pausedTime, setPausedTime] = useState('00:00');
    const [questions, setQuestions] = useState([]);
    var nav = useNavigate();
    useEffect(() => {
        if (profile == null) {
            nav('/');
            return;
        }
        let qs = document.getElementsByClassName('qs');
        let qsop = document.getElementsByClassName('qsOp');
        if (qsop.length === 0) return;
        for (let i = 0; i < qsop.length; i++) {
            qs.item(i).style.backgroundColor = mode.mainbg3;
            qsop.item(i).style.color = mode.txt;
            qs.item(i).style.color = mode.txt;

        }
    }, [mode]);
    useEffect(() => {
        if(profile==null){
            nav('/')
            return;
        }
        if (state == null || state.id == null) {
            nav('/dash');
            return;
        }
        fetch('/quiz', {
            method: 'POST',
            body: JSON.stringify({ id: state.id }),
            headers: { 'Content-type': 'application/json' }
        }).then((res) => res.json().then((data) => {
            console.log(data);
            
            setData(data);
            setTime(`${data.time}:00`)
        }))
    }, []);
    useEffect(() => {
        quizRef.current = quizState;
        if (quizRef.current == 'started') {
            var list = []
            var i = 0
            for (const key of Object.keys(quizData.questions)) {
                list.push(<QsPallet statement={quizData.questions[key].statement} options={quizData.questions[key].options} key={Date.now() + i} mode={mode} pos={i + 1} qid={quizData.questions[key]._id}/>)
                i++;
            }
            setQuestions(list);
            i = quizData.time*60;
            var pi = 0;
            Id.current = setInterval(() => {    
                if (i<=0){
                    //submit
                }
                console.log(quizRef.current);
                
                if (quizRef.current != 'started' && quizRef.current != 'resumed') {
                    setPausedTime(`${Math.floor(pi/60)}:${pi%60}`);
                    pi++
                    return;
                }                
                setTime(`${Math.floor(i / 60)}:${i % 60}`);
                pi=0;
                i--;
            }, 1000);

        }
        else if (quizRef.current=='paused'){
            document.getElementById('popup').style.zIndex=10;
        }
        return ()=>{clearInterval(Id.current)}
    }, [quizState]);
    return (
        <>
            <div id="quizContainer" style={{ backgroundColor: mode.mainBG }}>
                <div id="quizCont">
                    <div id="qsTitle" style={{ backgroundColor: mode.mainbg3, color: mode.txt }}>
                        <div>
                            <h2>Title: {quizData.title}</h2>
                        </div>
                        <div>
                            <h3>Time Left: {time}</h3>
                        </div>
                        <div>
                            <h3>Description: {quizData.desc}</h3>
                        </div>
                        <div>
                            <h3>Author: {quizData.author}</h3>
                        </div>
                    </div>
                    <span style={{ backgroundColor: mode.button, padding: '10px', color: mode.navTxt }} onClick={(e) => { setQuizState('started'); e.currentTarget.style.display = 'none' }} className="hoverable">Start Quiz</span>
                    {questions}
                </div>
                {(quizState === 'started' || quizState === 'resumed') ?
                    (<div id='buttons' style={{ height: '83vh', display: "flex", flexDirection: "column", justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* <div className='hoverable' style={{backgroundColor: mode.button, color:mode.navTxt}}>Save</div> */}
                        <img src="/pics/pause.png" alt="" className="hoverable" style={{ height: '40px', width: '40px' }} onClick={() => {
                            setQuizState('paused');
                            console.log('setpaused');
                            
                        }} />
                        <div className='hoverable' style={{ backgroundColor: mode.button, color: mode.navTxt }} onClick={(e)=>submit(e.currentTarget, profile, nav, time)}>Submit</div>
                    </div>) :
                    (<></>)}
            </div>
            <Popup mode={mode} setState={setQuizState} pausedTime={pausedTime} setPausedTime={setPausedTime}/>
        </>
    )
}

export default QuizApp;

function submit(element, profile, navigate, time) {
    gifbg(element);
    let data = compile(profile, time);
    if (data === null) {
        resetbg(element);
        return;
    }
    console.log(data);
    
    fetch('/submitQuiz', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json" }
    }).then((res) => {
        if(res.status===200){
            navigate('/dashboard');
        }
        else{
            alert(res.text);
        }
    }).finally(() => {
        resetbg(element);
    });
}

function gifbg(but) {
    but.value = "";
    but.style.backgroundImage = "url('/pics/loading.gif')"
    but.style.backgroundRepeat = "no-repeat";
    but.style.backgroundSize = "contain";
    but.style.backgroundPosition = "center";
}

function resetbg(but) {
    but.value = 'Submit';
    but.style.backgroundImage = 'none';
}
function compile(profile, t) {
    let qsOp = document.getElementsByClassName('qsOp');
    let qs = document.getElementsByClassName('qsStatement');
    let a = t.split(':');
    let time = parseInt(a[0])*60+parseInt(a[1]);
    let jsonData = { author: profile.user, time: time, questions: {} };
    for (let i = 0; i < qs.length; i++) {
        let op = null;
        qsOp.item(i).childNodes.forEach((option) => {
            if(Boolean(option.isCorrect)){          
                op = option.getAttribute('oid');
            }
        });
        jsonData.questions[qs.item(i).getAttribute('qid')] = op;
    }
    return jsonData;
}