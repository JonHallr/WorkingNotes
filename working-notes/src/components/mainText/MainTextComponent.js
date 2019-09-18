import React, {Component} from 'react';
import './MainText.css';

export class MainTextComponent extends Component{

    constructor(props){
        super(props);
        this.stateChange = props.stateChange || new Function();
        this.state ={
            value: '',
            notes:[{
                text: '',
                time: ''
            }],
            questions: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleNote = this.handleNote.bind(this);
        this.handleQuestions = this.handleQuestions.bind(this);

    }

    handleChange(event){
        this.setState({value: event.target.value});
    }

    handleNote(event){
        if(this.state.value.trim() !== ''){
            let d = new Date();
            let tempArray = [];
            tempArray = this.state.notes;
            let tempObject = {
                text: this.state.value,
                time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' - '
            }
            tempArray.push(tempObject);
            this.setState({
                    value: '',
                    notes: tempArray});
            console.log(this.state.notes);
        }
        
    }

    handleQuestions(event){
        if(this.state.value.trim() !== ''){
            let temp = [];
            temp = this.state.questions;
            temp.push(this.state.value);
            this.setState({
                    value: '',
                    questions: temp});
            console.log(this.state.questions);
        }
       
    }

    render(){
        var notesList = this.state.notes.map((entry) =>
            <div>                
                <p>{entry.time}  {entry.text}</p>
            </div>
        );
        var questionsList = this.state.questions.map((entry) =>
        <li>{entry}</li>
    );

        return (
            <div className="wrapper">
                <div className ="one">
                    <div>
                        <h4>The Awesome Text Box</h4>
                        <textarea className='main-text' value={this.state.value} onChange={this.handleChange} rows="10" cols="50"/>
                    </div>
                    <div>
                    <button onClick={this.handleNote}>Note</button>
                    <button onClick={this.handleQuestions}>Question</button>
                    </div>
                </div>
               
                <div className="two">
                    <label>Notes:</label>
                    <ul>{notesList}</ul>

                </div>
                <div className="three">
                    <label>Questions:</label>
                    <ul>{questionsList}</ul>

                </div>
                    
            
            </div>
            
        );
    }

}