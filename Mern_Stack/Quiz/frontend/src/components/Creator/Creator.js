import { useEffect, useState } from 'react';
import './Creator.css'
import { light } from '../../classes/Mode';
import QsPallet from './QsPallet.js'
import { useNavigate } from 'react-router-dom';

export let add = null;
function Creator({ mode, profile }) {
    const navigate = useNavigate();
    useEffect(() => {
        if(profile==null){
            navigate('/');
            return;
        }
        let icons = document.getElementsByClassName('addQsIcon');
        let addqs = document.getElementsByClassName('addQs');
        let qs = document.getElementsByClassName('qs');
        let qsop = document.getElementsByClassName('qsOp');
        if (icons.length === 0) return;
        let filter = '';
        if (mode === light) {
            filter = '';
        }
        else {
            filter = 'invert()';
        }
        for (let i = 0; i < icons.length; i++) {
            icons.item(i).style.filter = filter;
            if (i < qs.length) {
                addqs.item(i).style.backgroundColor = mode.mainbg3;
                qs.item(i).style.backgroundColor = mode.mainbg3;
                qsop.item(i).style.color = mode.txt;
            }
        }
    }, [mode]);
    const [questions, setQuestions] = useState([]);
    add = (ref) => {
        console.log(Array.from(document.getElementById('createCont').children));
        let index = Array.from(document.getElementById('createCont').children).indexOf(ref) - 1;
        let replace = questions.slice();
        replace.splice(index, 0, <QsPallet mode={mode} key={Date.now()} bg={mode.mainbg3} />);
        setQuestions(replace);
    }
    return (
        <>
            <div id="createContainer" style={{ backgroundColor: mode.mainBG }}>
                <div id="createCont" style={{ backgroundColor: mode.mainbg }}>
                    <div id="qsTitle" style={{ backgroundColor: mode.mainbg3 }}>
                        <div>
                            <h2 style={{ color: mode.txt }}>Title:</h2>
                            <input type="text" placeholder='Enter Quiz Title' id='quizTitle' style={{ borderColor: mode.txt, color: mode.txt }} />
                        </div>
                        <div style={{ width: '40%' }}>
                            <h3 style={{ color: mode.txt }}>Time Limit</h3>
                            <input type="number" placeholder='Time in mins:' min='0' id='quizTime' style={{ borderColor: mode.txt, color: mode.txt }} />
                        </div>
                        <div>
                            <h3 style={{ color: mode.txt }}>Description:</h3>
                            <input type="text" placeholder='Enter Quiz Description' id='quizDesc' style={{ borderColor: mode.txt, color: mode.txt }} />
                        </div>
                    </div>
                    {questions}
                    <div className='qdiv'>
                        <div className="addQs hoverable" style={{ backgroundColor: mode.mainbg3 }} onClick={(e) => add(e.currentTarget.parentNode, mode, questions, setQuestions)} >
                            <img src="/pics/add.png" alt="" className="addQsIcon" />
                        </div>
                    </div>
                </div>
                <div id='buttons'>
                    {/* <div className='hoverable' style={{backgroundColor: mode.button, color:mode.navTxt}}>Save</div> */}
                    <div className='hoverable' style={{ backgroundColor: mode.button, color: mode.navTxt }} onClick={(e) => submit(e.currentTarget, profile, navigate)}>Publish</div>
                </div>
            </div>
        </>
    )
}
export default Creator;

function submit(element, profile, navigate) {
    gifbg(element);
    let data = compile(profile);
    if (data === null) {
        resetbg(element);
        return;
    }
    fetch('/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json" }
    }).then((res) => {
        if(res.status===200){
            navigate('/dashboard')
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
    but.value = 'Publish';
    but.style.backgroundImage = 'none';
}
function compile(profile) {
    let qs = document.getElementsByClassName('qsStatement');
    let qsOp = document.getElementsByClassName('qsOp');
    let name = document.getElementById('quizTitle').value;
    let time = parseInt(document.getElementById('quizTime').value);
    let desc = document.getElementById('quizDesc').value;
    if (qs.length < 1) {
        alert('please make atleast 1 qs');
        return null;
    }
    if (name === '' || desc === '') {
        alert('Please enter Title and Description of the Quiz');
        return null;
    }

    let jsonData = { author: profile.user, name: name, time: time, desc: desc, questions: {} };
    for (let i = 0; i < qs.length; i++) {
        let val = qs.item(i).value;
        if (val === '') {
            alert('Please fill all fields');
            qs.item(i).style.borderColor = 'red';
            return null;
        }
        jsonData.questions[i] = { statement: qs.item(i).value, options: {} };
        let correctFound = false;
        qsOp.item(i).childNodes.forEach((option) => {
            val = option.childNodes[0].value;
            if (val === '') {
                alert('Please fill all fields');
                option.childNodes[0].style.borderColor = 'red';
                return null;
            }
            if (Boolean(option.isCorrect)) {
                correctFound = Boolean(option.isCorrect);
            }
            jsonData.questions[i].options[option.childNodes[0].value] = Boolean(option.isCorrect);
        });
        if (!correctFound) {
            alert('no correct answers found for certain qs');
            return null;
        }
    }
    return jsonData;
}