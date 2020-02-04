import React, { Component } from 'react';
import './css/awesome-hub.css';
import { readOnlyPageDisplay,readOnlyNoteDisplay } from './shared/util';
import { clone, parenthesizedExpression } from '@babel/types';

import cloneDeep from 'lodash/cloneDeep';

export class AwesomeHubComponent extends Component {

    constructor(props) {
        super(props);
        this.stateChange = props.stateChange || new Function();

        this.state = {
            Notebooks: [], //Main note list
            DeletedNotebooks: [],
            selected: false,
            upload: '',
            selectedNotebook: {},
            selectedNotebookValue: 0,
            active: 'T',
            isUploaded: false,
            pageView: '',
            noteView: '',
            noteTitle: '',
            isNewPage: true,
            isNewNote: true,
            noteEdit:false,
            freshNotebook: false,
            pageCopyToActive: false,
            pageMoveToActive: false,
        };


        this.myRefresh = this.myRefresh.bind(this);
        this.save = this.save.bind(this);

        //New break up section
        this.pageComponentHandleChange = this.pageComponentHandleChange.bind(this);
        this.pageComponentSave = this.pageComponentSave.bind(this);
        
        this.NotebookComponentHandleChange = this.NotebookComponentHandleChange.bind(this);
        this.NotebookComponentSave = this.NotebookComponentSave.bind(this);

        
        this.atbComponentHandleChange = this.atbComponentHandleChange.bind(this);
        this.atbComponentSave = this.atbComponentSave.bind(this);
        
        this.noteComponentHandleChange = this.noteComponentHandleChange.bind(this);
        this.noteComponentSave = this.noteComponentSave.bind(this);
        this.updateNoteViews = this.updateNoteViews.bind(this);

        this.landingUpload = this.landingUpload.bind(this);
        this.landingFreshNotebook = this.landingFreshNotebook.bind(this)
        
    }
    pageComponentHandleChange(e){
        this.setState({
            Notebooks: e
        });
        
     
            this.save();
    }
    pageComponentSave(e){
        this.setState({
            Notebooks: e.Notebooks,
            pageView: e.pageView,
            noteView: e.noteView,
            noteTitle:e.noteTitle,
            isNewNote: e.isNewNote,
            isNewPage: e.isNewPage,
            pageCopyToActive: e.pageCopyToActive,
            pageMoveToActive: e.pageMoveToActive
        });
        this.save();
    }
    NotebookComponentHandleChange(e){
        this.setState({
            Notebooks: e
        });
            this.save();
    }
    NotebookComponentSave(e){
        this.setState({
            Notebooks: e.Notebooks,
            DeletedNotebooks:e.DeletedNotebooks,
            selectedNotebook:e.selectedNotebook,
            selectedNotebookValue: e.selectedNotebookValue,
            pageView: e.pageView,
            noteView: e.noteView,
            noteTitle:e.noteTitle,
            isNewNote: e.isNewNote,
            isNewPage: e.isNewPage,
            freshNotebook: e.freshNotebook,
        });
        this.save();
    }
    atbComponentHandleChange(e){
        this.setState({
            Notebooks: e
        });
            this.save();
    }
    atbComponentSave(e){
        this.setState({
            Notebooks:  e.Notebooks,
            pageView:   e.pageView,
            noteView:   e.noteView,
            noteTitle:  e.noteTitle,
            isNewNote:  e.isNewNote,
        });
        this.save();
        this.myRefresh();
    }
    noteComponentHandleChange(e){
        this.setState({
            Notebooks: e.Notebooks,
            noteTitle: e.noteTitle,
        });
            this.save();
    }
    noteComponentSave(e){
        this.setState({
            Notebooks:  e.Notebooks,
            pageView:   e.pageView,
            noteView:   e.noteView,
            noteTitle:  e.noteTitle,
            isNewNote:  e.isNewNote,
        });
        this.save();
    }
    updateNoteViews(e){
        this.setState({
            pageView:   e.pageView,
            noteView:   e.noteView,
        });
        this.save();
    }

    landingUpload(e){
        this.setState({
            Notebooks:              e.Notebooks,
            DeletedNotebooks:       e.DeletedNotebooks,
            selectedNotebookValue:  e.selectedNotebookValue,
            isUploaded:             e.isUploaded,
            isNewPage:              e.isNewPage,
            isNewNote:              e.isNewNote,
            noteTitle:              e.noteTitle,
            pageView:               e.pageView ,
            noteView:               e.noteView,

        });
        this.save();
    }
    landingFreshNotebook(){
        this.setState({
            freshNotebook:true,
        });

    }
    async save() {
        let selectedListItem = this.state.Notebooks[this.state.selectedNotebookValue];
        if (selectedListItem) {
            let xlist = this.state.Notebooks;
            xlist.splice(selectedListItem.ID, 1, {
                ID: selectedListItem.ID,
                pageName: selectedListItem.pageName,
                mainText: selectedListItem.mainText,
                theNote: selectedListItem.theNote,
                title: selectedListItem.title,
                selectedPage: selectedListItem.selectedPage,
                PageList: selectedListItem.PageList,
                DeletedPageList:selectedListItem.DeletedPageList,
                selectedPageValue: selectedListItem.selectedPageValue,
                selectedNote: selectedListItem.selectedNote,
                selectNoteValue: selectedListItem.selectNoteValue,
                selectedNotebookValue: this.state.selectedNotebookValue,
                date: selectedListItem.date,
                time:selectedListItem.time
            });
            await this.setState({
                Notebooks: xlist,
            });
        }

    }
    myRefresh() {
        this.setState({
            mainText: ''
        });
    }

