import React from "react";
import Option from "./Option";


class QsPallet extends React.Component{
    correct = null;
    constructor(props){
        super(props);
        this.options =[];
        var i = 0;
        for (const key of Object.keys(this.props.options)){
            this.options.push(<Option question={this} text={this.props.options[key].text} key={Date.now()+i} oid={this.props.options[key]._id}/>);
            i++;
        }
    }
    render() {
        return (
            <div className="qdiv" style={{color: this.props.mode.txt}}>
                <div className="qs" style={{ backgroundColor: this.props.bg }} >
                    <div className='qsSubCont'>
                        <p className='qsStatement' qid={this.props.qid}>{this.props.pos}. {this.props.statement}</p>
                    </div>
                    <ol className="qsOp" style={{ color: this.props.mode.txt }}>
                        {Object.values(this.options)}
                    </ol>
                </div>
            </div>
        )
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
