import React, {Component} from 'react';
import './MainText.css';
import {NotesComponent} from '../notes/NotesComponent';
import { QuestionComponent } from '../../questions/QuestionsComponent';

export class MainTextComponent_vTwo extends Component{

    constructor(props){
        super(props);
        this.stateChange = props.stateChange || new Function();
        this.state ={
            mainText: '',
            title: '',
            author:'',
            description:'',
            notes:[{
                text: '',
                time: ''
            }],
            questions: [{
                question: '',
                answer: '',
                time: ''
            }]

            
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleQuestions = this.handleQuestions.bind(this);        
        this.handleNote = this.handleNote.bind(this);
        this.myRefresh = this.myRefresh.bind(this);
        this.qa = this.qa.bind(this);

    }

    

    handleChange(event){
        //This will handle any state that is not an object or part of an array I pass in the name of the state value and assign that and then assign the value 
        //this is helpful because then I only need one handleChange for at least these simple changes.
        let target = event.target;
        let value = target.value;
        let name = target.name;
        this.setState({
            //value: event.target.value
            [name]: value
        });
    }



    handleQuestions(props){
        if(this.state.mainText.trim() !== ''){
            let d = new Date();
            let tempArray = [];
            tempArray = this.state.questions;
            let tempObject = {
                question: this.state.mainText.match(/Question\(.*?\)/) ,
                time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' - ',
                answer:this.state.mainText.match(/Answer\(.*?\)/)
            }
            tempArray.push(tempObject);
            this.setState({
                questions: tempArray});
        }
        
    }

    handleNote(props){
        if(this.state.mainText.trim() !== ''){
            let d = new Date();
            let tempArray = [];
            tempArray = this.state.notes;
            let tempObject = {
                text: this.state.mainText,
                time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' - '
            }
            tempArray.push(tempObject);
            this.setState({
                    notes: tempArray});
        }
        
    }


    qa(event){
        this.setState({
            mainText:'Question()\nAnswer()'
        });
    }
    myRefresh(event){
            this.setState({
                mainText: ''
            });
    }
    render(){
        var questionsList = this.state.questions.map((entry) =>
            <div>                
                <p>{entry.time}  {entry.question}{entry.answer}</p>
            </div>
        );
        var notesList = this.state.notes.map((entry) =>
            <div>                
                <p>{entry.time}  {entry.text}</p>
            </div>
        );
        var QAtext = 'Questions()/nAnswer()'

        return ( 
            <div className="wrapper">
                <div className ="one">
                    <div>
                        <h4>The Awesome Text Box</h4>
                        <textarea className='main-text' name="mainText" value={this.state.mainText} onChange={this.handleChange} rows="10" cols="50"/>
                    </div>
                    <div>
                        <button onClick={this.myRefresh}>Clear</button>
                        <button onClick={this.qa}>Question</button>
                    </div>
                </div>
                
                <div className="two" >
                <div><button onClick={this.handleNote}>Notes</button></div> 
                    <label>Notes:</label>
                    <ul>{notesList}</ul>

                </div>
                <div className="three">
                    <div>
                        <button onClick={this.handleQuestions}>Questions</button>
                    </div> 
                    <label>Questions:</label>
                    <ul>{questionsList}</ul>
                </div>
                <div className="four">
                    <div>
                        <label>Title:</label>
                        <input type="text" name="title" value={this.state.title} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Author:</label>
                        <input type="text" value={this.state.author} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea value={this.state.description} onChange={this.handleChange} />
                    </div>
                </div>
                    
            
            </div>
            
        );
    }

}
