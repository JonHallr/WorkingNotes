import React, { Component } from 'react';
import './css/awesome-hub.css';
import { readOnlyPageDisplay,readOnlyNoteDisplay } from './shared/util';
import { clone, parenthesizedExpression } from '@babel/types';

import cloneDeep from 'lodash/cloneDeep';

export class NoteComponent extends Component {
    constructor(props) {
        super(props);
        this.stateChange = props.stateChange || new Function();

        this.state = {
            noteEdit:false,
            notebookNumber: 0,
            pageNumber: 0,
            noteNumber:0,
            copyToSet:false,
            noteMoveTo:false,
        };

        this.removeNote = this.removeNote.bind(this);
        this.saveNote = this.saveNote.bind(this);
        this.editNote = this.editNote.bind(this);
        this.selectNote = this.selectNote.bind(this);

        this.handleChangeNoteEdit = this.handleChangeNoteEdit.bind(this);
        this.handleNoteTitleChange = this.handleNoteTitleChange.bind(this);

    
        this.copyToSet = this.copyToSet.bind(this);
        this.moveToSet = this.moveToSet.bind(this);

        this.noteCopyTo = this.noteCopyTo.bind(this);
        this.noteMoveTo = this.noteMoveTo.bind(this);


        this.selectToNotebook = this.selectToNotebook.bind(this);
        this.selectToPage = this.selectToPage.bind(this);

        this.noteNumberOnChange = this.noteNumberOnChange.bind(this);

        this.addNote = this.addNote.bind(this);
    }
    addNote(event) {
        var noteStateObj = this.props.stateObj;
        let tempNotebooks = noteStateObj.Notebooks;
        let tempSelectedNotebook = noteStateObj.Notebooks[noteStateObj.selectedNotebookValue];
        let dataIndex = tempSelectedNotebook.selectedPageValue;
            let d = new Date();
            let tempId = tempSelectedNotebook.PageList.length > 0 ? tempSelectedNotebook.PageList[dataIndex].texts.length : 0;
            let tempArray = [];
            tempArray = tempSelectedNotebook.PageList;
            let tempObject = {
                original_id: tempId,
                original_text: '',
                id: tempId,
                title:'<New Note>',
                text: '' + "\n",
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
            }
            
            tempArray[dataIndex].texts.push(tempObject);


            let tempPageDisplay = readOnlyPageDisplay(tempArray[dataIndex]);
            let tempNoteDisplay = readOnlyNoteDisplay(tempArray[dataIndex].texts[tempId]);
            tempSelectedNotebook.PageList = tempArray;
            tempSelectedNotebook.PageList[dataIndex].selectedNoteValue = tempId;
            tempNotebooks[noteStateObj.selectedNotebookValue] = tempSelectedNotebook;

            var isNewNoteCheck = noteStateObj.isNewNote;
            if(isNewNoteCheck){isNewNoteCheck = false};
            let obj ={
                Notebooks: tempNotebooks,
                pageView: tempPageDisplay,
                noteView: tempNoteDisplay,
                noteTitle: tempObject.title,
                isNewNote:isNewNoteCheck,
                isNewPage: false,
            };
            this.setState({
                pageNumber: 0,
                notebookNumber: 0,
                noteNumber:0,
                copyToSet:false,
                moveToSet:false,
                noteEdit:true,
            });
    
            this.props.noteComponentSave(obj);
            if(!noteStateObj.isNewNote){
                this.menuToggle()

            }

    }