    render() {
        var code;
        if ((!this.state.isUploaded && !this.state.freshNotebook)) {
            code = (
                <div className="hub">
                    <LandingPage
                        landingUpload = {this.landingUpload}
                        landingFreshNotebook = {this.landingFreshNotebook}
                        NotebookComponentSave= {this.NotebookComponentSave} />
                </div>
            );
        } else {
            var stateObj = this.state;
            code = (
                <div className="notebook-wrapper basic">
                    <div className="notebook">
                                    <NotebookComponent
                                        notebookStateObj = {stateObj}
                                        NotebookComponentHandleChange={this.NotebookComponentHandleChange}
                                        NotebookComponentSave= {this.NotebookComponentSave} />
                        <div className="page-wrapper">
                            <div className="page-col-one-wrapper ">
                                    <PageComponent 
                                        stateObj = {stateObj}
                                        pageComponentHandleChange={this.pageComponentHandleChange}
                                        pageComponentSave= {this.pageComponentSave}
                                    />
                                   <AwesomeTextBoxComponent 
                                        stateObj = {stateObj}
                                        atbComponentHandleChange = {this.atbComponentHandleChange}
                                        atbComponentSave = {this.atbComponentSave}
                                   />
                                   <NoteComponent
                                        stateObj = {stateObj}
                                        noteComponentHandleChange = {this.noteComponentHandleChange}
                                        noteComponentSave = {this.noteComponentSave}
                                        updateNoteViews = {this.updateNoteViews}
                                    />
                            </div>
                            <div className="page-col-two-wrapper">
                                    <PageViewComponent
                                        stateObj = {stateObj}
                                    />
                            </div>
                        </div>
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

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.upload = this.upload.bind(this);
        this.landingNotebookAdd = this.landingNotebookAdd.bind(this);
    }
    landingNotebookAdd() {
        //console.log("1");
        let d = new Date();
        let tempList = [];
        let tempID = 0;
        let singleObj = new Object({
            ID: tempID,
            pageName: '',
            mainText: '',
            theNote: '',
            title: '<New Notebook>',
            selectedPage: {},
            PageList: [],
            DeletedPageList:[],
            selectedDisplayText: '',
            time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
            date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
        });
        tempList.push(singleObj);
        let obj ={
            Notebooks: tempList,
            DeletedNotebooks: [],
            selectedNotebook: singleObj,
            selectedNotebookValue: tempID,
            isNewPage: true,
            isNewNote: true,
            noteView: '',
            pageView: '',
            noteTitle:'',
            freshNotebook: true,
        };
    this.props.NotebookComponentSave(obj)

    }

    readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            }
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    async upload() {
        try {
            let doc = document.getElementById('upload');
            var file = doc.files.item(0);
            let contentBuffer = await this.readFileAsync(file);
            var temp;
                temp = JSON.parse(contentBuffer);
            let tempNotebooks = temp.Notebooks;
            let tempDeletedNotebooks = temp.DeletedNotebooks;
           let hasPages = false;
           let tempPageView = '';
           let hasNotes = false;
           let tempNoteView = '';
           let noteTitleCheck = '';
           if(tempNotebooks[0].PageList.length > 0){
                hasPages = true;
                tempPageView = readOnlyPageDisplay(tempNotebooks[0].selectedPage);
                if(tempNotebooks[0].PageList[0].texts.length > 0){
                    hasNotes = true;
                    noteTitleCheck = tempNotebooks[0].PageList[0].texts[0].title;
                    tempNoteView = readOnlyNoteDisplay(tempNotebooks[0].selectedPage.texts[0]);
                }          
           }
           
            let obj = {
                Notebooks: tempNotebooks,
                DeletedNotebooks: tempDeletedNotebooks,
                selectedNotebookValue: 0,
                isUploaded: true,
                isNewPage: !hasPages,
                isNewNote: !hasNotes,
                noteTitle: noteTitleCheck,
                pageView: tempPageView,
                noteView: tempNoteView,
            };
            console.log(obj);
            this.props.landingUpload(obj);
        } catch (err) {
            console.log('catch');
            console.log(err);

        }
    }

    render() {
        return (
            <div className="wrapper">
                <div className="new">
                    <button onClick={this.landingNotebookAdd} >New Notebook</button>
                </div>
                <div className="upload">
                    <input id="upload" type="file" />
                    <button onClick={this.upload}>Upload</button>
                </div>
            </div>

        );
    }
}

class NotebookComponent extends Component {
    constructor(props) {
        super(props);

        this.addNotebook = this.addNotebook.bind(this);
        this.deleteNotebook = this.deleteNotebook.bind(this);
        this.downloadNoteFile = this.downloadNoteFile.bind(this);
        this.selectNotebook = this.selectNotebook.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }
    addNotebook() {
        let notebookStateObj = this.props.notebookStateObj;
        let d = new Date();
        let tempList = notebookStateObj.Notebooks.length > 0 ? notebookStateObj.Notebooks : [];
        let tempID = notebookStateObj.Notebooks.length > 0 ? notebookStateObj.Notebooks.length : 0;
        let singleObj = new Object({
            ID: tempID,
            pageName: '',
            mainText: '',
            theNote: '',
            title: '<New Notebook>',
            selectedPage: {},
            PageList: [],
            DeletedPageList:[],
            selectedDisplayText: '',
            time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
            date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
            selectNoteValue: 0,
        });
        tempList.push(singleObj);
        let tempDeletedNotebooks = notebookStateObj.DeletedNotebooks;
        let obj ={
            Notebooks: tempList,
            DeletedNotebooks:tempDeletedNotebooks,
            selectedNotebook: singleObj,
            selectedNotebookValue: tempID,
            isNewPage: true,
            isNewNote: true,
            noteView: '',
            pageView: '',
            noteTitle:'',
            freshNotebook: true,
        };
        this.props.NotebookComponentSave(obj)

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
                if(tempNotebookList[newIndex].selectedPage.texts.length > 0){
                    hasNotes = true;
                    noteTitleCheck = tempNotebookList[newIndex].selectedNote.title;
                    tempPageView = readOnlyPageDisplay(tempNotebookList[newIndex].selectedPage);
                    tempNoteView = readOnlyNoteDisplay(tempNotebookList[newIndex].selectedNote);
                }          
           }
           let obj ={
                Notebooks: tempNotebookList,
                DeletedNotebooks: tempDNotebookList,
                selectedNotebook: tempNotebookList[newIndex],
                selectedNotebookValue: newIndex,
                isNewPage: !hasPages,
                isNewNote: !hasNotes,
                noteView: tempNoteView,
                pageView: tempPageView,
                noteTitle:noteTitleCheck,
                freshNotebook: true,
            };
            this.props.NotebookComponentSave(obj);
            
        }



    }
