import React from "react";

class Option extends React.Component{
    render(){
        let question = this.props.question;
        return (
            <li onClick={(e)=>question.markCorrect(e)}><input type="text" placeholder='Type Your Option' className='op' /> <img src="/pics/close.png" alt="" onClick={()=>question.RemoveOp(this.props.uid)}/></li>
        )
    }

}

export default Option;
