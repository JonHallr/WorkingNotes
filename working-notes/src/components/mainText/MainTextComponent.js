import React, {Component} from 'react';
import './MainText.css';
//import {NotesComponent} from '../notes/NotesComponent';
//import { QuestionComponent } from '../questions/QuestionsComponent';

export class MainTextComponent extends Component{

    constructor(props){
        super(props);
        this.stateChange = props.stateChange || new Function();
        
        this.state ={
            mainText: '',
            theNote: '',
            title: '',
            author:'',
            description:''
        };

        this.handleChange = this.handleChange.bind(this);
        this.myRefresh = this.myRefresh.bind(this);
        this.handleDisplayText = this.handleDisplayText.bind(this);
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


    handleDisplayText(list, name){
        console.log(list);
        let temp = '';
        temp = "\n" + name;
        list.forEach(element => {
            temp = temp + "\n" + element.text
        });
        let test = this.state.title + "\n" + this.state.author + "\n" + this.state.description + "\n" + temp;
        this.setState({
            theNote: test
        });
    }

    myRefresh(event){
            this.setState({
                mainText: ''
            });
    }
    render(){

        return ( 
            <div className="wrapper">
                <div className ="one">
                    <div>
                        <h4>The Awesome Text Box</h4>
                        <textarea className='main-text' name="mainText" value={this.state.mainText} onChange={this.handleChange} rows="10" cols="50"/>
                    </div>
                    <div>
                        <button onClick={this.myRefresh}>Clear</button>
                    </div>
                </div>
                
                <div className="two" >
                    <TextNoteComponent mainText={this.state.mainText} onFilterTextChange={this.handleDisplayText} doRefresh={this.myRefresh}/>

                </div>
                <div className="four">
                    <div>
                        <label>Title:</label>
                        <input type="text" name="title" value={this.state.title} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Author:</label>
                        <input type="text" name="author" value={this.state.author} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea value={this.state.description} name="description" onChange={this.handleChange} />
                    </div>
                </div>

                <div className="five">
                    <textarea value={this.state.theNote} />
                </div>
            </div>
            
        );
    }

}


class TextNoteComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            textNoteList:[{
                text: '',
                time: ''
            }]

        };
           this.handleTextNoteList = this.handleTextNoteList.bind(this);
           this.handleNameChange = this.handleNameChange.bind(this);
    }
    handleNameChange(event){
        let target = event.target;
        let value = target.value;
        let name = target.name;
        this.setState({
            //value: event.target.value
            [name]: value
        });
    }

    handleTextNoteList(props){
        if(this.props.mainText.trim() !== ''){
            let d = new Date();
            let tempArray = [];
            tempArray = this.state.textNoteList;
            let tempObject = {
                text: this.props.mainText,
                time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' - '
            }
            tempArray.push(tempObject);
            this.setState({
                textNoteList: tempArray});
        }
        this.props.onFilterTextChange(this.state.textNoteList, this.state.name);
        this.props.doRefresh();
    }

    render(){
        var textNoteListArray = this.state.textNoteList.map((e) =>
        <div>                
            <p>{e.time}  {e.text}</p>
        </div>
    );
        return(
        <div>
            <input type="text" name="name" value={this.state.name} onChange={this.handleNameChange} />
            <div>
                <button onClick={this.handleTextNoteList}>Add</button>
            </div>
            <ul>{textNoteListArray}</ul>

        </div>);
    }
}