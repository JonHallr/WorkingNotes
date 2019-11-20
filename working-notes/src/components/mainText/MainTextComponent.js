import React, {Component} from 'react';
import './MainText.css';
//import {TextNoteComponent} from '../notes/TextNoteComponent';
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
            selectedNote: {},
            selectedDisplayText: '',
            sectionList: [],
            tagList:[],
            saveTag : '',
            tagTrigger : ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.myRefresh = this.myRefresh.bind(this);
        this.handleDisplayText = this.handleDisplayText.bind(this);
        this.addSection = this.addSection.bind(this);
        //this.listUpdate = this.listUpdate.bind(this);
        this.removeSection = this.removeSection.bind(this);
        this.edit = this.edit.bind(this);

        this.testing = this.testing.bind(this);
        this.testAdd = this.testAdd.bind(this);
        this.setText = this.setText.bind(this);
        this.onOff = this.onOff.bind(this);
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

        let check = value.charAt(value.length - 1);
        let tempTag = this.state.saveTag;
        let tagIndicater = this.state.tagTrigger;
        if(check === '*' || check === '-'){
            tagIndicater += check;
            this.setState({
                tagTrigger: tagIndicater
            });
        }else if(tagIndicater === '*-' && check !== ' '){
            tempTag += check;
            this.setState({
                saveTag: tempTag
            });
        }else if(tagIndicater === '*-' && check === ' '){
            let temp = this.state.tagList;
            temp.push(tempTag);
            this.setState({
                tagList: temp,
                tagTrigger: '',
                saveTag: ''
            });
            console.log(this.state.tagList);
        }
        this.setState({
            [name]: value
        });
    }

    handleDisplayText(){
        console.log("handleDisplayText");
        let temp = '';
        let count = 0;
        this.state.sectionList.forEach((e)=>{
            temp = count > 0 ? temp + "\n" + e.name: e.name + "\n" 
            e.texts.forEach((a)=>{
                temp = temp + "\n" +  (a.time + "\n" + a.text );                
            });
            count ++;       
        });
        let test = this.state.title + "\n" + this.state.author + "\n" + this.state.description + "\n" + temp;
        console.log()
        test = test.replace(/[*-]/g, '');
        this.setState({
            theNote: test
        });
    }

    myRefresh(){
        console.log("myRefresh");
            this.setState({
                mainText: ''
            });
            console.log(this.state);
    }

    addSection(){
        console.log("addSection");
        var templateList = this.state.sectionName.split(";");
        templateList.forEach((name)=> {
            let hv = this.state.sectionList.length > 0 ? true : false;
            let temp = this.state.sectionList;
            let os = hv ? temp[temp.length - 1] : 0;
            let ns = hv ? os.section + 1 : os + 1;
            let tempObj ={
                name: name,
                section: ns,
                texts:[]
            }
            temp.push(tempObj);
            this.setState({            
                sectionName:'',
                sectionList: temp,
                selectedNote: tempObj,
                selectedDisplayText: ''
            });
        });
    }
    removeSection(key){
        console.log("removeSection");
        let temp = this.state.sectionList;
        temp.splice(getIndexOfObject(key, temp, "section"),1);
        this.setState({
            sectionList: temp
        });
    }

    edit(id, sectionid){
        console.log("edit");
        let tempData = this.state.sectionList.findIndex(function (e){
            return e.section === sectionid ? e : -1;
        });
        let temp = this.state.sectionList[tempData].texts;
        temp.forEach((e)=>{
            if(e.id === id){
                this.setState({
                    mainText: e.text
                });
            }
        })
    }

    testing(event){
        console.log("testing");
        let dataIndex = event.target.id - 1;
        let selectedTemp = {};
        selectedTemp =  this.state.sectionList[dataIndex];
        this.setState({
            selectedNote: selectedTemp
        });
        console.log(this.state.selectedNote);
        this.setText(dataIndex);
    }

    testAdd(event){
        console.log("testAdd");
        console.log(this.state.tagList);
        let dataIndex = event.target.id - 1;
        if(this.state.mainText.trim() !== ''){
            let d = new Date();
            let tempId = this.state.sectionList[dataIndex].texts.length;
            let tempArray = [];
            tempArray = this.state.sectionList;
            let tempTagString = '';
            this.state.tagList.forEach((a) =>{
                tempTagString += a + ', '; 
            });
            let tempText = this.state.mainText;
            tempText = tempText.replace(/[*-]/g,'');
            let tempTagList = this.state.tagList;
            let tempObject = {
                id: tempId,
                text: tempText + "\n",
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                visible: 'collapse',
                tags: tempTagList,
                tagString: tempTagString 
            }
            tempArray[dataIndex].texts.push(tempObject);
            this.setState({
                sectionList: tempArray,
                selectedNote: tempArray[dataIndex],
                tagList: []
            });
        }
        this.setText(dataIndex);
        this.handleDisplayText();
        this.myRefresh();
        
        
    }

    onOff(event){
        console.log("onOff");
        if(event != undefined){
            //let id= 0;

             let id = event.target.id;
             let temp = this.state.selectedNote;
             temp.texts.forEach((a)=>{
                 if(a.id == id){
                     switch(a.visible){
                         case 'visible':
                             a.visible = 'collapse';
                             break;
                         case 'collapse':
                             a.visible = 'visible';
                             break;
                         default:
                             break;
                     }
                 }
             });
             this.setState({
                 selectedNote: temp
             });
             this.setText(temp.section - 1);
             
        }
        
    }
    /*

                <td id={e.id}><div id={e.id}>{e.visible == 'visible' ? '-':'+'}</div><div id={e.id}> {e.time} - {e.text.slice(0,40)}</div></td>
            <tr className="noteSectionBackground" >
                <td className="tagFormat">{e.tagString}</td>
            </tr>
    */
    setText(id){
        let textList = this.state.sectionList[id].texts.map((e)=> 
        <table>
            <tr className="noteSectionBackground" id={e.id} onClick={this.onOff}>
                <td id={e.id}><div id={e.id}>{e.visible == 'visible' ? '-':'+'}</div><div id={e.id}> {e.time} - {e.text.slice(0,40)}</div></td>
            </tr>
            <tr style={{visibility: e.visible}}>
                <td className="textareaFormat"><textarea value={e.text} rows="10" cols="100"/></td>
                <td className="tagFormat">{e.tagString}</td>
            </tr>
        </table>        
        ) ;
         console.log(textList);
         this.setState({
              selectedDisplayText: textList
          });
    }
    onTagChange(event){
        console.log(event);
    }


    render(){
        let noteSelection = this.state.sectionList.map((e)=>
        <li className="leftAlign">
            <div className="inline-box-align">
                <button onClick={this.testAdd} id={e.section}>+</button>
            </div> 
            <div className="inline-box-align" onClick={this.testing} id={e.section}>
                {e.name}
            </div> 
            <div className="inline-box-align" id="entryNumber">
                {e.texts.length}
            </div>          
        </li>
        );
     

        return ( 
            <div className="wrapper">
                <div className="Overview">
                    <div className="wrapper">
                        <div className="OverviewChild">
                            <label htmlFor="title">Title:</label>
                            <input  type="text" id="title" name="title" value={this.state.title} onChange={this.handleChange} />
                        </div>
                        <div className="OverviewChild">
                            <label htmlFor="author">Author:</label>
                            <input  type="text" id="author" name="author" value={this.state.author} onChange={this.handleChange} />                            
                        </div>
                    </div>                    
                </div>
                <div className ="TheAwesomeTextBox">                    
                    <div className="wrapper">
                        <div className="TheAwesomeTextBoxChild" id="TheAwesomeTextBox">
                            <h2>The Awesome Text Box</h2>
                            <div>
                                <textarea className='main-text' name="mainText" value={this.state.mainText} onChange={this.handleChange} rows="10" cols="50"/>
                            </div>                           
                            <div>
                                <button onClick={this.myRefresh}>Clear</button>
                            </div>                   
                        </div>
                        <div className="TheAwesomeTextBoxChild" id="NoteSectionList">
                            <div>
                                <input type="text" name="sectionName" value={this.state.sectionName} onChange={this.handleChange}/>
                                <button onClick={this.addSection}>New Section</button>
                            </div> 
                            <ul>
                                {noteSelection}
                            </ul>
                        </div>
                    
                    </div>
                </div>                
                <div className="NoteSection" >
                    <div className="wrapper">
                    <div id="info_section">
                    <label>{this.state.selectedNote.name}</label>
                    </div>
                    <div id="notes">
                        {this.state.selectedDisplayText}
                    </div>
                    </div> 
                </div>
                <div className="TheNote">
                    <div><button onClick={this.downloadNoteFile}>Export</button></div>
                    <textarea value={this.state.theNote} readOnly/>
                </div>
            </div>
            
        );
    }

}