downloadNoteFile = () => {
        let notebookStateObj = this.props.notebookStateObj;
        const x = document.createElement("a");
        let tempObject = {
            Notebooks: notebookStateObj.Notebooks,
            DeletedNotebooks: notebookStateObj.DeletedNotebooks
        }
        let temp = JSON.stringify(tempObject);
        const file = new Blob([temp], { type: 'application/json' });
        x.href = URL.createObjectURL(file);
        x.download = "MyAwesomeNote.json";
        document.body.appendChild(x); // Required for this to work in FireFox
        x.click();
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
        console.log(selectedTempNotebook);
        console.log(selectedTempNotebook.selectedPageValue);
        console.log(selectedTempNotebook.PageList);
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
            selectedNotebook: selectedTempNotebook,
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

    render() {
        let notebookStateObj = this.props.notebookStateObj;
        let notebookSelect = [];
        if (notebookStateObj.Notebooks != undefined && notebookStateObj.Notebooks.length > 0) {
            notebookSelect = notebookStateObj.Notebooks.map((e) =>
                <option key={e.ID} value={e.ID}>
                    #{e.ID + 1} - {e.title}  ({e.date}) - {e.PageList.length}
                </option>
            );
        }
        return (
            <div className="OverviewWrapper">
                <div className="TitleSection">
                    <label htmlFor="title">Notebook:</label>
                    <select id="PageListDD" onChange={this.selectNotebook} value={notebookStateObj.selectedNotebookValue}>
                        {notebookSelect}
                    </select>
                    <input type="text" id="title" name="title" value={notebookStateObj.Notebooks[notebookStateObj.selectedNotebookValue].title} onChange={this.handleChange} />
                </div>
                <div className="notebooklist">
                    <button onClick={this.deleteNotebook}>{'Remove Notebook'}</button>
                    <button onClick={this.addNotebook}>{'Add Notebook'}</button>
                    <button onClick={this.downloadNoteFile}>Export</button>

                </div>
            </div>
        );
    }
}
class PageComponent extends Component {
    constructor(props) {
        super(props);
        this.stateChange = props.stateChange || new Function();

        this.state = {
            pageNumber: 1,
            notebookNumber: 0,
            copyToSet: false,
            moveToSet: false,
        }

        this.handlePageNameChange = this.handlePageNameChange.bind(this);
        this.selectPage = this.selectPage.bind(this);
        this.addPage = this.addPage.bind(this);
        this.removePage = this.removePage.bind(this);

        this.copyToSet = this.copyToSet.bind(this);
        this.moveToSet = this.moveToSet.bind(this);

        this.pageCopyTo = this.pageCopyTo.bind(this);
        this.pageMoveTo = this.pageMoveTo.bind(this);


        this.selectToNotebook = this.selectToNotebook.bind(this);
        this.pageNumberOnChange = this.pageNumberOnChange.bind(this);
    }
    moveToSet(){
        let value = !this.state.moveToSet;
        this.setState({
            moveToSet:value,
            copyToSet:false,
        });
    }
    pageMoveTo(){
        let pageStateObj = this.props.stateObj;
        let copyToNotebook = this.state.notebookNumber;
        let copyPageTo = Number(this.state.pageNumber);
        let notebooks = pageStateObj.Notebooks;
        let copyPageValue = cloneDeep(notebooks[pageStateObj.selectedNotebookValue].PageList[notebooks[pageStateObj.selectedNotebookValue].selectedPageValue]) ;
        let goingToPagelist = cloneDeep(notebooks[copyToNotebook].PageList);

        if(copyToNotebook === pageStateObj.selectedNotebookValue){
            goingToPagelist.splice(notebooks[pageStateObj.selectedNotebookValue].selectedPageValue, 1);
        }

        let pageSizeCheck = goingToPagelist.length;       
        let temp = []
        if(pageSizeCheck >= copyPageTo){ 
            if(pageSizeCheck === copyPageTo){
                temp.push(copyPageValue);
                 goingToPagelist.forEach((a)=>{
                    temp.push(a);
                });
            }else{         
                for(let x = 0; x < goingToPagelist.length; x++){
                    if(x === (copyPageTo - 1)){
                        temp.push(copyPageValue);
                        temp.push(goingToPagelist[x]);
                    }else{
                        temp.push(goingToPagelist[x]);
                    }
                }

            }

            }else{
                temp.push(copyPageValue);
            }
            console.log(temp);
            for (let x = 0; x < temp.length; x++) {
                temp[x].pageNumber = x;
            }
            console.log(temp);

            if(copyToNotebook !== pageStateObj.selectedNotebookValue){
                let leavingPagelist = cloneDeep(notebooks[pageStateObj.selectedNotebookValue].PageList);
                let deletedPage = cloneDeep(notebooks[pageStateObj.selectedNotebookValue].PageList[notebooks[pageStateObj.selectedNotebookValue].selectedPageValue]);
                let deleted = []
                deleted.push(deletedPage)
                leavingPagelist[notebooks[pageStateObj.selectedNotebookValue].selectedPageValue].deletedPage = deleted;
                leavingPagelist.splice(notebooks[pageStateObj.selectedNotebookValue].selectedPageValue, 1);
                
                for (let x = 0; x < leavingPagelist.length; x++) {
                    leavingPagelist[x].pageNumber = x;
                }
                notebooks[pageStateObj.selectedNotebookValue].PageList = leavingPagelist;


            notebooks[copyToNotebook].PageList = temp;

            let tempPageView = '';
            let tempNoteView = '';
            let tempNoteTitle = '';
            let hasNotes = false;
            let hasPages = false;
            if(notebooks[pageStateObj.selectedNotebookValue].PageList.length > 0){
                hasPages = true;
                let tempIndex = notebooks[pageStateObj.selectedNotebookValue].selectedPageValue;
                let pageIndex = tempIndex !== 0 ? tempIndex - 1 : tempIndex
                if(notebooks[pageStateObj.selectedNotebookValue].PageList[pageIndex].texts.length > 0){
                    tempPageView = readOnlyPageDisplay(notebooks[pageStateObj.selectedNotebookValue].PageList[pageIndex])
                    tempNoteView= readOnlyNoteDisplay(notebooks[pageStateObj.selectedNotebookValue].PageList[pageIndex].texts[0]);
                    tempNoteTitle = notebooks[pageStateObj.selectedNotebookValue].PageList[pageIndex].texts[0].title;
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
                pageNumber: 1,
                notebookNumber: 0,
                copyToSet: false,
                moveToSet: false,

            });
    
            this.props.pageComponentSave(obj);

        }
    }



