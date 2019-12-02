import React, {Component} from 'react';
import './css/awesome-hub.css';
//import {TextNoteComponent} from '../notes/TextNoteComponent';
import {getIndexOfObject} from './shared/util'

export class AwesomeHubComponent extends Component{

    constructor(props){
        super(props);
        this.stateChange = props.stateChange || new Function();

        this.state ={
            //Hub Section
            theList: [],
            selected:{},
            ddList:[],
            upload: '',
            //Note Section
            active: 'T',
            sectionName:'',
            mainText: '',
            theNote: '',
            title: '',
            author:'',
            description:'',
            selectedNote: {},
            selectedDisplayText: '',
            sectionList: [],
            globalTagList:[],
            wordCheck : '',
            tagTrigger : ''
        }; 


        //Hub Section
        this.saveLoad = this.saveLoad.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.upload = this.upload.bind(this);
        //Note Section
        this.handleChange = this.handleChange.bind(this);
        this.myRefresh = this.myRefresh.bind(this);
        this.handleDisplayText = this.handleDisplayText.bind(this);
        this.addSection = this.addSection.bind(this);

        this.selectNote = this.selectNote.bind(this);
        this.testAdd = this.testAdd.bind(this);
        this.setText = this.setText.bind(this);
        this.onOff = this.onOff.bind(this);
        this.tagAssign = this.tagAssign.bind(this);
        this.mydebug = this.mydebug.bind(this);

        this.newNote = this.newNote.bind(this);
    }

    mydebug(name){
        if(this.state.active === 'T'){console.log(name);}
    }
    
//Hub Section
downloadNoteFile = () => {
    const x = document.createElement("a");
    let temp = JSON.stringify(this.state.theList);
    console.log(temp);
    const file = new Blob([temp], {type: 'application/json'});
    x.href = URL.createObjectURL(file);
    x.download = "MyAwesomeNote.json";
    document.body.appendChild(x); // Required for this to work in FireFox
    x.click();
  }

  newNote(){      
    this.mydebug('newNote');
    let check = false; 
    console.log(this.state.theList);
    this.state.theList.forEach((a)=>{
        if(a != undefined && a.title === this.state.title){
            check = true;
        }
    });
    console.log(!check);
    console.log(this.state.title !== '');
    if(!check){
        console.log('made it here')
        let tempList = this.state.theList.length > 0 ? this.state.theList : [];
        let singleObj = new Object({
        sectionName:'',
        mainText: '',
        theNote: '',
        title: this.state.title,
        author:'',
        description:'',
        selectedNote: {},
        sectionList: [],
        selectedDisplayText: '',
        globalTagList: [],
        wordCheck :'',
        tagTrigger :''
         });
         tempList.push(singleObj);
        console.log(tempList);
    
       let tempddlist = this.dropDownListCreator(tempList);
        this.setState({
            theList: tempList,
            ddList: tempddlist,
            
            sectionName:singleObj.sectionName,
            mainText: singleObj.mainText,
            theNote: singleObj.theNote,
            title: this.state.title,
            author:singleObj.author,
            description:singleObj.description,
            selectedNote: singleObj.selectedNote,
            sectionList: singleObj.sectionList,
            selectedDisplayText: singleObj.selectedDisplayText,
            globalTagList: singleObj.globalTagList,
            wordCheck :singleObj.wordCheck,
            tagTrigger :singleObj.tagTrigger
            });

    }
  }