    moveToSet(){
        let value = !this.state.moveToSet;
        this.setState({
            moveToSet:value,
            copyToSet:false,
        });
    }
    noteMoveTo(){
        var noteStateObj = this.props.stateObj;
        let moveToNotebook = this.state.notebookNumber;
        let moveToPage = Number(this.state.pageNumber);
        let moveNoteTo = Number(this.state.noteNumber);
        let notebooks = noteStateObj.Notebooks;
        let notebookIndex = noteStateObj.selectedNotebookValue;
        let pagelists = notebooks[notebookIndex].PageList;
        let moveNoteValue = cloneDeep(pagelists[notebooks[notebookIndex].selectedPageValue].texts[notebooks[notebookIndex].selectedNoteValue]) ;
        let textlist = cloneDeep(notebooks[moveToNotebook].PageList[moveToPage].texts);

        if(moveToPage === notebooks[notebookIndex].selectedPageValue){
            textlist.splice(notebooks[notebookIndex].selectedNoteValue, 1);
        }

        let noteSizeCheck = textlist.length;       
        let temp = [];
        if(noteSizeCheck >= moveNoteTo){ 
            if(noteSizeCheck === moveNoteTo){
                temp = textlist;
                temp.push(moveNoteValue);
            }else{       
                for(let x = 0; x < textlist.length; x++){
                    if(x === moveNoteTo){
                        temp.push(moveNoteValue);
                        temp.push(textlist[x]);
                    }else{
                        temp.push(textlist[x]);
                    }
                }
            }
        }else{
            temp.push(moveNoteValue);
        }
        for (let x = 0; x < temp.length; x++) {
            temp[x].id = x;
        }


            if(moveNoteTo !== noteStateObj.Notebooks[notebookIndex].selectedPageValue){
                let leavingNotelist = cloneDeep(notebooks[notebookIndex].PageList[notebooks[notebookIndex].selectedPageValue].texts);
                leavingNotelist.splice(notebooks[notebookIndex].selectedNoteValue, 1);
                notebooks[notebookIndex].PageList[notebooks[notebookIndex].selectedPageValue].texts = leavingNotelist;
            }


            notebooks[moveToNotebook].PageList[moveToPage].texts = temp;

            let tempPageView = '';
            let tempNoteView = '';
            let tempNoteTitle = '';
            let hasNotes = false;
            let hasPages = false;
            if(notebooks[noteStateObj.selectedNotebookValue].PageList.length > 0){
                hasPages = true;
                if(notebooks[noteStateObj.selectedNotebookValue].PageList[notebooks[noteStateObj.selectedNotebookValue].selectedPageValue].texts.length > 0){
                    notebooks[moveToNotebook].selectedNoteValue = notebooks[noteStateObj.selectedNotebookValue].selectedNoteValue;
                    tempPageView = readOnlyPageDisplay(notebooks[noteStateObj.selectedNotebookValue].PageList[notebooks[noteStateObj.selectedNotebookValue].selectedPageValue])
                    tempNoteView= readOnlyNoteDisplay(notebooks[notebookIndex].PageList[notebooks[notebookIndex].selectedPageValue].texts[0]);
                    tempNoteTitle = notebooks[notebookIndex].PageList[notebooks[notebookIndex].selectedPageValue].texts[0].title;
                    hasNotes = true;
                };
            }
            let obj ={
                Notebooks: notebooks,
                pageView: tempPageView,
                noteView:tempNoteView,
                noteTitle:tempNoteTitle,
                isNewNote: !hasNotes,
                isNewPage: !hasPages,
            };
            this.setState({
                pageNumber: 0,
                notebookNumber: 0,
                noteNumber:0,
                copyToSet:false,
                moveToSet:false,
            });
    
            this.props.noteComponentSave(obj);
            this.menuToggle()
            

        }
    copyToSet(){
        let value = !this.state.copyToSet;
        this.setState({
            moveToSet:false,
            copyToSet:value,
        });
    }
    noteCopyTo(){
        var noteStateObj = this.props.stateObj;
        let copyToNotebook = this.state.notebookNumber;
        let copyToPage = Number(this.state.pageNumber);
        let copyNoteTo = Number(this.state.noteNumber);
        let notebooks = noteStateObj.Notebooks;
        let notebookIndex = noteStateObj.selectedNotebookValue;
        let pagelists = notebooks[notebookIndex].PageList;
        let copyNoteValue = cloneDeep(pagelists[notebooks[notebookIndex].selectedPageValue].texts[notebooks[notebookIndex].selectedNoteValue]) ;
        let textlist = cloneDeep(notebooks[copyToNotebook].PageList[copyToPage].texts);

        let noteSizeCheck = textlist.length;       
        let temp = []
        if(noteSizeCheck >= copyNoteTo){ 
            if(noteSizeCheck === copyNoteTo){
                temp = textlist;
                temp.push(copyNoteValue);
            }else{   
                for(let x = 0; x < textlist.length; x++){
                    if(x === copyNoteTo){
                        temp.push(copyNoteValue);
                        temp.push(textlist[x]);
                    }else{
                        temp.push(textlist[x]);
                    }
                }
            }
        }else{
            temp.push(copyNoteValue);
        }
        for (let x = 0; x < temp.length; x++) {
            temp[x].id = x;
        }

        notebooks[copyToNotebook].PageList[copyToPage].texts = temp;

            let tempPageView = '';
            let tempNoteView = '';
            let tempNoteTitle = '';
            let hasNotes = false;
            if(notebooks[noteStateObj.selectedNotebookValue].PageList[notebooks[noteStateObj.selectedNotebookValue].selectedPageValue].texts.length > 0){
                notebooks[copyToNotebook].selectedNoteValue = notebooks[noteStateObj.selectedNotebookValue].selectedNoteValue;
                tempPageView = readOnlyPageDisplay(notebooks[noteStateObj.selectedNotebookValue].PageList[notebooks[noteStateObj.selectedNotebookValue].selectedPageValue])
                tempNoteView= readOnlyNoteDisplay(notebooks[noteStateObj.selectedNotebookValue].PageList[notebooks[noteStateObj.selectedNotebookValue].selectedPageValue].texts[notebooks[noteStateObj.selectedNotebookValue].selectedNoteValue]);
                tempNoteTitle = notebooks[noteStateObj.selectedNotebookValue].PageList[notebooks[noteStateObj.selectedNotebookValue].selectedPageValue].texts[notebooks[noteStateObj.selectedNotebookValue].selectedNoteValue].title;
                hasNotes = true;
            };
            let obj ={
                Notebooks: notebooks,
                pageView: tempPageView,
                noteView:tempNoteView,
                noteTitle:tempNoteTitle,
                isNewNote: !hasNotes,
                isNewPage: false,
            };
            this.setState({
                pageNumber: 0,
                notebookNumber: 0,
                noteNumber:0,
                copyToSet:false,
                moveToSet:false,

            });
    
            this.props.noteComponentSave(obj);
            this.menuToggle()
    }
    selectToNotebook(event){        
        let target = event.target;
        let value = Number(target.value);
        this.setState({
            notebookNumber: value,
        });
    }
    selectToPage(event){
        let target = event.target;
        let value = target.value;
        this.setState({
            pageNumber:value,
        })
    }
    noteNumberOnChange(event){
        let target = event.target;
        let value = target.value;
        this.setState({
            noteNumber:value,
        })
    }