    copyToSet(){
        let value = !this.state.copyToSet;
        this.setState({
            moveToSet:false,
            copyToSet:value,
        });
    }
    pageCopyTo(){
        let pageStateObj = this.props.stateObj;
        let copyToNotebook = this.state.notebookNumber;
        let copyPageTo = Number(this.state.pageNumber);
        let notebooks = pageStateObj.Notebooks;
        let copyPageValue = cloneDeep(notebooks[pageStateObj.selectedNotebookValue].PageList[notebooks[pageStateObj.selectedNotebookValue].selectedPageValue]) ;
        let pagelist = cloneDeep(notebooks[copyToNotebook].PageList);
        let pageSizeCheck = pagelist.length;       
        let temp = []
        if(pageSizeCheck >= copyPageTo){ 
            if(pageSizeCheck === copyPageTo){
                temp = pagelist;
                temp.push(copyPageValue);
            }else{         
                for(let x = 0; x < pagelist.length; x++){
                    if(x === (copyPageTo - 1)){
                        temp.push(copyPageValue);
                        temp.push(pagelist[x]);
                    }else{
                        temp.push(pagelist[x]);
                    }
                }

            }
        }else{
            temp.push(copyPageValue);
        }
        for (let x = 0; x < temp.length; x++) {
            temp[x].pageNumber = x;
        }
        notebooks[copyToNotebook].PageList = temp;

        let tempPageView = '';
        let tempNoteView = '';
        let tempNoteTitle = '';
        let hasNotes = false;
        if(notebooks[pageStateObj.selectedNotebookValue].PageList[notebooks[pageStateObj.selectedNotebookValue].selectedPageValue].texts.length > 0){
            notebooks[copyToNotebook].selectNoteValue = notebooks[pageStateObj.selectedNotebookValue].selectNoteValue;
            tempPageView = readOnlyPageDisplay(notebooks[pageStateObj.selectedNotebookValue].PageList[notebooks[pageStateObj.selectedNotebookValue].selectedPageValue])
            tempNoteView= readOnlyNoteDisplay(notebooks[pageStateObj.selectedNotebookValue].PageList[notebooks[pageStateObj.selectedNotebookValue].selectedPageValue].texts[0]);
            tempNoteTitle = notebooks[pageStateObj.selectedNotebookValue].PageList[notebooks[pageStateObj.selectedNotebookValue].selectedPageValue].texts[0].title;
            hasNotes = true;
        };
        let obj ={
            Notebooks: notebooks,
            pageView: tempPageView,
            noteView:tempNoteView,
            noteTitle:tempNoteTitle,
            isNewNote: !hasNotes,
            isNewPage: false,
            pageCopyToActive:false,
            pageMoveToActive:false,
        };
        this.setState({
            pageNumber: 1,
            notebookNumber: 0,
            copyToSet: false,
            moveToSet: false,

        });

        this.props.pageComponentSave(obj);
    }



    selectToNotebook(event){        
        let target = event.target;
        let value = Number(target.value);
        this.setState({
            notebookNumber: value,
        });
    }
    pageNumberOnChange(event){
        let target = event.target;
        let value = target.value;
        this.setState({
            pageNumber:value,
        })
    }
    
