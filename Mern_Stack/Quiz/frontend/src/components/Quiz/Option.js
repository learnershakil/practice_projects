import React from "react";

class Option extends React.Component{
    render(){
        let question = this.props.question;
        return (
            <li onClick={(e)=>question.markCorrect(e)} oid={this.props.oid}>{this.props.text}</li>
        )
    }

}

export default Option;
