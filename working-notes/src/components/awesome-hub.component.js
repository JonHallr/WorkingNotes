import React,  {Component} from 'react';
import * as CryptoJS from 'crypto-js';
import './css/awesome-hub.css';
//import {TextNoteComponent} from '../notes/TextNoteComponent';
import {getIndexOfObject} from './shared/util';
import {ClockComponent} from './shared/clock.component';

const autosave = 0;
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
            //notebook
            selectedNotebook: {},
            selectedNotebookValue: 0,
            //Note Section
            ID: 0,
            active: 'T',
            mainText: '',
            originalTitle: '',
            title: '',
            //Page
            pageName:'', // new page name value
            selectedPage: {}, //selected section of the note
            PageList: [], // selected Note section list
            DeletedPageList:[],
            selectPageValue: 0,
            //Note Section
            selectedNote: {},
            selectNoteValue: 0,
            selectedDisplayText: '',
            //Tag
            globalTagList:[], // global tag for the selected Note
            //util values
            yours:'',
            isEncrypt: false,
            isUploaded:false,
            isNew:false,
            wordCheck : '',
            tagTrigger : '',
            autoSave:0,
            //the note
            theNote: '',
            testDisplay:''
        }; 


        //Hub Section
        this.load = this.load.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.upload = this.upload.bind(this);
        //Note Section
        this.handleChange = this.handleChange.bind(this);
        this.myRefresh = this.myRefresh.bind(this);
        //this.handleDisplayText = this.handleDisplayText.bind(this);
        this.addPage = this.addPage.bind(this);

        this.selectPage = this.selectPage.bind(this);
        this.addNote = this.addNote.bind(this);
        this.setText = this.setText.bind(this);
        this.onOff = this.onOff.bind(this);
        this.tagAssign = this.tagAssign.bind(this);
        this.mydebug = this.mydebug.bind(this);

        this.addNotebook = this.addNotebook.bind(this);

        this.onClickEdit = this.onClickEdit.bind(this);
        this.handleNoteSectionEditChange = this.handleNoteSectionEditChange.bind(this);

        this.NoteTextDelete = this.NoteTextDelete.bind(this);
        this.PageDelete = this.PageDelete.bind(this);
        this.DeleteNotebook = this.DeleteNotebook.bind(this);

        this.test = this.test.bind(this);

        this.selectNote = this.selectNote.bind(this)

        this.selectNotebook = this.selectNotebook.bind(this);

        this.save = this.save.bind(this);

;    }

    mydebug(name){
        if(this.state.active === 'T'){console.log(name);}
    }
    
