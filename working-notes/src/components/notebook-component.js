import React, { Component } from 'react';
import './css/awesome-hub.css';
import { readOnlyPageDisplay,readOnlyNoteDisplay } from './shared/util';
import { clone, parenthesizedExpression } from '@babel/types';

export class NotebookComponent extends Component {
    constructor(props) {
        super(props);

        this.addNotebook = this.addNotebook.bind(this);
        this.deleteNotebook = this.deleteNotebook.bind(this);
        this.downloadNoteFile = this.downloadNoteFile.bind(this);
        this.selectNotebook = this.selectNotebook.bind(this);

        this.handleChange = this.handleChange.bind(this);

        this.menuToggle = this.menuToggle.bind(this);
    }
    addNotebook() {
        let notebookStateObj = this.props.notebookStateObj;
        let d = new Date();
        let tempList = notebookStateObj.Notebooks.length > 0 ? notebookStateObj.Notebooks : [];
        let tempID = notebookStateObj.Notebooks.length > 0 ? notebookStateObj.Notebooks.length : 0;
        let singleObj = new Object({
            ID: tempID,
            title: '<New Notebook>',
            selectedPage: {},
            PageList: [],
            DeletedPageList:[],
            selectedDisplayText: '',
            time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
            date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
        });
        tempList.push(singleObj);
        let tempDeletedNotebooks = notebookStateObj.DeletedNotebooks;
        let obj ={
            Notebooks: tempList,
            DeletedNotebooks:tempDeletedNotebooks,
            selectedNotebookValue: tempID,
            isNewPage: true,
            isNewNote: true,
            noteView: '',
            pageView: '',
            noteTitle:'',
            freshNotebook: true,
        };
        this.props.NotebookComponentSave(obj)
        this.menuToggle()

    }
 deleteNotebook(e) {
        let notebookStateObj = this.props.notebookStateObj;
        let index = notebookStateObj.selectedNotebookValue;
        let tempNotebookList = notebookStateObj.Notebooks;
        let tempDNotebookList = notebookStateObj.DeletedNotebooks;
        let deletedNotebook = notebookStateObj.Notebooks[index];
        tempDNotebookList.push(deletedNotebook);
        tempNotebookList.splice(index, 1);
        let hasPages = false;
        let tempPageView = '';
        let hasNotes = false;
        let tempNoteView = '';
        let noteTitleCheck = '';
        if(tempNotebookList.length > 0){
            for (let x = 0; x < tempNotebookList.length; x++) {
                tempNotebookList[x].ID = x;
            }
            let newIndex = index < tempNotebookList.length ? index : index - 1;
            if(tempNotebookList[newIndex].PageList != undefined && tempNotebookList[newIndex].PageList.length > 0){
                hasPages = true;
                if(tempNotebookList[newIndex].PageList[tempNotebookList[newIndex].selectedPageValue].texts.length > 0){
                    hasNotes = true;
                    noteTitleCheck = tempNotebookList[newIndex].PageList[tempNotebookList[newIndex].selectedPageValue].texts[tempNotebookList[newIndex].PageList[tempNotebookList[newIndex].selectedPageValue].selectedNoteValue].title;
                    tempPageView = readOnlyPageDisplay(tempNotebookList[newIndex].PageList[tempNotebookList[newIndex].selectedPageValue]);
                    tempNoteView = readOnlyNoteDisplay(tempNotebookList[newIndex].PageList[tempNotebookList[newIndex].selectedPageValue].texts[tempNotebookList[newIndex].PageList[tempNotebookList[newIndex].selectedPageValue].selectedNoteValue]);
                }          
           }
           let obj ={
                Notebooks: tempNotebookList,
                DeletedNotebooks: tempDNotebookList,
                selectedNotebookValue: newIndex,
                isNewPage: !hasPages,
                isNewNote: !hasNotes,
                noteView: tempNoteView,
                pageView: tempPageView,
                noteTitle:noteTitleCheck,
                freshNotebook: true,
            };
            this.props.NotebookComponentSave(obj);
            this.menuToggle()
            
        }



    }
downloadNoteFile = () => {
        let notebookStateObj = this.props.notebookStateObj;
        const x = document.createElement("a");
        let tempObject = {
            Notebooks: notebookStateObj.Notebooks,
            selectedNotebookValue: notebookStateObj.selectedNotebookValue,
            DeletedNotebooks: notebookStateObj.DeletedNotebooks,

        }
        let temp = JSON.stringify(tempObject);
        const file = new Blob([temp], { type: 'application/json' });
        x.href = URL.createObjectURL(file);
        x.download = "MyAwesomeNote.json";
        document.body.appendChild(x); // Required for this to work in FireFox
        x.click();
        this.menuToggle()
    }
selectNotebook(event) {
        let notebookStateObj = this.props.notebookStateObj;
        let target = event.target;
        let value = target.value;
        let id = Number(value);
        let selectedTempNotebook = notebookStateObj.Notebooks[id];
        let hasPages = false;
        let tempPageView = '';
        let hasNotes = false;
        let tempNoteView = '';
        let noteTitleCheck = '';
        if(selectedTempNotebook.PageList.length > 0){
             hasPages = true;
             let tempIndex = selectedTempNotebook.selectedPageValue != undefined ? selectedTempNotebook.selectedPageValue : 0;
             let pageIndex = selectedTempNotebook.PageList.length >= tempIndex ? tempIndex : tempIndex - 1 ;
             if(selectedTempNotebook.PageList[pageIndex].texts !== undefined && selectedTempNotebook.PageList[pageIndex].texts.length > 0){
                 hasNotes = true;
                 tempPageView = readOnlyPageDisplay(selectedTempNotebook.PageList[pageIndex]);
                 noteTitleCheck = selectedTempNotebook.PageList[pageIndex].texts[0].title;
                 tempNoteView = readOnlyNoteDisplay(selectedTempNotebook.PageList[pageIndex].texts[0]);
             }          
        }
        let tempNotebooks = notebookStateObj.Notebooks;
        let tempDeletedNotebooks = notebookStateObj.DeletedNotebooks;
        let obj ={
            Notebooks: tempNotebooks,
            DeletedNotebooks:tempDeletedNotebooks,
            selectedNotebookValue: id,
            isNewPage: !hasPages,
            isNewNote: !hasNotes,
            pageView:tempPageView,
            noteView: tempNoteView,
            noteTitle:noteTitleCheck,
            freshNotebook: true,
        };
        this.props.NotebookComponentSave(obj);
    }
 handleChange(event) {
        //This will handle any state that is not an object or part of an array I pass in the name of the state value and assign that and then assign the value 
        //this is helpful because then I only need one handleChange for at least these simple changes.
        let notebookStateObj = this.props.notebookStateObj;
        let target = event.target;
        let value = target.value;
        let name = target.name;
        let tempNotebooks = notebookStateObj.Notebooks;
        let tempSelectedNotebook = notebookStateObj.Notebooks[notebookStateObj.selectedNotebookValue];
        tempSelectedNotebook[name] = value;
        tempNotebooks[notebookStateObj.selectedNotebookValue] = tempSelectedNotebook;

        this.props.NotebookComponentHandleChange(tempNotebooks);
    }
    menuToggle(){
        document.getElementById("notebookDrop").classList.toggle("show");
    }