    handlePageNameChange(event) {
        //This handles the name change for a page
        let stateObj = this.props.stateObj;
        let target = event.target;
        let value = target.value;
        let tempNotebooks = stateObj.Notebooks;
        let notebookIndex = stateObj.selectedNotebookValue;
        let tempSelectedNotebook = stateObj.Notebooks[notebookIndex];
        tempSelectedNotebook.selectedPage.name = value;
        tempNotebooks[notebookIndex] = tempSelectedNotebook;

        this.props.pageComponentHandleChange(tempNotebooks);
    }
    selectPage(event) {
        let pageStateObj = this.props.stateObj;
        let target = event.target;
        let value = Number(target.value);
        console.log(value);
        let id = value;
        let tempNotebook = pageStateObj.Notebooks;
        let tempSelectedNotebook = tempNotebook[pageStateObj.selectedNotebookValue];
        tempSelectedNotebook.selectedPage = tempSelectedNotebook.PageList[id];
        tempSelectedNotebook.selectedPageValue = id;
        tempNotebook[pageStateObj.selectedNotebookValue] = tempSelectedNotebook;
        let tempPageView = '';
        let tempNoteView = '';
        let tempNoteTitle = '';
        let hasNotes = false;
        console.log(tempSelectedNotebook);
        if(tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].texts.length > 0){
            tempPageView = readOnlyPageDisplay(tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue])
            tempNoteView= readOnlyNoteDisplay(tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].texts[0]);
            tempNoteTitle = tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].texts[0].title;
            hasNotes = true;
        };
        let obj ={
            Notebooks: tempNotebook,
            pageView: tempPageView,
            noteView:tempNoteView,
            noteTitle:tempNoteTitle,
            isNewNote: !hasNotes,
            isNewPage: false,
        };

        this.props.pageComponentSave(obj);
    }
    addPage() {
        let pageStateObj = this.props.stateObj;
        let d = new Date();
        let tempNotebooks = pageStateObj.Notebooks;
        let tempSelectedNotebook = tempNotebooks[pageStateObj.selectedNotebookValue];
        let tempObj =  {
                name: '<New Page>',
                pageNumber: tempSelectedNotebook.PageList.length > 0 ? tempSelectedNotebook.PageList.length: 0,
                texts: [],
                deletedTexts: [],
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
            }
            tempSelectedNotebook.pageName = '';
            tempSelectedNotebook.selectedPage = tempObj;
            tempSelectedNotebook.selectedPageValue =tempObj.pageNumber;
            tempSelectedNotebook.selectedNote = {};
            tempSelectedNotebook.PageList.push(tempObj);
            tempNotebooks[pageStateObj.selectedNotebookValue] = tempSelectedNotebook;
            var newPageCheck = pageStateObj.isNewPage;
            if(newPageCheck){newPageCheck = false};
            let obj ={
                Notebooks: tempNotebooks,
                noteTitle: '',
                noteView:'',
                pageView:'',
                isNewPage: newPageCheck,
                isNewNote: true,   
                pageCopyToActive:false,    
                pageMoveToActive:false,       
            };
            this.props.pageComponentSave(obj);
    }

    removePage() {
        let pageStateObj = this.props.stateObj;

        let index = pageStateObj.selectedNotebookValue;
        let tempNotebookList = pageStateObj.Notebooks;
        let pageIndex = tempNotebookList[index].selectedPageValue;


        let tempPageList = tempNotebookList[index].PageList;
        let tempDPageList = tempNotebookList[index].DeletedPageList;
        let deletedPage = tempPageList[pageIndex];
        tempDPageList.push(deletedPage);
        tempPageList.splice(pageIndex, 1);
        let tempPageView = '';
        let tempNoteView = '';
        let tempNoteTitle = '';
        let hasNotes = false;
        let hasPages = false
        if(tempPageList.length > 0){
            hasPages = true;
            for (let x = 0; x < tempPageList.length; x++) {
                tempPageList[x].pageNumber = x;
            }
            let newIndex = pageIndex < tempPageList.length ? pageIndex : pageIndex - 1;
            tempNotebookList[index].PageList = tempPageList;
            tempNotebookList[index].DeletedPageList = tempDPageList;
            tempNotebookList[index].selectedPageValue = newIndex
            tempNotebookList[index].selectedPage = tempPageList[newIndex];
            tempPageView = readOnlyPageDisplay(tempNotebookList[index].selectedPage);
            if(tempNotebookList[index].selectedPage.texts.length > 0){
                tempNoteView= readOnlyNoteDisplay(tempNotebookList[index].selectedPage.texts[tempNotebookList[index].selectNoteValue]);
                tempNoteTitle = tempNotebookList[index].selectedPage.texts[tempNotebookList[index].selectNoteValue].title;
                hasNotes = true;
            };
        }else{
            tempNotebookList[index].PageList = [];
            tempNotebookList[index].DeletedPageList = tempDPageList;
            tempNotebookList[index].selectedPageValue = undefined;
            tempNotebookList[index].selectedPage = {};
        }
        let obj = {
            Notebooks: tempNotebookList,
            pageView: tempPageView,
            noteView:tempNoteView,
            noteTitle:tempNoteTitle,
            isNewNote: !hasNotes,
            isNewPage: !hasPages,
            pageCopyToActive:false,
            pageMoveToActive:false,
        };
        this.props.pageComponentSave(obj);
    }

    render() {
        var pageStateObj = this.props.stateObj;
        var pageSelection = [];
        if (pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList != undefined && pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList.length > 0) {
            pageSelection = pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList.map((e) =>
                <option key={e.pageNumber} value={e.pageNumber}>
                    #{e.pageNumber + 1} : {e.name}  ({e.date}) - {e.texts.length}
                </option>
            );
        }
        var code;
        if(pageStateObj.isNewPage){
           code = (
                <div>
                    <label htmlFor="title">Page:</label>
                    <button onClick={this.addPage}>New Page</button>
                </div>
            )
        }else if(this.state.copyToSet){
           let notebookSelect = pageStateObj.Notebooks.map((e) =>
                <option key={e.ID} value={e.ID}>
                    #{e.ID + 1} - {e.title}
                </option>
            );
            let pageSelect = pageStateObj.Notebooks[this.state.notebookNumber].PageList.map((e)=>
                <option key={e.ID} value={e.ID}>
                    {e.pageNumber + 1} 
                </option>
            );
            code = (
                <div>
                    <div>
                        <label htmlFor="title">Page: </label>
                        <select id="selectPage" onChange={this.selectPage} value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue}>
                            {pageSelection}
                        </select>
                        <input type="text" id="title" name="title" value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPage.name} onChange={this.handlePageNameChange} />
                        <button onClick={this.removePage} id={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPage.pageNumber}>Remove Page</button>
                        <button onClick={this.addPage}>New Page</button>
                        <button onClick={this.copyToSet}>Copy To</button>
                        <button onClick={this.moveToSet}>Move To</button>
                    </div>
                    <div>
                        <select id="pageNotebookSelect" value={this.state.notebookNumber} onChange={this.selectToNotebook}>
                            {notebookSelect}
                        </select>
                        <label>Page # </label>
                        <select id='pageNumber' value={this.state.pageNumber} onChange={this.pageNumberOnChange}>
                            {pageSelect}
                        </select>
                        <button onClick={this.pageCopyTo}>Copy</button>
                    </div>
                    
                </div>

           )
        }else if(this.state.moveToSet){
           let notebookSelect = pageStateObj.Notebooks.map((e) =>
                <option key={e.ID} value={e.ID}>
                    #{e.ID + 1} - {e.title}
                </option>
            );
            let pageSelect = pageStateObj.Notebooks[this.state.notebookNumber].PageList.map((e)=>
                <option key={e.ID} value={e.ID}>
                    {e.pageNumber + 1} 
                </option>
            );
            code = (
                <div>
                    <div>
                        <label htmlFor="title">Page: </label>
                        <select id="selectPage" onChange={this.selectPage} value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue}>
                            {pageSelection}
                        </select>
                        <input type="text" id="title" name="title" value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPage.name} onChange={this.handlePageNameChange} />
                        <button onClick={this.removePage} id={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPage.pageNumber}>Remove Page</button>
                        <button onClick={this.addPage}>New Page</button>
                        <button onClick={this.copyToSet}>Copy To</button>
                        <button onClick={this.moveToSet}>Move To</button>
                    </div>
                    <div>
                        <select id="pageNotebookSelect" value={this.state.notebookNumber} onChange={this.selectToNotebook}>
                            {notebookSelect}
                        </select>
                        <label>Page # </label>
                        <select id='pageNumber' value={this.state.pageNumber} onChange={this.pageNumberOnChange}>
                            {pageSelect}
                        </select>
                        <button onClick={this.pageMoveTo}>Move</button>
                    </div>
                    
                </div>

           )
        }else{
           code = (
                <div>
                    <label htmlFor="title">Page: </label>
                    <select id="selectPage" onChange={this.selectPage} value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue}>
                        {pageSelection}
                    </select>
                    <input type="text" id="title" name="title" value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPage.name} onChange={this.handlePageNameChange} />
                    <button onClick={this.removePage} id={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPage.pageNumber}>Remove Page</button>
                    <button onClick={this.addPage}>New Page</button>
                    <button onClick={this.copyToSet}>Copy To</button>
                        <button onClick={this.moveToSet}>Move To</button>
                </div>
           )
        }
         
        return (
            <div className="page-inner-wrapper">
                     {code}
            </div>
        );
    }
}