//Hub Section
downloadNoteFile = () => {
    const x = document.createElement("a");
    let temp = JSON.stringify(this.state.Notebooks);
    var crazy;
    if(this.state.isEncrypt && this.state.yours.length > 0){
        let key = this.state.yours;
        crazy = CryptoJS.AES.encrypt(temp,key);
    }

    const file = new Blob([this.state.isEncrypt ? crazy : temp], {type: 'application/json'});
    //const file = new Blob([temp], {type: 'application/json'});
    x.href = URL.createObjectURL(file);
    x.download = "MyAwesomeNote.json";
    document.body.appendChild(x); // Required for this to work in FireFox
    x.click();
  }

  addNotebook(){      
    this.mydebug('addNotebook');
    /*
    let check = false; 
    this.state.Notebooks.forEach((a)=>{
        if(a != undefined && a.title === this.state.title){
            check = true;
        }
    });
    if(!check){
        */
        let tempList = this.state.Notebooks.length > 0 ? this.state.Notebooks : [];
        let tempID = this.state.Notebooks.length > 0 ? this.state.Notebooks.length : 0;
        let singleObj = new Object({
        ID: tempID,
        pageName:'',
        mainText: '',
        theNote: '',
        title: 'New Notebook',
        selectedPage: {},
        PageList: [],
        selectedDisplayText: '',
        globalTagList: [],
        wordCheck :'',
        tagTrigger :''
         });
         tempList.push(singleObj);
       let tempPageList = this.dropDownListCreator(tempList);
        this.setState({
            Notebooks: tempList,
            selectedNotebook: singleObj,
            selectedNotebookValue:tempID,
            PageListDD: tempPageList,
            ID: singleObj.ID,
            pageName:singleObj.pageName,
            mainText: singleObj.mainText,
            theNote: singleObj.theNote,
            originalTitle: this.state.title,
            title: singleObj.title,
            selectedPage: singleObj.selectedPage,
            PageList: singleObj.PageList,
            selectedDisplayText: singleObj.selectedDisplayText,
            globalTagList: singleObj.globalTagList,
            wordCheck :singleObj.wordCheck,
            tagTrigger :singleObj.tagTrigger,
            isNew: true
            });

    }
 // }
 /*componentDidMount(){
     console.log('componentDidMount')
    setInterval(this.save,1000);
 }*/
  async save(){
      this.mydebug('save');
        let selectedListItem = document.getElementById("PageListDD");
        if(selectedListItem){
                await this.globalTagAssign();
               let xlist = this.state.Notebooks;
                   xlist.splice(selectedListItem.value,1,{
                   ID: this.state.selectedNotebook.ID,
                   pageName:this.state.selectedNotebook.pageName,
                   mainText: this.state.selectedNotebook.mainText,
                   theNote: this.state.selectedNotebook.theNote,
                   title: this.state.selectedNotebook.title,
                   selectedPage: this.state.selectedNotebook.selectedPage,
                   PageList: this.state.selectedNotebook.PageList,
                   globalTagList:this.state.selectedNotebook.globalTagList,
                   wordCheck : this.state.selectedNotebook.wordCheck,
                   tagTrigger : this.state.selectedNotebook.tagTrigger,
                   selectPageValue: this.state.selectedNotebook.selectPageValue,
                   selectedNote: this.state.selectedNotebook.selectedNote,
                   selectNoteValue: this.state.selectedNotebook.selectNoteValue,
                   selectedNotebook: this.state.selectedNotebook,
                   selectedNotebookValue: this.stateselectedNotebookValue
               });
               let templist = this.dropDownListCreator(xlist);
               await this.setState({
                   Notebooks:xlist,
                   PageListDD: templist,
               });
        }else{
            console.log('no');
        }
        console.log(this.state);

  }
  async load(){
    this.mydebug('load');
    let selectedListItem = document.getElementById("PageListDD");
    if(selectedListItem){
        let selectedItem = this.state.Notebooks[selectedListItem.value];
        //Load
        await this.setState({
            ID: selectedItem.ID,
            pageName:selectedItem.pageName,
            mainText: selectedItem.mainText,
            theNote: selectedItem.theNote,
            originalTitle: selectedItem.title,
            title: selectedItem.title,
            selectedPage: selectedItem.selectedPage,
            PageList: selectedItem.PageList,
            selectedDisplayText: '',
            globalTagList:selectedItem.globalTagList,
            wordCheck : '',
            tagTrigger : '',
            selected: true,         
            selectPageValue: selectedItem.selectPageValue,
            selectedNote: selectedItem.selectedNote,
            selectNoteValue: selectedItem.selectNoteValue

        });
    };
       
}
async setSelected(event){
    this.mydebug("setSelected");
    let target = event.target;
    
    if(target != undefined && this.state.Notebooks.length > 0){
        let value = this.state.title === this.state.Notebooks[target.value].title ? true : false;
        this.setState({
            selected: value
        });
    }
    await this.load();
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
        var temp;
    if(this.state.isEncrypt){
        let key = this.state.yours;
        let back = CryptoJS.AES.decrypt(contentBuffer, key);
        temp = JSON.parse(back.toString(CryptoJS.enc.Utf8));
    }else{
        temp = JSON.parse(contentBuffer);

    }   
        let templist = this.dropDownListCreator(temp) ;
        this.setState({
            Notebooks: temp,
            PageListDD: templist,
            isUploaded:true
        })
    }catch(err){
        console.log(err);

    }
}