    render() {
        let notebookStateObj = this.props.notebookStateObj;
        let notebookSelect = [];
        if (notebookStateObj.Notebooks != undefined && notebookStateObj.Notebooks.length > 0) {
            notebookSelect = notebookStateObj.Notebooks.map((e) =>
                <option key={e.ID} value={e.ID}>
                    {e.title} ({e.date}) - {e.PageList.length}
                </option>
            );
        }
        return (
                <div className="TitleSection">
                <label className="label-header" htmlFor="title">Notebook:</label>
                <div className="inner">
                    <select id="PageListDD" onChange={this.selectNotebook} value={notebookStateObj.selectedNotebookValue}>
                        {notebookSelect}
                    </select>
                    <input type="text" id="title" name="title" value={notebookStateObj.Notebooks[notebookStateObj.selectedNotebookValue].title} onChange={this.handleChange} />
                    <button className="dropbtn" onClick={this.menuToggle}>
                        <i class="fa fa-bars fa-lg"></i>
                    </button>
                            <div className="dropdown-content" id="notebookDrop">
                                <button onClick={this.deleteNotebook}>{'Remove Notebook'}</button>
                                <button onClick={this.addNotebook}>{'Add Notebook'}</button>
                                <button onClick={this.downloadNoteFile}>Export</button>
                            </div>

                </div>
                </div>
        );
    }
}