class NoteComponent extends Component {
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
        let moveNoteValue = cloneDeep(pagelists[notebooks[notebookIndex].selectedPageValue].texts[notebooks[notebookIndex].selectNoteValue]) ;
        let textlist = cloneDeep(notebooks[moveToNotebook].PageList[moveToPage].texts);


        console.log(moveNoteTo)
        console.log(notebookIndex);
        console.log(noteStateObj.Notebooks[notebookIndex]);
        console.log(noteStateObj.Notebooks[notebookIndex].selectedPageValue);
        if(moveToPage === notebooks[notebookIndex].selectedPageValue){
            textlist.splice(notebooks[notebookIndex].selectNoteValue, 1);
        }

        let noteSizeCheck = textlist.length;       
        let temp = []
        console.log('noteSizeCheck:' + noteSizeCheck);
        console.log('copyNoteTo:' + moveNoteTo);
        if(noteSizeCheck >= moveNoteTo){ 
            console.log('if One');
            if(noteSizeCheck === moveNoteTo){
                console.log('if Two');
                temp = textlist;
                temp.push(moveNoteValue);
            }else{
                
            console.log('else One');         
                for(let x = 0; x < textlist.length; x++){
                    if(x === moveNoteTo){
                        console.log('if Three');
                        temp.push(moveNoteValue);
                        temp.push(textlist[x]);
                    }else{
                        console.log('else two');
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
                leavingNotelist.splice(notebooks[notebookIndex].selectNoteValue, 1);
                notebooks[notebookIndex].PageList[notebooks[notebookIndex].selectedPageValue].texts = leavingNotelist;
            }


            notebooks[moveToNotebook].PageList[moveToPage].texts = temp;

            let tempPageView = '';
            let tempNoteView = '';
            let tempNoteTitle = '';
            let hasNotes = false;
            let hasPages = false;
            console.log(notebooks);
            console.log(notebooks[notebookIndex]);
            console.log(notebooks[notebookIndex].PageList);
            console.log(notebooks[notebookIndex].PageList[notebooks[notebookIndex].selectedPageValue]);
            console.log(notebooks[notebookIndex].PageList[notebooks[notebookIndex].selectedPageValue].texts);
            console.log(notebooks[notebookIndex].PageList[notebooks[notebookIndex].selectedPageValue].texts[notebooks[notebookIndex].selectNoteValue]);
            if(notebooks[noteStateObj.selectedNotebookValue].PageList.length > 0){
                hasPages = true;
                if(notebooks[noteStateObj.selectedNotebookValue].PageList[notebooks[noteStateObj.selectedNotebookValue].selectedPageValue].texts.length > 0){
                    notebooks[moveToNotebook].selectNoteValue = notebooks[noteStateObj.selectedNotebookValue].selectNoteValue;
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
        let copyNoteValue = cloneDeep(pagelists[notebooks[notebookIndex].selectedPageValue].texts[notebooks[notebookIndex].selectNoteValue]) ;
        let textlist = cloneDeep(notebooks[copyToNotebook].PageList[copyToPage].texts);

        let noteSizeCheck = textlist.length;       
        let temp = []
        console.log('noteSizeCheck:' + noteSizeCheck);
        console.log('copyNoteTo:' + copyNoteTo);
        if(noteSizeCheck >= copyNoteTo){ 
            console.log('if One');
            if(noteSizeCheck === copyNoteTo){
                console.log('if Two');
                temp = textlist;
                temp.push(copyNoteValue);
            }else{
                
            console.log('else One');         
                for(let x = 0; x < textlist.length; x++){
                    if(x === copyNoteTo){
                        console.log('if Three');
                        temp.push(copyNoteValue);
                        temp.push(textlist[x]);
                    }else{
                        console.log('else two');
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
                notebooks[copyToNotebook].selectNoteValue = notebooks[noteStateObj.selectedNotebookValue].selectNoteValue;
                tempPageView = readOnlyPageDisplay(notebooks[noteStateObj.selectedNotebookValue].PageList[notebooks[noteStateObj.selectedNotebookValue].selectedPageValue])
                tempNoteView= readOnlyNoteDisplay(notebooks[noteStateObj.selectedNotebookValue].PageList[notebooks[noteStateObj.selectedNotebookValue].selectedPageValue].texts[notebooks[noteStateObj.selectedNotebookValue].selectNoteValue]);
                tempNoteTitle = notebooks[noteStateObj.selectedNotebookValue].PageList[notebooks[noteStateObj.selectedNotebookValue].selectedPageValue].texts[notebooks[noteStateObj.selectedNotebookValue].selectNoteValue].title;
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
    }
    selectToNotebook(event){        
        let target = event.target;
        let value = Number(target.value);
        console.log(value);
        this.setState({
            notebookNumber: value,
        });
    }
    selectToPage(event){
        let target = event.target;
        let value = target.value;
        console.log(value);
        this.setState({
            pageNumber:value,
        })
    }
    noteNumberOnChange(event){
        let target = event.target;
        let value = target.value;
        console.log(value);
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
        tempSelectedNotebook.selectedPage.texts[tempSelectedNotebook.selectNoteValue].text = value;
        tempNotebooks[noteStateObj.selectedNotebookValue] = tempSelectedNotebook;
        let obj ={
            Notebooks: tempNotebooks,
            noteTitle: tempSelectedNotebook.selectedPage.texts[tempSelectedNotebook.selectNoteValue].title,
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
        tempSelectedNotebook.selectedPage.texts[tempSelectedNotebook.selectNoteValue].title = value;
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
            tempNotebooks[notebookIndex].selectNoteValue = newIndex;
            tempNotebooks[notebookIndex].PageList[noteStateObj.Notebooks[notebookIndex].selectedPageValue].deletedTexts = tempDeletedTexts;
            tempPageView = readOnlyPageDisplay(tempNotebooks[notebookIndex].PageList[noteStateObj.Notebooks[notebookIndex].selectedPageValue])
            tempNoteView= readOnlyNoteDisplay(tempNotebooks[notebookIndex].PageList[noteStateObj.Notebooks[notebookIndex].selectedPageValue].texts[tempNotebooks[notebookIndex].selectNoteValue]);
            tempNoteTitle = tempNotebooks[notebookIndex].selectedPage.texts[tempNotebooks[notebookIndex].selectNoteValue].title;
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



    }
 saveNote(e){ 
    var noteStateObj = this.props.stateObj;       
        let tempSelectedNotebook = noteStateObj.Notebooks[noteStateObj.selectedNotebookValue];
        
        let tempPageDisplay = readOnlyPageDisplay(tempSelectedNotebook.selectedPage);
        let tempNoteDisplay = readOnlyNoteDisplay(tempSelectedNotebook.selectedPage.texts[tempSelectedNotebook.selectNoteValue]);
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
            })
        }
  selectNote(e) {
        var noteStateObj = this.props.stateObj;  
        let targe = e.target;
        let value = targe.value;
        let id = value;
        let tempNotebooks = noteStateObj.Notebooks;
        let tempSelectedNotebook = tempNotebooks[noteStateObj.selectedNotebookValue];
        let temp = tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue];

        tempSelectedNotebook.selectNoteValue = id;
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

    render() {
        var noteStateObj = this.props.stateObj;
        let selectedNotebook = noteStateObj.Notebooks[noteStateObj.selectedNotebookValue];
        let noteSelection = [];
        let pageIndex = selectedNotebook.selectedPageValue ;
        let pagelist = selectedNotebook.PageList[pageIndex];
        if (pagelist != undefined && pagelist.texts != undefined) {
            noteSelection = pagelist.texts.map((e) =>
                <option key={e.id} value={e.id}>
                    {e.id + 1} : {e.title} ({e.date} : {e.time})
            </option>
            );
        }
        var code;
        if(noteStateObj.isNewNote){
            code = (
                <div>
                    <label>Note:</label>
                </div>
            )
        }else if(this.state.noteEdit){
            console.log('2')
            code = (
                <div>
                   <label>Note:</label>
                   <div id="notes">
                       <select id="selectNote" onChange={this.selectNote} value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue}>
                           {noteSelection}
                       </select>                                        
                       <input type="text" id="title" name="title" value={noteStateObj.noteTitle} onChange={this.handleNoteTitleChange} />
                        <button onClick={this.saveNote} id="noteSave">Save</button>
                        <button onClick={this.removeNote} value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue} id={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue}>Remove Note</button>
                       <div className="TheNote">
                           <div className="readOnlyDisplay">
                                <textarea id="editNoteTextArea" value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].PageList[noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectedPageValue].texts[noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue].text} rows="10" cols="100" onChange={this.handleChangeNoteEdit} />                    
                           </div>
                       </div>
                   </div>
                </div>
           )
        }else if(this.state.copyToSet){
            console.log('CopyTo')
            console.log(noteStateObj);

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
              console.log(this.state.pageNumber);
              if(noteStateObj.Notebooks[this.state.notebookNumber].PageList[this.state.pageNumber].texts !== undefined){

              noteSelect = noteStateObj.Notebooks[this.state.notebookNumber].PageList[this.state.pageNumber].texts.map((e)=>
              <option key={e.id} value={e.id}>
                  {e.id + 1}
              </option>

            )};
            code = (
                <div>
                   <label>Note:</label>
                   <div id="notes">
                       <select id="selectNote" onChange={this.selectNote} value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue}>
                           {noteSelection}
                       </select>                                        
                       <input type="text" id="title" name="title" value={noteStateObj.noteTitle} onChange={this.handleNoteTitleChange} />
                        <button onClick={this.editNote} id="noteEdit">Edit</button>
                        <button onClick={this.removeNote} value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue} id={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue}>Remove Note</button>
                        <button onClick={this.copyToSet}>Copy To</button>
                        <button onClick={this.moveToSet}>Move To</button>                    
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
                        <div className="TheNote">
                           <div className="readOnlyDisplay">
                               {noteStateObj.noteView}
                           </div>
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
                   <label>Note:</label>
                   <div id="notes">
                       <select id="selectNote" onChange={this.selectNote} value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue}>
                           {noteSelection}
                       </select>                                        
                       <input type="text" id="title" name="title" value={noteStateObj.noteTitle} onChange={this.handleNoteTitleChange} />
                        <button onClick={this.editNote} id="noteEdit">Edit</button>
                        <button onClick={this.removeNote} value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue} id={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue}>Remove Note</button>
                        <button onClick={this.copyToSet}>Copy To</button>
                        <button onClick={this.moveToSet}>Move To</button>                     
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
                        <div className="TheNote">
                           <div className="readOnlyDisplay">
                               {noteStateObj.noteView}
                           </div>
                       </div>
                   </div>
                </div>
           )
        }else {
            code = (
                <div>
                   <label>Note:</label>
                   <div id="notes">
                       <select id="selectNote" onChange={this.selectNote} value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue}>
                           {noteSelection}
                       </select>                                        
                       <input type="text" id="title" name="title" value={noteStateObj.noteTitle} onChange={this.handleNoteTitleChange} />
                        <button onClick={this.editNote} id="noteEdit">Edit</button>
                        <button onClick={this.removeNote} value={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue} id={noteStateObj.Notebooks[noteStateObj.selectedNotebookValue].selectNoteValue}>Remove Note</button>
                        <button onClick={this.copyToSet}>Copy To</button>
                        <button onClick={this.moveToSet}>Move To</button> 
                        <div className="TheNote">
                           <div className="readOnlyDisplay">
                               {noteStateObj.noteView}
                           </div>
                       </div>
                   </div>
                </div>
           )
        }        
        return (
            <div className="page-col-one-row-three">
                     {code}
            </div>
        );
    }
}