  async saveLoad(){
    this.mydebug('saveLoad');
    let selectedListItem = document.getElementById("ddlist");
        let selectedItem = this.state.theList[selectedListItem.value];
        console.log(selectedListItem.value);
        console.log(selectedItem);


        console.log(selectedListItem.name)
        if(this.state.theList.length > 0 || this.state.title !== ''){
            console.log('Step: 1');
            console.log(this.state.title);
            console.log(selectedItem.title);
             if(this.state.title === selectedItem.title){
                    console.log('Step: 2');
                let xlist = this.state.theList;
                    console.log(selectedItem.title)
                    xlist.splice(selectedListItem.value,1,{
                    sectionName:this.state.sectionName,
                    mainText: this.state.mainText,
                    theNote: this.state.theNote,
                    title: this.state.title,
                    author:this.state.author,
                    description:this.state.description,
                    selectedNote: this.state.selectedNote,
                    sectionList: this.state.sectionList,
                    globalTagList:this.state.globalTagList,
                    wordCheck : this.state.wordCheck,
                    tagTrigger : this.state.tagTrigger
                });
                let templist = this.dropDownListCreator(xlist);
                await this.setState({
                    theList:xlist,
                    ddList: templist
                });
                console.log("The Same");
            }else if(selectedItem != undefined){
                console.log('Step: 5');
                console.log(selectedItem);
                //Load
                await this.setState({
                    sectionName:selectedItem.sectionName,
                    mainText: selectedItem.mainText,
                    theNote: selectedItem.theNote,
                    title: selectedItem.title,
                    author:selectedItem.author,
                    description:selectedItem.description,
                    selectedNote: selectedItem.selectedNote,
                    sectionList: selectedItem.sectionList,
                    selectedDisplayText: '',
                    globalTagList:selectedItem.globalTagList,
                    wordCheck : '',
                    tagTrigger : ''
        
                });
            }
            

        }else{
            console.log('Enter something');
        }
        
       
}
setSelected(event){
    this.mydebug("setSelected");
    let target = event.target;
    console.log(target.value);
}

readFileAsync(file){
    this.mydebug("readFileAsync");
return new Promise((resolve,reject) =>{
    let reader = new FileReader();

    reader.onload = () =>{
        resolve(reader.result);
    }
    reader.onerror = reject;
    reader.readAsText(file);
});
}
async upload(){
    this.mydebug('upload');
    try{
        let doc = document.getElementById('upload');
        var file = doc.files.item(0);
        let contentBuffer = await this.readFileAsync(file);
        let temp = JSON.parse(contentBuffer);
        console.log(temp);
        let templist = this.dropDownListCreator(temp) ;
        this.setState({
            theList: temp,
            ddList: templist
        })
        console.log(temp);
        console.log(contentBuffer);
    }catch(err){
        console.log(err);

    }
    console.log(this.state.theList);


}
dropDownListCreator(temp){
    console.log('dropDownListCreator');
    let templist = [];
    let count = 0;
    temp.forEach((a) =>{
        if( a != undefined ){
            let b = {
                name: a.title ,
                position: count
            }
            templist.push(b);
            count++;
        }
        
    });
    console.log(templist);
    return templist;
}
//Note Section


    handleChange(event){
        //This will handle any state that is not an object or part of an array I pass in the name of the state value and assign that and then assign the value 
        //this is helpful because then I only need one handleChange for at least these simple changes.
        let target = event.target;
        let value = target.value;
        let name = target.name;

        let check = value.charAt(value.length - 1);
        let wordCheck = this.state.wordCheck;
        let tagList = this.state.globalTagList;
        if(check !== ' ' && target.type !=='text'){
            wordCheck += check;
            this.setState({
                wordCheck: wordCheck
            });
        }else if(check === ' ' && wordCheck.length > 0){
            tagList.forEach((a) =>{
                if(a == wordCheck){
                    value = this.tagAssign();
                }
            });
            this.setState({
                wordCheck: ''
            });
        }
        this.setState({
            [name]: value
        });
    }

    handleDisplayText(){
        this.mydebug("handleDisplayText");
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
        test = test.replace(/[*-]/g, '');
        this.setState({
            theNote: test
        });
    }

    myRefresh(){
        this.mydebug("myRefresh");
            this.setState({
                mainText: ''
            });
    }

