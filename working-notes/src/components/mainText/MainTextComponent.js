import React, {Component} from 'react';
import './MainText.css';
//import {NotesComponent} from '../notes/NotesComponent';
//import { QuestionComponent } from '../questions/QuestionsComponent';

export class MainTextComponent extends Component{

    constructor(props){
        super(props);
        this.stateChange = props.stateChange || new Function();
        
        this.state ={
            sectionName:'',
            mainText: '',
            theNote: '',
            title: '',
            author:'',
            description:'',
            sectionList: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.myRefresh = this.myRefresh.bind(this);
        this.handleDisplayText = this.handleDisplayText.bind(this);
        this.addSection = this.addSection.bind(this);
        this.listUpdate = this.listUpdate.bind(this);
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
    listUpdate(list,name){
        let tempSection = this.state.sectionList;
        let count = 0;
        list.forEach((a)=>{
            let tempData = this.state.sectionList.findIndex(function (e){
                return e.name === name ? e : null;
            });
            tempSection[tempData].text = count > 0 ? tempSection[tempData].text +(a.time +  a.text): a.time +  a.text;
            count ++;
        });
        this.setState({
            sectionList: tempSection
        });
    }

    handleDisplayText(event){
        console.log("made it");
        let temp = '';
        console.log(this.state.sectionList);
        let count = 0;
        this.state.sectionList.forEach((e)=>{
            temp = count > 0 ? temp + "\n" + e.name + "\n" + e.text : e.name + "\n" + e.text;
            count ++;
        });
        let test = this.state.title + "\n" + this.state.author + "\n" + this.state.description + "\n" + temp;
        console.log(test);
        this.setState({
            theNote: test
        });
    }

    myRefresh(event){
            this.setState({
                mainText: ''
            });
    }

    addSection(event){
        let hv = this.state.sectionList.length > 0 ? true : false;
        let temp = this.state.sectionList;
        let os = hv ? temp[temp.length - 1] : 0;
        let ns = hv ? os.section + 1 : os + 1;
        let tempObj ={
            name: this.state.sectionName,
            section: ns,
            text: '',
            time:''
        }
        temp.push(tempObj);
        this.setState({            
            sectionName:'',
            sectionList: temp
        });
    }
    render(){
        let noteSections = this.state.sectionList.map((e) =>
        <div>
            <TextNoteComponent key={"section_"+e.section.toString()} namePass={e.name} className={"section_"+e.toString()} mainText={this.state.mainText} onFilterTextChange={this.handleDisplayText} onListUpdate={this.listUpdate} doRefresh={this.myRefresh}/>
        </div>
        )

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
                    <div>
                        <input type="text" name="sectionName" value={this.state.sectionName} onChange={this.handleChange}/>
                        <button onClick={this.addSection}>New Section</button>
                    </div>
                </div>
                
                <div className="two" >
                <div className="wrapper">
                    {noteSections}
                </div>                 

                </div>
                <div className="four">
                    <div>
                        <label>Title:</label>
                        <input type="text" name="title" defautlValue={this.state.title} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Author:</label>
                        <input type="text" name="author" defautlValue={this.state.author} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea value={this.state.description} name="description" onChange={this.handleChange} />
                    </div>
                </div>

                <div className="five">
                    <textarea defautlValue="" value={this.state.theNote} />
                </div>
            </div>
            
        );
    }

}


class TextNoteComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: this.props.namePass,
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
            [name]: value
        });
    }

    handleTextNoteList(props){
        if(this.props.mainText.trim() !== ''){
            let d = new Date();
            let tempArray = [];
            tempArray = this.state.textNoteList;
            let tempObject = {
                text: "-" + this.props.mainText + "\n",
                time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() 
            }
            tempArray.push(tempObject);
            this.setState({
                textNoteList: tempArray});
        }
        this.props.onListUpdate(this.state.textNoteList, this.state.name);
        this.props.onFilterTextChange();
        this.props.doRefresh();
    }

    render(){
        var textNoteListArray = this.state.textNoteList.map((e) =>
        <div key={e.time.toString() + e.text.length}>                
            {e.time}  {e.text}
        </div>
    );
        return(
        <div>
            <input type="text" name="name" defaultValue={this.state.name} onChange={this.handleNameChange} />
            <div>
                <button onClick={this.handleTextNoteList}>Add</button>
            </div>
            <ul>{textNoteListArray}</ul>

        </div>);
    }
}