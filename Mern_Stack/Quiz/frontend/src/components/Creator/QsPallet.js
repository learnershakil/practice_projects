import React from "react";
import { dark } from "../../classes/Mode";
import { add } from "./Creator";
import Option from "./Option";


class QsPallet extends React.Component{
    options = []
    correct = null;
    constructor(props){
        super(props);
        this.options ={};
        this.options[Date.now()] = <Option uid={Date.now()} question={this} key={Date.now()}/>;
        this.options[Date.now()+1] = <Option uid={Date.now()+1} question={this} key={Date.now()+1}/>;
    }
    render() {
        let filter = '';
        let color = '';
        if (this.props.mode === dark) {
            filter = 'invert()';
            color = 'white';
        } else {
            color = 'black';
        }
        return (
            <div className="qdiv">
                <div className="addQs" style={{ backgroundColor: this.props.bg }} onClick={(e) => add(e.currentTarget.parentNode)}>
                    <img src="/pics/add.png" alt="" className="addQsIcon" style={{ filter: filter }} />
                </div>
                <div className="qs" style={{ backgroundColor: this.props.bg }}>
                    <div className='qsSubCont'>
                        <input type="text" className='qsStatement' name="qs" placeholder='Type Your Question' />
                        {/* <select title='Question type' name="type" className="qsType hoverable" style={{ backgroundColor: 'inherit', color: 'gray' }}>
                            <option value="mcqs">MCQ- Single Correct</option>
                            <option value="mcqm">MCQ- Multi Correct</option>
                        </select> */}
                    </div>
                    <ol className="qsOp" style={{ color: color }}>
                        {Object.values(this.options)}
                    </ol>
                    <div className="addOp hoverable" onClick={()=>this.AddOp()}>
                        <img src="/pics/add.png" alt="" className="addQsIcon" style={{ filter: filter }} /> <span style={{ color: 'gray' }}>Add Option</span>
                    </div>
                </div>
            </div>
        )
    }
    AddOp() {
        this.options[Date.now()] = <Option uid={Date.now()} question={this} key={Date.now()}/>;
        this.forceUpdate();
    }
    RemoveOp(uid) {
        if(Object.values(this.options).length<=2)return;
        delete this.options[uid];
        this.forceUpdate();
    }
    markCorrect(event){
        event.currentTarget.style.backgroundColor = 'lime';
        event.currentTarget.isCorrect = true;
        if(this.correct!==null &&this.correct!==event.currentTarget){
            this.correct.style.backgroundColor = '';
            this.correct.isCorrect = false;
        }
        this.correct = event.currentTarget;
    }
}

export default QsPallet;