    handleChangeNoteEdit(event){
        var noteStateObj = this.props.stateObj;
        let target = event.target;
        let value = target.value;
        let tempNotebooks = noteStateObj.Notebooks;
        let tempSelectedNotebook = noteStateObj.Notebooks[noteStateObj.selectedNotebookValue];
        tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].texts[tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].selectedNoteValue].text = value;
        tempNotebooks[noteStateObj.selectedNotebookValue] = tempSelectedNotebook;
        let obj ={
            Notebooks: tempNotebooks,
            noteTitle: tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].texts[tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].selectedNoteValue].title,
        };

        this.props.noteComponentHandleChange(obj);
    }
handleNoteTitleChange(event) {
        //This handles the name change for a note
        var noteStateObj = this.props.stateObj;
        let target = event.target;
        let value = target.value;
        let tempNotebooks = noteStateObj.Notebooks;
        let tempSelectedNotebook = noteStateObj.Notebooks[noteStateObj.selectedNotebookValue];
        tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].texts[tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].selectedNoteValue].title = value;
        tempNotebooks[noteStateObj.selectedNotebookValue] = tempSelectedNotebook;
        let obj ={
            Notebooks: tempNotebooks,
            noteTitle: value,
        };
        this.props.noteComponentHandleChange(obj);
    }

    removeNote(e){
        var noteStateObj = this.props.stateObj;
        let target = e.target;
        let index = target.id;
        let notebookIndex = noteStateObj.selectedNotebookValue;
        let tempNotebooks = noteStateObj.Notebooks;
        let tempTexts = tempNotebooks[notebookIndex].PageList[noteStateObj.Notebooks[notebookIndex].selectedPageValue].texts;
        let tempDeletedTexts = tempNotebooks[notebookIndex].PageList[noteStateObj.Notebooks[notebookIndex].selectedPageValue].deletedTexts;
        tempDeletedTexts.push(tempTexts[index]);
        tempTexts.splice(index,1);
        let tempPageView = '';
        let tempNoteView = '';
        let tempNoteTitle = '';
        let hasNotes = false;   
        if(tempTexts.length > 0){    
            for (let x = 0; x < tempTexts.length; x++) {
                tempTexts[x].id = Number(x);
            }            
            let newIndex = index < tempTexts.length ? index : index - 1;
            tempNotebooks[notebookIndex].PageList[noteStateObj.Notebooks[notebookIndex].selectedPageValue].texts = tempTexts;
            tempNotebooks[notebookIndex].selectedNoteValue = newIndex;
            tempNotebooks[notebookIndex].PageList[noteStateObj.Notebooks[notebookIndex].selectedPageValue].deletedTexts = tempDeletedTexts;
            tempPageView = readOnlyPageDisplay(tempNotebooks[notebookIndex].PageList[noteStateObj.Notebooks[notebookIndex].selectedPageValue])
            tempNoteView= readOnlyNoteDisplay(tempNotebooks[notebookIndex].PageList[noteStateObj.Notebooks[notebookIndex].selectedPageValue].texts[tempNotebooks[notebookIndex].selectedNoteValue]);
            tempNoteTitle = tempNotebooks[notebookIndex].PageList[tempNotebooks[notebookIndex].selectedPageValue].texts[tempNotebooks[notebookIndex].selectedNoteValue].title;
            hasNotes = true;

        }else{
            tempNotebooks[notebookIndex].PageList[noteStateObj.Notebooks[notebookIndex].selectedPageValue].texts = [];
            tempNotebooks[notebookIndex].PageList[noteStateObj.Notebooks[notebookIndex].selectedPageValue].deletedTexts = tempDeletedTexts;

        }

        let obj ={
            Notebooks: tempNotebooks,
            pageView: tempPageView,
            noteView:tempNoteView,
            noteTitle:tempNoteTitle,
            isNewNote: !hasNotes,
        };

        this.props.noteComponentSave(obj);
        this.menuToggle()



    }
 saveNote(e){ 
    var noteStateObj = this.props.stateObj;       
        let tempSelectedNotebook = noteStateObj.Notebooks[noteStateObj.selectedNotebookValue];
        
        let tempPageDisplay = readOnlyPageDisplay(tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue]);
        let tempNoteDisplay = readOnlyNoteDisplay(tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].texts[tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].selectedNoteValue]);
        let obj ={
            pageView: tempPageDisplay,
            noteView:tempNoteDisplay
        }
        this.setState({
            noteEdit: false,
        });
        this.props.updateNoteViews(obj);
    }
    editNote(e){
            this.setState({
                noteEdit: true,
            });
        }
  selectNote(e) {
        var noteStateObj = this.props.stateObj;  
        let targe = e.target;
        let value = targe.value;
        let id = Number(value);
        let tempNotebooks = noteStateObj.Notebooks;
        let tempSelectedNotebook = tempNotebooks[noteStateObj.selectedNotebookValue];
        let temp = tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue];

        tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].selectedNoteValue = id;
        tempNotebooks[noteStateObj.selectedNotebookValue] = tempSelectedNotebook;
        console.log(tempSelectedNotebook);
        let tempdisplay = readOnlyNoteDisplay(temp.texts[id])
        let obj ={
            Notebooks: tempNotebooks,
            noteView: tempdisplay,
            pageView: noteStateObj.pageView,
            noteTitle: temp.texts[id].title,
            isNewNote: false,
        };

        this.props.noteComponentSave(obj);
    }
    menuToggle(){
        document.getElementById("noteDrop").classList.toggle("show");
    }

    render() {
        var noteStateObj = this.props.stateObj;
        let selectedNotebook = noteStateObj.Notebooks[noteStateObj.selectedNotebookValue];
        let noteSelection = [];
        let pageIndex = selectedNotebook.selectedPageValue ;
        let pagelist = selectedNotebook.PageList[pageIndex];
        if (pagelist != undefined && pagelist.texts != undefined) {
            noteSelection = pagelist.texts.map((e) =>
                <option key={e.id} value={e.id}>
                     {e.title} ({e.date})
            </option>
            );
        }
        var code;
        //console.log(noteStateObj);
        let pageList = selectedNotebook.PageList;
        let selectedNoteValue = noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].PageList.length > 0 && noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].PageList[noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectedPageValue].selectedNoteValue != undefined  ? noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].PageList[noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectedPageValue].selectedNoteValue: 0;
        if(noteStateObj.isNewNote){
            if(noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].PageList.length > 0){
                code = (
                    <div>
                        <label  className="label-header">Note:</label>                        
                            <button onClick={this.addNote} id={pageList.length > 0 ? pageList[pageIndex].pageNumber : 0}>Add Note</button>
                    </div>
                    
            )

            }else{
                code = (
                    <div>
                        <label  className="label-header">Note:</label>                        
                    </div>
                )
            }
        }else if(this.state.noteEdit){
            code = (
                <div>
                   <label className="label-header">Note:</label>
                   <div className="inner" id="notes">
                       <select id="selectNote" onChange={this.selectNote} value={selectedNoteValue}>
                           {noteSelection}
                       </select>                                        
                       <input type="text" id="title" name="title" value={noteStateObj.noteTitle} onChange={this.handleNoteTitleChange} />
                        <button onClick={this.saveNote} id="noteSave">Save</button>
                        <button className="dropbtn" onClick={this.menuToggle}>
                            <i class="fa fa-bars fa-lg"></i>
                        </button>
                            <div className="dropdown-content" id="noteDrop">
                                <button onClick={this.addNote} id={pageList.length > 0 ? pageList[pageIndex].pageNumber : 0}>Add Note</button>
                                <button onClick={this.removeNote} value={selectedNoteValue} id={selectedNoteValue}>Remove Note</button>
                            </div>
                           <div className="readOnlyDisplay">
                                <textarea id="editNoteTextArea" value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].PageList[pageIndex].texts[selectedNoteValue].text} rows="10" cols="25" onChange={this.handleChangeNoteEdit} />                    
                           </div>
                   </div>
                </div>
           )
        }else if(this.state.copyToSet){
            let notebookSelect = noteStateObj.Notebooks.map((e) =>
                 <option key={e.ID} value={e.ID}>
                     #{e.ID + 1} - {e.title}
                 </option>
             );
             let pageSelect = noteStateObj.Notebooks[this.state.notebookNumber].PageList.map((e) =>
                <option key={e.pageNumber} value={e.pageNumber}>
                    #{e.pageNumber + 1} : {e.name}
                </option>
              ) ;
              let noteSelect = undefined
              if(noteStateObj.Notebooks[this.state.notebookNumber].PageList[this.state.pageNumber].texts !== undefined){

              noteSelect = noteStateObj.Notebooks[this.state.notebookNumber].PageList[this.state.pageNumber].texts.map((e)=>
              <option key={e.id} value={e.id}>
                  {e.id + 1}
              </option>

            )};
            code = (
                <div>
                   <label className="label-header">Note:</label>
                   <div className="inner" id="notes">
                       <select id="selectNote" onChange={this.selectNote} value={selectedNoteValue}>
                           {noteSelection}
                       </select>                                        
                       <input type="text" id="title" name="title" value={noteStateObj.noteTitle} onChange={this.handleNoteTitleChange} />
                        <button onClick={this.editNote} id="noteEdit">Edit</button>
                        <button className="dropbtn" onClick={this.menuToggle}>
                            <i class="fa fa-bars fa-lg"></i>
                        </button>
                            <div className="dropdown-content" id="noteDrop">
                                <button onClick={this.addNote} id={pageList.length > 0 ? pageList[pageIndex].pageNumber : 0}>Add Note</button>
                                <button onClick={this.removeNote} value={selectedNoteValue} id={selectedNoteValue}>Remove Note</button>
                                <button onClick={this.copyToSet}>Copy To</button>
                                <button onClick={this.moveToSet}>Move To</button> 
                            </div>                  
                        <div>
                            <label>Notebooks:</label>
                            <select id="noteNotebookSelect" value={this.state.notebookNumber} onChange={this.selectToNotebook}>
                                {notebookSelect}
                            </select>
                            <label>Pages:</label>
                            <select id="notePageSelect" value={this.state.pageNumber} onChange={this.selectToPage}>
                                {pageSelect}
                            </select>
                            <label>Note # </label>
                            <select id='pageNumber' value={this.state.noteNumber} onChange={this.noteNumberOnChange}>
                                {noteSelect}
                            </select>
                            <button onClick={this.noteCopyTo}>Copy</button>
                        </div>
                           <div className="readOnlyDisplay">
                                <textarea id="editNoteTextArea" value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].PageList[pageIndex].texts[selectedNoteValue].text} rows="10" cols="25" readOnly="true" />                    
                           </div>
                   </div>
                </div>
           )
        }else if(this.state.moveToSet){
                let notebookSelect = noteStateObj.Notebooks.map((e) =>
                    <option key={e.ID} value={e.ID}>
                        #{e.ID + 1} - {e.title}
                    </option>
                );
                let pageSelect = noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].PageList.map((e) =>
                    <option key={e.pageNumber} value={e.pageNumber}>
                        #{e.pageNumber + 1} : {e.name}
                    </option>
                );
                let noteSelect = undefined;
                if(noteStateObj.Notebooks[this.state.notebookNumber].PageList[this.state.pageNumber].texts !== undefined){
  
                 noteSelect = noteStateObj.Notebooks[this.state.notebookNumber].PageList[this.state.pageNumber].texts.map((e)=>
                <option key={e.id} value={e.id}>
                    {e.id + 1}
                </option>
  
              )};
            code = (
                <div>
                   <label className="label-header">Note:</label>
                   <div className="inner" id="notes">
                       <select id="selectNote" onChange={this.selectNote} value={this.selectNote} value={selectedNoteValue}>
                           {noteSelection}
                       </select>                                        
                       <input type="text" id="title" name="title" value={noteStateObj.noteTitle} onChange={this.handleNoteTitleChange} />
                        <button onClick={this.editNote} id="noteEdit">Edit</button>
                        <button className="dropbtn" onClick={this.menuToggle}>
                            <i class="fa fa-bars fa-lg"></i>
                        </button>
                            <div className="dropdown-content" id="noteDrop">
                                <button onClick={this.addNote} id={pageList.length > 0 ? pageList[pageIndex].pageNumber : 0}>Add Note</button>
                                <button onClick={this.removeNote} value={selectedNoteValue} id={selectedNoteValue}>Remove Note</button>
                                <button onClick={this.copyToSet}>Copy To</button>
                                <button onClick={this.moveToSet}>Move To</button> 
                            </div>                    
                        <div>
                            <label>Notebooks:</label>
                            <select id="noteNotebookSelect" value={this.state.notebookNumber} onChange={this.selectToNotebook}>
                                {notebookSelect}
                            </select>
                            <label>Pages:</label>
                            <select id="notePageSelect" value={this.state.pageNumber} onChange={this.selectToPage}>
                                {pageSelect}
                            </select>
                            <label>Note # </label>
                            <select id='pageNumber' value={this.state.noteNumber} onChange={this.noteNumberOnChange}>
                                {noteSelect}
                            </select>
                            <button onClick={this.noteMoveTo}>Move</button>
                        </div>
                           <div className="readOnlyDisplay">
                                <textarea id="editNoteTextArea" value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].PageList[pageIndex].texts[selectedNoteValue].text} rows="10" cols="25" readOnly="true" />                    
                           </div>
                   </div>
                </div>
           )
        }else {
            code = (
                <div>
                   <label className="label-header">Note:</label>
                   <div className="inner" id="notes">
                       <select id="selectNote" onChange={this.selectNote} value={selectedNoteValue}>
                           {noteSelection}
                       </select>                                        
                       <input type="text" id="title" name="title" value={noteStateObj.noteTitle} onChange={this.handleNoteTitleChange} />
                        <button onClick={this.editNote} id="noteEdit">Edit</button>
                        <button className="dropbtn" onClick={this.menuToggle}>
                            <i class="fa fa-bars fa-lg"></i>
                        </button>
                            <div className="dropdown-content" id="noteDrop">
                                <button onClick={this.addNote} id={pageList.length > 0 ? pageList[pageIndex].pageNumber : 0}>Add Note</button>
                                <button onClick={this.removeNote} value={selectedNoteValue} id={selectedNoteValue}>Remove Note</button>
                                <button onClick={this.copyToSet}>Copy To</button>
                                <button onClick={this.moveToSet}>Move To</button> 
                            </div>
                           <div className="readOnlyDisplay">
                                <textarea id="editNoteTextArea" value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].PageList[pageIndex].texts[selectedNoteValue].text} rows="10" cols="25" readOnly="true" />                    
                           </div>
                   </div>
                </div>
           )
        }        
        return (
            <div>
                     {code}
            </div>
        );
    }
}
