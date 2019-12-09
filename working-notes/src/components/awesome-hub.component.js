import React, {Component} from 'react';
import './css/awesome-hub.css';
//import {TextNoteComponent} from '../notes/TextNoteComponent';
import {getIndexOfObject} from './shared/util';
import {ClockComponent} from './shared/clock.component';

export class AwesomeHubComponent extends Component{

    constructor(props){
        super(props);
        this.stateChange = props.stateChange || new Function();

        this.state ={
            //Hub Section
            Notebooks: [], //Main note list
            DeletedNotebooks: [],
            selected:false,
            PageListDD:[], //dropdown list for selecting your note
            upload: '',
            //Note Section
            ID: 0,
            active: 'T',
            sectionName:'',
            mainText: '',
            theNote: '',
            title: '',
            author:'',
            description:'',
            selectedDisplayText: '',
            selectedNote: {}, //selected section of the note
            PageList: [], // selected Note section list
            DeletedPageList:[],
            globalTagList:[], // global tag for the selected Note
            //util values
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
        //this.handleDisplayText = this.handleDisplayText.bind(this);
        this.addSection = this.addSection.bind(this);

        this.selectNote = this.selectNote.bind(this);
        this.testAdd = this.testAdd.bind(this);
        this.setText = this.setText.bind(this);
        this.onOff = this.onOff.bind(this);
        this.tagAssign = this.tagAssign.bind(this);
        this.mydebug = this.mydebug.bind(this);

        this.newNote = this.newNote.bind(this);

        this.onClickEdit = this.onClickEdit.bind(this);
        this.handleNoteSectionEditChange = this.handleNoteSectionEditChange.bind(this);

        this.NoteTextDelete = this.NoteTextDelete.bind(this);
        this.PageDelete = this.PageDelete.bind(this);
        this.NotebookDelete = this.NotebookDelete.bind(this);
    }

    mydebug(name){
        if(this.state.active === 'T'){console.log(name);}
    }
    
//Hub Section
downloadNoteFile = () => {
    const x = document.createElement("a");
    let temp = JSON.stringify(this.state.Notebooks);
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
    console.log(this.state.Notebooks);
    this.state.Notebooks.forEach((a)=>{
        if(a != undefined && a.title === this.state.title){
            check = true;
        }
    });
    console.log(!check);
    console.log(this.state.title !== '');
    if(!check){
        console.log('made it here')
        let tempList = this.state.Notebooks.length > 0 ? this.state.Notebooks : [];
        let tempID = this.state.Notebooks.length > 0 ? this.state.Notebooks.length : 0;
        let singleObj = new Object({
        ID: tempID,
        sectionName:'',
        mainText: '',
        theNote: '',
        title: this.state.title,
        author:'',
        description:'',
        selectedNote: {},
        PageList: [],
        selectedDisplayText: '',
        globalTagList: [],
        wordCheck :'',
        tagTrigger :''
         });
         tempList.push(singleObj);
        console.log(tempList);
    
       let tempPageList = this.dropDownListCreator(tempList);
        this.setState({
            Notebooks: tempList,
            PageListDD: tempPageList,
            ID: singleObj.ID,
            sectionName:singleObj.sectionName,
            mainText: singleObj.mainText,
            theNote: singleObj.theNote,
            title: this.state.title,
            author:singleObj.author,
            description:singleObj.description,
            selectedNote: singleObj.selectedNote,
            PageList: singleObj.PageList,
            selectedDisplayText: singleObj.selectedDisplayText,
            globalTagList: singleObj.globalTagList,
            wordCheck :singleObj.wordCheck,
            tagTrigger :singleObj.tagTrigger
            });

    }
  }

  async saveLoad(){
    this.mydebug('saveLoad');
    let selectedListItem = document.getElementById("PageListDD");
        let selectedItem = this.state.Notebooks[selectedListItem.value];
        console.log(selectedListItem.value);
        console.log(selectedItem);


        console.log(selectedListItem.name)
        if(this.state.Notebooks.length > 0 || this.state.title !== ''){
            console.log('Step: 1');
            console.log(this.state.title);
            console.log(selectedItem.title);
             if(this.state.title === selectedItem.title){
                    console.log('Step: 2');
                let xlist = this.state.Notebooks;
                    console.log(selectedItem.title)
                    xlist.splice(selectedListItem.value,1,{
                    ID: this.state.ID,
                    sectionName:this.state.sectionName,
                    mainText: this.state.mainText,
                    theNote: this.state.theNote,
                    title: this.state.title,
                    author:this.state.author,
                    description:this.state.description,
                    selectedNote: this.state.selectedNote,
                    PageList: this.state.PageList,
                    globalTagList:this.state.globalTagList,
                    wordCheck : this.state.wordCheck,
                    tagTrigger : this.state.tagTrigger
                });
                let templist = this.dropDownListCreator(xlist);
                await this.setState({
                    Notebooks:xlist,
                    PageListDD: templist
                });
                console.log("The Same");
            }else if(selectedItem != undefined){
                console.log('Step: 5');
                console.log(selectedItem);
                //Load
                await this.setState({
                    ID: selectedItem.ID,
                    sectionName:selectedItem.sectionName,
                    mainText: selectedItem.mainText,
                    theNote: selectedItem.theNote,
                    title: selectedItem.title,
                    author:selectedItem.author,
                    description:selectedItem.description,
                    selectedNote: selectedItem.selectedNote,
                    PageList: selectedItem.PageList,
                    selectedDisplayText: '',
                    globalTagList:selectedItem.globalTagList,
                    wordCheck : '',
                    tagTrigger : '',
                    selected: true
        
                });
            }
            

        }else{
            console.log('Enter something');
        }
        
       
}
setSelected(event){
    this.mydebug("setSelected");
    let target = event.target;
    
    if(target != undefined){

        console.log(this.state.Notebooks);
        console.log(this.state.Notebooks[target.value]);
        console.log(this.state.Notebooks[target.value].title);
        let value = this.state.title === this.state.Notebooks[target.value].title ? true : false;
        this.setState({
            selected: value
        });
    }
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
            Notebooks: temp,
            PageListDD: templist
        })
        console.log(temp);
        console.log(contentBuffer);
    }catch(err){
        console.log(err);

    }
    console.log(this.state.Notebooks);


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
    /*
    handleDisplayText(){
        this.mydebug("handleDisplayText");
        let temp = '';
        let count = 0;
        this.state.PageList.forEach((e)=>{
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
*/
handleDisplayNote(section){
    this.mydebug("handleDisplayNote");
    let temp = '';
    let count = 0;
    for(let x = 0; x < section.texts.length; x++){}
    section.texts.forEach((a)=>{
        temp = temp + "\n" +  (a.time + "\n" + a.text ); 
    });
    /*
    this.state.PageList.forEach((e)=>{
        temp = count > 0 ? temp + "\n" + e.name: e.name + "\n" 
        e.texts.forEach((a)=>{
            temp = temp + "\n" +  (a.time + "\n" + a.text );                
        });
        count ++;       
    });
    */
    let test = section.name + "\n" + temp;
    test = test.replace(/(\*\-)/g, '');
    return test;
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
            let hv = this.state.PageList.length > 0 ? true : false;
            let temp = this.state.PageList;
            let os = hv ? temp[temp.length - 1] : 0;
            let ns = hv ? os.section + 1 : os + 1;
            let tempObj ={
                name: name,
                section: ns,
                texts:[],
                deletedTexts: [],
                note:''
            }
            temp.push(tempObj);
            this.setState({            
                sectionName:'',
                PageList: temp,
                selectedNote: tempObj,
                selectedDisplayText: ''
            });
        });
    }
    /*
    removeSection(key){
        this.mydebug("removeSection");
        let temp = this.state.PageList;
        temp.splice(getIndexOfObject(key, temp, "section"),1);
        this.setState({
            PageList: temp
        });
    }
    
    edit(id, sectionid){
        this.mydebug("edit");
        let tempData = this.state.PageList.findIndex(function (e){
            return e.section === sectionid ? e : -1;
        });
        let temp = this.state.PageList[tempData].texts;
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
        selectedTemp =  this.state.PageList[dataIndex];
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
            let tempId = this.state.PageList[dataIndex].texts.length;
            let tempArray = [];
            tempArray = this.state.PageList;
            let tempText = this.state.mainText;
            let reg = /(\*\-[^\s]+)/g;
            let tempTagString = '';
            let tempTagList = [];
            let tempTagArray = [...tempText.matchAll(reg)];
            tempTagArray.forEach((a) =>{
               let tempString = a['0'];
               tempString = tempString.replace(/(\*\-)/g,'');
               tempTagString += tempString + ', ';
               tempTagList.push(tempString);
               globaltaglist.push(tempString);
            });
            let temp = new Set();
            globaltaglist.forEach((c) =>{
                temp.add(c);
            });
            globaltaglist = [...temp];
            tempText = tempText.replace(/(\*\-)/g,'');
            let tempObject = {
                original_id: tempId,
                id: tempId,
                text: tempText + "\n",
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                visible: 'collapse',
                tags: tempTagList,
                tagString: tempTagString 
            }
            tempArray[dataIndex].texts.push(tempObject);
            //note create section here
            tempArray[dataIndex].note = this.handleDisplayNote(tempArray[dataIndex]);
            this.setState({
                PageList: tempArray,
                selectedNote: tempArray[dataIndex],
                globalTagList: globaltaglist
            });
            
        this.setText(dataIndex);
        //this.handleDisplayText();
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
        let textList = this.state.PageList[id].texts.map((e)=> 
        <table key={e.id}>
            <tbody>
                <tr className="noteSectionBackground" id={e.id + 'tr'} onClick={this.onOff}>
                    <td id={e.id +'td'}>
                        <div id={e.id}>
                            {e.visible == 'visible' ? '-':'+'}
                        </div>
                        <div id={e.id}>
                            {e.time} - {e.text.slice(0,40)}
                         </div>
                    </td>
                </tr>
                <tr className="noteSectionEdit" style={{visibility: e.visible}}>
                    <td>
                            <button onClick={this.onClickEdit} id={e.id}>Edit</button>                       
                    </td>
                    <td>
                        <button onClick={this.NoteTextDelete} id={e.id}>Remove</button>
                    </td>
                </tr>
                <tr style={{visibility: e.visible}}>
                    <td className="textareaFormat"><textarea id={e.id + 'textarea'} value={e.text} rows="10" cols="100" onChange={this.handleNoteSectionEditChange} readOnly/></td>
                    <td className="tagFormat">{e.tagString}</td>
                </tr>
            </tbody>            
        </table>        
        ) ;
         this.setState({
              selectedDisplayText: textList
          });
    }
    NotebookDelete(e){
        console.log('NotebookDelete')
        console.log(this.state.Notebooks);
        
        //let target = e.target;
        let index = this.state.ID ;// target.id - 1;
        console.log(index);
        //console.log(this.state.notebooks.length);
        let tempNotebookList =  this.state.Notebooks;
        let tempDNotebookList  = this.state.DeletedNotebooks;
        let deletedNotebook = tempNotebookList[index];
        tempDNotebookList.push(deletedNotebook);
        tempNotebookList.splice(index,1);
        for(let x = index; x < tempNotebookList.length;x++){
            tempNotebookList[x].ID = x;
        }
        let templist = this.dropDownListCreator(tempNotebookList);
        this.setState({
            Notebooks: tempNotebookList,
            DeletedNotebooks: tempDNotebookList,
            PageListDD: templist,
            ID: -1,
            sectionName:'',
            mainText: '',
            theNote: '',
            title: '',
            author:'',
            description:'',
            selectedNote: {},
            PageList: [],
            selectedDisplayText: '',
            globalTagList: [],
            wordCheck :'',
            tagTrigger :''
        });
        
    }
    PageDelete(e){
        console.log('PageDelete')
        let target = e.target;
        let index = target.id - 1;
        let tempPageList = new Array();
        tempPageList = this.state.PageList;
        let tempDPageList = this.state.DeletedPageList;
        let deletedPage = tempPageList[index];
        tempDPageList.push(deletedPage);
        tempPageList.splice(index,1);
        for(let x = index; x < tempPageList.length;x++){
            tempPageList[x].section = x + 1;
        }
        this.setState({
                PageList: tempPageList,
                DeletedPageList: tempDPageList
        });
    }
    NoteTextDelete(e){
        let target = e.target;
        let index = target.id;
        let selectedIndex = Number(this.state.selectedNote.section) - 1;
        let tempList = this.state.PageList;

        let tempSection = this.state.selectedNote;
        let tempDelete = tempSection.texts[index];
        tempSection['deletedTexts'] == undefined ? tempSection['deletedTexts'] = [] : tempSection['deletedTexts'] = tempSection.deletedTexts;
        tempSection.deletedTexts.push(tempDelete);
        tempSection.texts.splice(index,1);
        for(let x = index; x < tempSection.texts.length; x++){
            tempSection.texts[x].id = Number(x);
        }
        tempList[selectedIndex] = tempSection;
        this.setState({
                PageList:tempList,
                selectedNote: tempSection
        });
        this.setText(selectedIndex);
    }

    onClickEdit(e){
        let target = e.target;
        let id = target.id;
        let textarea = document.getElementById(id + 'textarea');
        if(target.innerHTML === 'Edit'){
            target.innerHTML = 'Done';
            textarea.readOnly = false; 
        }else{
            target.innerHTML = 'Edit';
            textarea.readOnly = true; 
        }
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
    handleNoteSectionEditChange(event){
        //This will handle any state that is not an object or part of an array I pass in the name of the state value and assign that and then assign the value 
        //this is helpful because then I only need one handleChange for at least these simple changes.
        let target = event.target;
        let value = target.value;
        let name = target.name;
        let textIndex = Number(target.id.replace('textarea',''));
        let selectedIndex = Number(this.state.selectedNote.section) - 1;
        
        let tempSelected = this.state.selectedNote;
        let tempList = this.state.PageList;
        tempSelected.texts[textIndex].text = value;
        tempList[selectedIndex] = tempSelected;

        this.setState({
            PageList: tempList,
            selectedNote: tempSelected
        });
        this.setText(selectedIndex);
    }
   

    render(){
        //Hub Section
        let NoteDropDownList =  this.state.PageListDD.map((a) =>
            <option key={a.position} value={a.position } >{a.name}</option>
        );
        //Note Section
        var noteSelection = undefined;
        if(this.state.PageList != undefined && this.state.PageList.length > 0){
             noteSelection = this.state.PageList.map((e)=>
        <li key={e.section} className="leftAlign">
            <div className="inline-box-align">
                <button onClick={this.PageDelete} id={e.section}>-</button>
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
                        <div className="notelist">
                            <div>
                                <select id="PageListDD" onClick={this.setSelected}>                        
                                        {NoteDropDownList}
                                </select>
                            </div>
                            <div>
                                <button onClick={this.saveLoad}>{this.state.selected ? 'Save' : 'Load'}</button>
                                <button onClick={this.newNote} >New</button>  
                            </div>                                
                        </div>
                        <div className="upload">
                            <input id="upload" type="file" /> 
                            <button onClick={this.upload}>Upload</button>
                            <button onClick={this.downloadNoteFile}>Export</button>
                        </div>
                    </div>
                </div>
                
                <div className="Overview">
                    <div className="wrapper">
                        <div className="OverviewChild">
                            <label htmlFor="title">Title:</label>
                            <input  type="text" id="title" name="title" value={this.state.title} onChange={this.handleChange} />
                            <button onClick={this.NotebookDelete}>Remove Notebook</button>
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
                            <label>{this.state.selectedNote.name}</label> 
                        </div>
                        <div id="notes">
                            {this.state.selectedDisplayText}
                        </div>
                    </div> 
                </div>

                <div className="TheNote">
                    <textarea value={this.state.selectedNote.note} readOnly/>
                </div>
            </div>
            
        );
    }

}

