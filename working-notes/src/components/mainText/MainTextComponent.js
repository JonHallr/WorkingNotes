import React, {Component} from 'react';
import './MainText.css';
import {TextNoteComponent} from '../notes/TextNoteComponent';
import {getIndexOfObject} from '../shared/util'

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
        this.removeSection = this.removeSection.bind(this);
        this.edit = this.edit.bind(this);
    }

    downloadNoteFile = () => {
        const x = document.createElement("a");
        const file = new Blob([this.state.theNote], {type: 'text/plain'});
        x.href = URL.createObjectURL(file);
        x.download = "myText.txt";
        document.body.appendChild(x); // Required for this to work in FireFox
        x.click();
      }

    handleChange(event){
        //This will handle any state that is not an object or part of an array I pass in the name of the state value and assign that and then assign the value 
        //this is helpful because then I only need one handleChange for at least these simple changes.
        let target = event.target;
        let value = target.value;
        let name = target.name;
        this.setState({
            [name]: value
        });
    }
    listUpdate(list,id, name){
        let tempSection = this.state.sectionList;
        let tempTexts = [];
        let tempData = this.state.sectionList.findIndex(function (e){
            return e.section === id ? e : null;
        });
        list.forEach((a)=>{
            let tempTextObject = {
                id: tempSection[tempData].text.length,
                text: a.text,
                time: a.time
            }
           tempSection[tempData].name = name;
           tempTexts.push(tempTextObject);
        });
        
        tempSection[tempData].text = tempTexts;
        this.setState({
            sectionList: tempSection
        });
    }

    handleDisplayText(event){
        let temp = '';
        let count = 0;
        this.state.sectionList.forEach((e)=>{
            temp = count > 0 ? temp + "\n" + e.name: e.name + "\n" 
            e.text.forEach((a)=>{
                temp = temp + "\n" +  (a.time + "\n" + a.text );                
            });
            count ++;            
            
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

    addSection(event){
        var templateList = this.state.sectionName.split(";");
        templateList.forEach((name)=> {
            let hv = this.state.sectionList.length > 0 ? true : false;
            let temp = this.state.sectionList;
            let os = hv ? temp[temp.length - 1] : 0;
            let ns = hv ? os.section + 1 : os + 1;
            let tempObj ={
                name: name,
                section: ns,
                text:[]
            }
            temp.push(tempObj);
            this.setState({            
                sectionName:'',
                sectionList: temp
            });
        });
    }
    removeSection(key){
        let temp = this.state.sectionList;
        temp.splice(getIndexOfObject(key, temp, "section"),1);
        this.setState({
            sectionList: temp
        });
    }

    edit(id){
        let temp = this.state.sectionList;
        temp.forEach((e)=>{
            if(e.section == id){
                this.setState({
                    mainText: e.text
                });
            }
        })
    }
    render(){
        let noteSections = this.state.sectionList.map((e) =>
        <div>
            <TextNoteComponent key={"section_" + e.section.toString()} sectionId={e.section} deleteSection={this.removeSection} namePass={e.name} className={"section_"+e.toString()} mainText={this.state.mainText} onFilterTextChange={this.handleDisplayText} onListUpdate={this.listUpdate} doRefresh={this.myRefresh} edit={this.edit}/>
        </div>
        )

        return ( 
            <div className="wrapper">
                <div className ="TheAwesomeTextBox">
                    <h4>The Awesome Text Box</h4>
                    <div>
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
                
                <div className="NoteSection" >
                    <div className="wrapper">
                        {noteSections}
                    </div> 
                </div>
                <div className="Overview">
                    <div>
                        <div><label for="title">Title:</label></div>
                        <input type="text" id="title" name="title" defautlValue={this.state.title} onChange={this.handleChange} />
                    </div>
                    <div>
                        <div><label for="author">Author:</label></div>
                        <input type="text" id="author" name="author" defautlValue={this.state.author} onChange={this.handleChange} />
                    </div>
                    <div>
                        <div><label for="description">Description:</label></div>
                        <textarea id="description" value={this.state.description} name="description" onChange={this.handleChange} rows="5" cols="55" />
                    </div>
                </div>

                <div className="TheNote">
                    <div><button onClick={this.downloadNoteFile}>Export</button></div>
                    <textarea defautlValue="" value={this.state.theNote} />
                </div>
            </div>
            
        );
    }

}