dropDownListCreator(temp){
    this.mydebug('dropDownListCreator');
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
    return templist;
}
//Note Section


    handleChange(event){
        //This will handle any state that is not an object or part of an array I pass in the name of the state value and assign that and then assign the value 
        //this is helpful because then I only need one handleChange for at least these simple changes.
        let target = event.target;
        let value = target.value;
        let name = target.name;
        let temp = {};
        temp = this.state.selectedNotebook;
        temp[name] = value;
        console.log(value);
        console.log(name);
        this.setState({
            selectedNotebook: temp
        });
        if(name === 'title'){
            this.save();
        }
    }
handleDisplayNote(section){
    this.mydebug("handleDisplayNote");
    let temp = '';
    let count = 0;
    for(let x = 0; x < section.texts.length; x++){}
    section.texts.forEach((a)=>{
        temp = temp + "\n" +  (a.time + "\n" + a.text ); 
    });
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

    addPage(){
        this.mydebug('addPage');
        var templateList = this.state.selectedNotebook.pageName.split(";");
        templateList.forEach((name)=> {
            let hv = this.state.selectedNotebook.PageList.length > 0 ? true : false;
            let temp = this.state.selectedNotebook;
            let os = hv ? temp.PageList[temp.PageList.length - 1] : 0;
            let ns = hv ? os.section + 1 : os + 1;
            let tempObj ={
                name: name,
                section: ns,
                texts:[],
                deletedTexts: [],
                note:''
            }
            temp.pageName = '';
            temp.selectedPage = tempObj;
            temp.selectedPageValue = ns;
            temp.selectedNote = {};
            temp.PageList.push(tempObj);
            console.log(temp);
            this.setState({            
                /*pageName:'',
                PageList: temp.PageList,
                selectedPage: tempObj,
                selectedDisplayText: '',
                selectPageValue: ns,
                selectedNote: {},*/
                selectedNotebook: temp,
            });
            this.save();
            //console.log(ns);
           // this.setText(ns-1);
            //document.getElementById("selectPage").selectedIndex = ns > 0 ? ns - 1: ns ;
        });
    }
    selectNotebook(){
        this.mydebug("selectNotebook");
        let tempSelected = document.getElementById("PageListDD");
        let id = Number(tempSelected.options[tempSelected.selectedIndex].value);
        let selectedTempNotebook = {};
        selectedTempNotebook =  this.state.Notebooks[id];
        this.setState({
            selectedNotebook: selectedTempNotebook,
            selectedNotebookValue: id
        });
        this.load();
        //this.setText(dataIndex);
    }
    //update the selected page
    selectPage(){
        this.mydebug("selectPage");
        let tempSelected = document.getElementById("selectPage");
        let id = Number(tempSelected.options[tempSelected.selectedIndex].value);
        let dataIndex = id - 1;
        let selectedTemp = {};
        console.log(id);
        let tempNotebook = this.state.selectedNotebook;
        tempNotebook.selectedPage =  tempNotebook.PageList[dataIndex];
        tempNotebook.selectedPageValue = id;
        this.setState({
            selectedNotebook: tempNotebook,
        });
        //this.setText(dataIndex);
    }
    //update the selected note
    selectNote(){
        this.mydebug("selectNote");
        let tempSelected = document.getElementById("selectNote");
        let id = Number(tempSelected.options[tempSelected.selectedIndex].value);
        let selectedTempNote = {};
        selectedTempNote =  this.state.selectedPage.texts[id];
        this.setState({
            selectedNote: selectedTempNote,
            selectNoteValue: id
        });
        //this.setText(dataIndex);
    }
    //Need to look into this more the results not good
    globalTagAssign(){
        let globalTemp =[...this.state.globalTagList];
        let pageTemp = [...this.state.PageList];
        //let globalListTemp = [];
        let pageListTemp = [];
            pageTemp.forEach((a)=>{
                    let noteListTemp = [];
                    a.texts.forEach((c)=>{
                        let tempTag = c.tags;
                        c.text.split(' ').forEach((d)=>{
                            globalTemp.forEach((b)=>{
                                if(d === b){
                                    tempTag.push(b);
                                }
                            });
                        });
                        c.tags = tempTag;
                        noteListTemp.push(c);
                    });
                a.texts = noteListTemp;
                pageListTemp.push(a);
            });
        this.setState({
                PageList: pageListTemp   
        });
    }

    play(textPass){
        let tempArray = [];
        let temp = '';
        for(let x = 0; x < textPass.length; x++){
            let ascii = textPass.charCodeAt(x);
            if(ascii === 10){
                temp += '\n';
            }else{
                temp += textPass[x];            
            }
        }
        tempArray.push(temp);
        let making = tempArray.map((a)=>
            <pre>{a}</pre>
        );
        this.setState({
            testDisplay:  making
        });
    }
    //add a note section.
    addNote(event){
        this.mydebug("addNote");

        let globaltaglist = this.state.globalTagList;
        let dataIndex = event.target.id - 1;
        if(this.state.mainText != undefined && this.state.mainText.trim() !== ''){
            let d = new Date();
            let tempId = this.state.PageList[dataIndex].texts.length;
            let tempArray = [];
            tempArray = this.state.PageList;
            let tempText = this.state.mainText;
            //console.log(tempText);
            this.play(tempText);
            let tempTagList = [];
            //global tag assign
            globaltaglist.forEach((a)=>{
                tempText.split(' ').forEach((b)=>{
                    if(b === a){
                        tempTagList.push(b);
                    }
                });
            });
            let reg = /(\*\-[^\s]+)/g;
            let tempTagString = '';
            let tempTagArray = [...tempText.matchAll(reg)];
            tempTagArray.forEach((a) =>{
               let tempString = a['0'];
               tempString = tempString.replace(/(\*\-)/g,'');
               tempTagList.push(tempString);
               globaltaglist.push(tempString);
            });
            let globalTemp = new Set();
            let localTemp = new Set();
            tempTagList.forEach((a)=>{localTemp.add(a)});
            globaltaglist.forEach((c) =>{
                globalTemp.add(c);
            });
            globaltaglist = [...globalTemp];
            tempTagList = [...localTemp];
            tempTagList.forEach((a)=>{                
               tempTagString += ' (' + a + ') ';
            });
            //global tag assign
            let tempObject = {
                original_id: tempId,
                original_text: tempText,
                id: tempId,
                text: tempText.replace(/(\*\-)/g,'') + "\n",
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                date: d.getMonth() + '/' + d.getDay() + '/' + d.getFullYear(),
                visible: 'collapse',
                tags: tempTagList,
                tagString: tempTagString 
            }
            tempArray[dataIndex].texts.push(tempObject);
            //note create section here
            tempArray[dataIndex].note = this.handleDisplayNote(tempArray[dataIndex]);
            this.setState({
                PageList: tempArray,
                selectedPage: tempArray[dataIndex],
                globalTagList: globaltaglist,
                selectedNote: tempObject,
                selectNoteValue: tempId
            });
         
        this.save();   
        //this.setText(dataIndex);
        //this.handleDisplayText();
        this.myRefresh();
        }
        
        
    }
    //Hides the text section of a note in the list
    onOff(event){
        this.mydebug("onOff");
        if(event != undefined){
             let id = event.target.id;
             let temp = this.state.selectedPage;
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
                selectedPage: temp
             });
             this.setText(temp.section - 1);
             
        }
        
    }

    setText(id){
        /*
        console.log(this.state.PageList[id]);
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
                    <td className="tagFormat">{e.tags.map((a)=>
                        <div>
                            {a}
                        </div>
                    )}</td>
                </tr>
            </tbody>            
        </table>        
        ) ;
         this.setState({
              selectedDisplayText: textList
          });*/
    }
    DeleteNotebook(e){
        this.mydebug('DeleteNotebook')
        
        let index = this.state.ID ;
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
            pageName:'',
            mainText: '',
            theNote: '',
            title: '',
            selectedPage: {},
            PageList: [],
            selectedDisplayText: '',
            globalTagList: [],
            wordCheck :'',
            tagTrigger :''
        });
        this.save();
        
    }
    PageDelete(e){
        this.mydebug('PageDelete')
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
        let newIndex = index < tempPageList.length ? index : tempPageList.length - 1 ;
        this.setState({
                PageList: tempPageList,
                DeletedPageList: tempDPageList,
                selectedPage: tempPageList[newIndex],
                selectPageValue: index
        });
        this.save();
        //this.setText(newIndex)
    }
    NoteTextDelete(e){
        let target = e.target;
        let index = target.id;
        let selectedIndex = Number(this.state.selectedPage.section) - 1;
        let tempList = this.state.PageList;

        let tempSection = this.state.selectedPage;
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
                selectedPage: tempSection
        });
        this.save();
        //this.setText(selectedIndex);
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
        let selectedIndex = Number(this.state.selectedPage.section) - 1;
        
        let tempSelected = this.state.selectedPage;
        let tempList = this.state.PageList;
        tempSelected.texts[textIndex].text = value;
        tempList[selectedIndex] = tempSelected;

        this.setState({
            PageList: tempList,
            selectedPage: tempSelected
        });
        this.setText(selectedIndex);
    }
    test(){
        let value = !this.state.isEncrypt;
        this.setState({
            isEncrypt: value
        });
    }
   

    render(){
        let selected = this.state.selectedNotebook.selectedPage;
        //Hub Section
        /*let notebookSelect =  this.state.PageListDD.map((a) =>
            <option key={a.position} value={a.position } >{a.name}</option>
        );*/
        var notebookSelect = undefined;
        if(this.state.Notebooks != undefined && this.state.Notebooks.length > 0){
            notebookSelect = this.state.Notebooks.map((e)=>
        <option key={e.ID} value={e.ID}>
                {e.title} - {e.PageList.length}
        </option>
        );
        }
        //Note Section
        var pageSelection = undefined;
        console.log(this.state);
        if(this.state.selectedNotebook.PageList != undefined && this.state.selectedNotebook.PageList.length > 0){
            pageSelection = this.state.selectedNotebook.PageList.map((e)=>
        <option key={e.section} value={e.section}>
                {e.name} - {e.texts.length}
        </option>
        );
        }
        var noteSelection = undefined;
        if(selected != undefined && selected.texts != undefined){
            var pageName = selected.name;
            noteSelection = selected.texts.map((e)=>
                <option key={e.id} value={e.id}>
                        {e.id + 1}: {pageName} ({e.date})
                </option>
            );
        }
        var code;
        if((!this.state.isUploaded && !this.state.isNew)){
            code = (
                    <div className="hub">
                        <LandingPage
                            yours={this.state.yours}
                            isEncrypt={this.state.isEncrypt}
                            test={this.test}
                            upload={this.upload}
                            handleChange={this.handleChange}
                            title={this.state.title}
                            addNotebook={this.addNotebook} />
                    </div>
            );
        }else{
            code =(
                <div className="wrapper">
                        <div className ="TheAwesomeTextBox">                    
                            <div className="wrapper">
                                <div className="SectionThreeATB">
                                    <div className="Overview"> 
                                        <OverviewComponent  handleChange={this.handleChange} 
                                                            DeleteNotebook={this.DeleteNotebook} 
                                                            title={this.state.selectedNotebook.title}
                                                            originalTitle ={this.state.originalTitle}
                                                            selected={this.state.selected} 
                                                            selectNotebook={this.selectNotebook} 
                                                            notebookSelect={notebookSelect}
                                                            saveLoad={this.saveLoad}
                                                            addNotebook={this.addNotebook}
                                                            downloadNoteFile={this.downloadNoteFile}
                                                            selectedNotebookValue ={this.state.selectedNotebookValue} />                  
                                    </div>
                                </div>
                                <div className="SectionOneATB">
                                    <div className="TheAwesomeTextBoxChild" id="TheAwesomeTextBox">
                                            <h2>Awesome Text Box for Page {selected.name}</h2>
                                            <div>
                                                <textarea className='main-text' name="mainText" id="awesometextarea" value={this.state.selectedNotebook.mainText} onChange={this.handleChange} rows="10" cols="50"/>
                                            </div>                            
                                            <div>
                                                <button onClick={this.tagAssign}>Tag</button>
                                                <button onClick={this.addNote} id={selected.section}>Add Note</button>
                                            </div>             
                                        </div>
                                        
                                </div>
                                <div className="SectionTwoATB">
                                        <div className="TheAwesomeTextBoxChild" id="NoteSectionList">
                                            <select id="selectPage"  onChange={this.selectPage} value={this.state.selectedNotebook.selectedPageValue}>
                                                {pageSelection}
                                            </select>
                                            <div>
                                                <input type="text" name="pageName" value={this.state.selectedNotebook.pageName} onChange={this.handleChange}/>
                                                <button onClick={this.addPage}>New Page</button>
                                            </div> 
                                            <div id="info_section">
                                                <label>{this.state.selectedNotebook.selectedPage.name}</label> 
                                                <button onClick={this.PageDelete} id={this.state.selectedNotebook.selectedPage.section}>Remove Page</button>
                                            </div>
                                        </div>
                                    <div className="NoteSection" >
                                            <div id="notes">
                                            <select id="selectNote" onChange={this.selectNote} value={this.state.selectedNotebook.selectNoteValue}>
                                                {noteSelection}
                                            </select>
                                            <textarea value={this.state.selectedNote !== undefined ? this.state.selectedNote.text :'' } onChange={this.handleChange} rows="10" cols="50" readOnly/>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="TheNote">
                        {this.state.testDisplay}
                        </div>
                </div>
            );
        }
        return (
            <div>
                {code}                
            </div>
            
            
        );
    }

}



