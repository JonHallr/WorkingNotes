import React, {Component} from 'react';
import './MainText.css';
import {NotesComponent} from '../notes/NotesComponent';
import { QuestionComponent } from '../questions/QuestionsComponent';

export class MainTextComponent_vOne extends Component{

    constructor(props){
        super(props);
        this.stateChange = props.stateChange || new Function();
        this.state ={
            value: '',
            questions: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleQuestions = this.handleQuestions.bind(this);
        this.myRefresh = this.myRefresh.bind(this);
        this.qa = this.qa.bind(this);

    }

    

    handleChange(event){
        this.setState({value: event.target.value});
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
    qa(event){
        this.setState({
            value:'Question()\nAnswer()'
        })
    }
    myRefresh(event){
        console.log('Yes');
            this.setState({
                value: ''
            });
    }
    render(){
        var questionsList = this.state.questions.map((entry) =>
        <li>{entry}</li>
    );
        var QAtext = 'Questions()/nAnswer()'

        return ( 
            <div className="wrapper">
                <div className ="one">
                    <div>
                        <h4>The Awesome Text Box</h4>
                        <textarea className='main-text' value={this.state.value} onChange={this.handleChange} rows="10" cols="50"/>
                    </div>
                    <div>
                        <button onClick={this.myRefresh}>Clear</button>
                        <button onClick={this.qa}>Question</button>
                    </div>
                </div>
                
                <div className="two" >
                    <NotesComponent value={this.state.value} name = 'Notes' />

                </div>
                <div className="three">
                    <QuestionComponent value = {this.state.value} name = 'Questions' />
                </div>
                    
            
            </div>
            
        );
    }

}