class AwesomeTextBoxComponent extends Component {
    constructor(props) {
        super(props);

        this.addNote = this.addNote.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    addNote(event) {
        var atbStateObj = this.props.stateObj;
        let tempNotebooks = atbStateObj.Notebooks;
        let tempSelectedNotebook = atbStateObj.Notebooks[atbStateObj.selectedNotebookValue];
        let dataIndex = tempSelectedNotebook.selectedPageValue;
        if (tempSelectedNotebook.mainText != undefined && tempSelectedNotebook.mainText.trim() !== '') {
            let d = new Date();
            let tempId = tempSelectedNotebook.PageList.length > 0 ? tempSelectedNotebook.PageList[dataIndex].texts.length : 0;
            let tempArray = [];
            tempArray = tempSelectedNotebook.PageList;
            let tempText = tempSelectedNotebook.mainText;
            let tempObject = {
                original_id: tempId,
                original_text: tempText,
                id: tempId,
                title:'<New Note>',
                text: tempText + "\n",
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
            }
            
            tempArray[dataIndex].texts.push(tempObject);
            let tempPageDisplay = readOnlyPageDisplay(tempArray[dataIndex]);
            let tempNoteDisplay = readOnlyNoteDisplay(tempArray[dataIndex].texts[tempId]);
            tempSelectedNotebook.PageList = tempArray;
            tempSelectedNotebook.selectedPage = tempArray[dataIndex];
            tempSelectedNotebook.selectedNote = tempObject;
            tempSelectedNotebook.selectNoteValue = tempId;
            tempSelectedNotebook.mainText = '';
            tempNotebooks[atbStateObj.selectedNotebookValue] = tempSelectedNotebook;

            var isNewNoteCheck = atbStateObj.isNewNote;
            if(isNewNoteCheck){isNewNoteCheck = false};
            let obj ={
                Notebooks: tempNotebooks,
                pageView: tempPageDisplay,
                noteView: tempNoteDisplay,
                noteTitle: tempObject.title,
                isNewNote:isNewNoteCheck,
            };
            this.props.atbComponentSave(obj);
        }


    }
 handleChange(event) {
        //This will handle any state that is not an object or part of an array I pass in the name of the state value and assign that and then assign the value 
        //this is helpful because then I only need one handleChange for at least these simple changes.
        var atbStateObj = this.props.stateObj;
        let target = event.target;
        let value = target.value;
        let name = target.name;
        let tempNotebooks = atbStateObj.Notebooks;
        let tempSelectedNotebook = atbStateObj.Notebooks[atbStateObj.selectedNotebookValue];
        tempSelectedNotebook[name] = value;
       // console.log(tempSelectedNotebook);
        tempNotebooks[atbStateObj.selectedNotebookValue] = tempSelectedNotebook;
        let obj ={
            Notebooks: tempNotebooks
        };

        this.props.atbComponentHandleChange(obj);
    }
    render() {
        var atbStateObj = this.props.stateObj;
        return (
            <div className="awesome-wrapper">
                <div className="awesome-col-one">
                    <h2>Awesome Text Box for Page {atbStateObj.Notebooks[atbStateObj.selectedNotebookValue].selectedPage.name}</h2>
                    <div>
                        <textarea className='main-text' name="mainText" id="awesometextarea" value={atbStateObj.Notebooks[atbStateObj.selectedNotebookValue].mainText} onChange={this.handleChange} rows="10" cols="50" />
                    </div>
                    <div>                        
                        <button onClick={this.addNote} id={atbStateObj.Notebooks[atbStateObj.selectedNotebookValue].selectedPage.pageNumber}>Add Note</button>
                    </div>
                </div>
            </div>
        );
    }
}

class PageViewComponent extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let pageViewStateObj = this.props.stateObj
        return (
            <div className="page-col-two">
                <label>Page View:</label>

                <div className="ThePage">
                    <div className="readOnlyDisplay">
                        {pageViewStateObj.pageView}
                    </div>
                </div>
            </div>
        );
    }
}