/*
                            <textarea value={this.state.selectedPage.note} readOnly/>

                <button onClick={this.PageDelete} id={e.section}>-</button>
*/

class LandingPage extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="wrapper">
                <div className="new">
                    <label htmlFor="title">Title:</label>
                    <input  type="text" id="title" name="title" value={this.props.title} onChange={this.props.handleChange} />
                    <button onClick={this.props.addNotebook} >New Notebook</button>
                </div>
                <div className="crypt">
                    <label htmlFor="yours">Key:</label>
                    <input type="text"  name='yours' value={this.props.yours} onChange={this.props.handleChange} style={{visibility: this.props.isEncrypt ? 'visible' : 'hidden'}} /> 
                </div>
                <div className="upload">
                    <input id="upload" type="file" />
                    <button onClick={this.props.upload}>Upload</button> 
                    <label htmlFor="encryptCheck">Encrypt:</label>
                    <input type='checkbox' name="encryptCheck" value={this.props.isEncrypt} onClick={this.props.test}/>
                </div>
            </div>

        );
    }
}


class OverviewComponent extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="OverviewWrapper">
                <div className="TitleSection">
                    <label htmlFor="title">Notebook:</label>
                    <input  type="text" id="title" name="title" value={this.props.title} onChange={this.props.handleChange} />
                    <button onClick={this.props.DeleteNotebook}>{'Remove Notebook'}</button>
                    <button onClick={this.props.addNotebook }>{'Add Notebook'}</button>
               
                </div>
                <div className="notebooklist">
                    <select id="PageListDD" onChange={this.props.selectNotebook} value={this.props.selectedNotebookValue}>                        
                              {this.props.notebookSelect}
                     </select>
                     <button onClick={this.props.saveLoad}>{this.props.selected ? 'Save' : 'Load'}</button>
                     <button onClick={this.props.downloadNoteFile}>Export</button>  
                                          
                </div>
            </div> 
        );
    }
}


