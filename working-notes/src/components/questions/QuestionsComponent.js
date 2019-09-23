import React, {Component} from 'react';

export class QuestionComponent extends Component{

    constructor(props){
        super(props);
        this.stateChange = props.stateChange || new Function();
        this.state ={ questions: [{
            question: '',
            answer: '',
            time: ''
        }]
        };

        this.handleQuestions = this.handleQuestions.bind(this);

    }
    handleQuestions(props){
        if(this.props.value.trim() !== ''){
            let d = new Date();
            let tempArray = [];
            tempArray = this.state.questions;
            let tempObject = {
                question: this.props.value.match(/Question\(.*?\)/) ,
                time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' - ',
                answer:this.props.value.match(/Answer\(.*?\)/)
            }
            tempArray.push(tempObject);
            this.setState({
                questions: tempArray});
        }
        
    }

    render(){
        var questionsList = this.state.questions.map((entry) =>
        <div>                
            <p>{entry.time}  {entry.question}{entry.answer}</p>
        </div>
    );

        return ( 
        <div >
            <div><button onClick={this.handleQuestions}>{this.props.name}</button></div> 
            <label>{this.props.name}</label>
            <ul>{questionsList}</ul>

        </div>
        );
    }

}