    addSection(){
        this.mydebug('addSection');
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
    /*
    removeSection(key){
        this.mydebug("removeSection");
        let temp = this.state.sectionList;
        temp.splice(getIndexOfObject(key, temp, "section"),1);
        this.setState({
            sectionList: temp
        });
    }
    
    edit(id, sectionid){
        this.mydebug("edit");
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
    */
    //update the selected note
    selectNote(event){
        this.mydebug("selectNote");
        let dataIndex = event.target.id - 1;
        let selectedTemp = {};
        selectedTemp =  this.state.sectionList[dataIndex];
        this.setState({
            selectedNote: selectedTemp
        });
        console.log(this.state.selectedNote);
        this.setText(dataIndex);
    }
    //add a note section.
    testAdd(event){
        this.mydebug("testAdd");

        let globaltaglist = this.state.globalTagList;
        let dataIndex = event.target.id - 1;
        if(this.state.mainText != undefined && this.state.mainText.trim() !== ''){
            let d = new Date();
            let tempId = this.state.sectionList[dataIndex].texts.length;
            let tempArray = [];
            tempArray = this.state.sectionList;
            let tempText = this.state.mainText;
            let reg = /(\*\-[^\s]+)/g;
            let tempTagString = '';
            let tempTagList = [];
            let tempTagArray = [...tempText.matchAll(reg)];
            tempTagArray.forEach((a) =>{
               let tempString = a['0'];
               tempString = tempString.replace(/[*-]/g,'');
               tempTagString += tempString + ', ';
               tempTagList.push(tempString);
               globaltaglist.push(tempString);
            });
            let temp = new Set();
            globaltaglist.forEach((c) =>{
                temp.add(c);
            });
            globaltaglist = [...temp];
            tempText = tempText.replace(/[*-]/g,'');
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
                globalTagList: globaltaglist
            });
            
        this.setText(dataIndex);
        this.handleDisplayText();
        this.myRefresh();
        }
        
        
    }
    //Hides the text section of a note in the list
    onOff(event){
        this.mydebug("onOff");
        if(event != undefined){
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

    setText(id){
        let textList = this.state.sectionList[id].texts.map((e)=> 
        <table key={e.id}>
            <tbody>
                <tr className="noteSectionBackground" id={e.id} onClick={this.onOff}>
                    <td id={e.id}><div id={e.id}>{e.visible == 'visible' ? '-':'+'}</div><div id={e.id}> {e.time} - {e.text.slice(0,40)}</div></td>
                </tr>
                <tr style={{visibility: e.visible}}>
                    <td className="textareaFormat"><textarea value={e.text} rows="10" cols="100" readOnly/></td>
                    <td className="tagFormat">{e.tagString}</td>
                </tr>
            </tbody>            
        </table>        
        ) ;
         this.setState({
              selectedDisplayText: textList
          });
    }

    tagAssign(){
        this.mydebug('tagAssign');
        let textarea = document.getElementById("awesometextarea");
        let formatted = '';
        let wordCheckStart = textarea.value.indexOf(this.state.wordCheck)
        let wordCheckEnd= textarea.value.indexOf(this.state.wordCheck) + this.state.wordCheck.length;
        let len = textarea.value.length;
        let start = len === textarea.selectionStart ?  wordCheckStart : textarea.selectionStart ;
        let end =  len === textarea.selectionStart  ? wordCheckEnd : textarea.selectionEnd;
        let sel = textarea.value.substring( start, end);
        let replace = '*-' + sel;

        textarea.value = textarea.value.substring(0,start) + replace + textarea.value.substring(end,len);
        formatted = textarea.value;

        if(len === textarea.selectionStart ){
            return formatted;
        }else{
            this.setState({
                mainText: formatted
            });
        
        }
    
    }
   

    render(){
        //Hub Section
        let NoteDropDownList =  this.state.ddList.map((a) =>
            <option key={a.position} onClick={this.setSelected} value={a.position } >{a.name}</option>
        );
        //Note Section
        var noteSelection = undefined;
        if(this.state.sectionList != undefined && this.state.sectionList.length > 0){
             noteSelection = this.state.sectionList.map((e)=>
        <li key={e.section} className="leftAlign">
            <div className="inline-box-align">
                <button onClick={this.testAdd} id={e.section}>+</button>
            </div> 
            <div className="inline-box-align" onClick={this.selectNote} id={e.section}>
                {e.name}
            </div> 
            <div className="inline-box-align" id="entryNumber">
                {e.texts.length}
            </div>          
        </li>
        );
        }
        
     

        return ( 
            <div className="wrapper">
                <div className="hub">
                    <div className="wrapper">                          
                        <div className="export">
                            <button onClick={this.downloadNoteFile}>Export</button>
                        </div>
                        <div className="upload">
                            <input id="upload" type="file" /> 
                            <button onClick={this.upload}>Upload</button>
                        </div>
                    </div>
                </div>
                
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
                                <textarea className='main-text' name="mainText" id="awesometextarea" value={this.state.mainText} onChange={this.handleChange} rows="10" cols="50"/>
                            </div>                            
                            <div>
                                <button onClick={this.tagAssign}>Tag</button>
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
                            <div className="notelist">
                                <select id="ddlist">                        
                                        {NoteDropDownList}
                                </select>
                                <button onClick={this.saveLoad}>Save/Load</button>
                                <button onClick={this.newNote}>New</button>                    
                            </div> 
                            <label>{this.state.selectedNote.name}</label> 
                        </div>
                        <div id="notes">
                            {this.state.selectedDisplayText}
                        </div>
                    </div> 
                </div>

                <div className="TheNote">
                    <textarea value={this.state.theNote} readOnly/>
                </div>
            </div>
            
        );
    }

}

