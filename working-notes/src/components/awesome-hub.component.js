import React, { Component } from 'react';
import './css/awesome-hub.css';
import { readOnlyPageDisplay,readOnlyNoteDisplay } from './shared/util';


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
        console.log(e);
        console.log("2");
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
        console.log(this.state);
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
        console.log('landing');
        this.setState({
            freshNotebook:true,
        });

    }
    async save() {
        console.log("3");
        let selectedListItem = this.state.Notebooks[this.state.selectedNotebookValue];
        console.log(selectedListItem);
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
            var stateObj = {
                Notebooks: this.state.Notebooks,
                DeletedNotebooks: this.state.DeletedNotebooks,
                selected: this.state.selected,
                selectedNotebook: this.state.selectedNotebook,
                selectedNotebookValue: this.state.selectedNotebookValue,
                pageView: this.state.pageView,
                noteView: this.state.noteView,
                noteTitle: this.state.noteTitle,
                isNewPage: this.state.isNewPage,
                isNewNote: this.state.isNewNote,
                noteEdit: this.state.noteEdit,
                freshNotebook: this.state.freshNotebook,
            }
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
                                <div className="page-col-two">
                                    <label>Page View:</label>

                                    <div className="ThePage">
                                        <div className="readOnlyDisplay">
                                            {this.state.pageView}
                                        </div>
                                    </div>
                                </div>
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
        console.log("1");
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
            globalTagList: [],
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
            this.props.landingUpload(obj);
            //this.load();
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
        console.log('addNOtebook');
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
            //globalTagList: [],
            //isNew: true,
            time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
            date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
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
            console.log(tempNotebookList);
            console.log(notebookStateObj);
            if(tempNotebookList[newIndex].PageList != undefined && tempNotebookList[newIndex].PageList.length > 0){
                hasPages = true;
                tempPageView = readOnlyPageDisplay(tempNotebookList[newIndex].selectedPage);
                if(tempNotebookList[newIndex].selectedPage.texts.length > 0){
                    hasNotes = true;
                    noteTitleCheck = tempNotebookList[newIndex].selectedNote.title;
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
        /*
        var crazy;
        if (this.state.isEncrypt && this.state.yours.length > 0) {
            let key = this.state.yours;
            crazy = CryptoJS.AES.encrypt(temp, key);
        }
        */
        const file = new Blob([temp], { type: 'application/json' });
        //const file = new Blob([temp], {type: 'application/json'});
        x.href = URL.createObjectURL(file);
        x.download = "MyAwesomeNote.json";
        document.body.appendChild(x); // Required for this to work in FireFox
        x.click();
    }
selectNotebook(event) {
        let notebookStateObj = this.props.notebookStateObj;
        let target = event.target;
        let value = target.value;
        let id = value;
        let selectedTempNotebook = {};
        selectedTempNotebook = notebookStateObj.Notebooks[id];
        console.log(selectedTempNotebook);
        let hasPages = false;
        let tempPageView = '';
        let hasNotes = false;
        let tempNoteView = '';
        let noteTitleCheck = '';
        if(selectedTempNotebook.PageList.length > 0){
             hasPages = true;
             tempPageView = readOnlyPageDisplay(selectedTempNotebook.selectedPage);
             if(selectedTempNotebook.selectedPage.texts.length > 0){
                 hasNotes = true;
                 noteTitleCheck = selectedTempNotebook.PageList[selectedTempNotebook.selectedPageValue].texts[selectedTempNotebook.selectNoteValue].title;
                 tempNoteView = readOnlyNoteDisplay(selectedTempNotebook.PageList[selectedTempNotebook.selectedPageValue].texts[selectedTempNotebook.selectNoteValue]);
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
                    {e.title}  ({e.date}) - {e.PageList.length}
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

        this.handlePageNameChange = this.handlePageNameChange.bind(this);
        this.selectPage = this.selectPage.bind(this);
        this.addPage = this.addPage.bind(this);
        this.removePage = this.removePage.bind(this);
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
        /*update the selected page*/
        let stateObj = this.props.stateObj;
        //this.mydebug("selectPage");
        let target = event.target;
        let value = Number(target.value);
        console.log(value);
        let id = value;
        let dataIndex = id - 1;
        console.log(id);
        let tempNotebook = stateObj.Notebooks;
        let tempSelectedNotebook = tempNotebook[stateObj.selectedNotebookValue];
        tempSelectedNotebook.selectedPage = tempSelectedNotebook.PageList[id];
        tempSelectedNotebook.selectedPageValue = id;
        console.log(tempSelectedNotebook);
        let tempPageView = '';
        let tempNoteView = '';
        let tempNoteTitle = '';
        let hasNotes = false;
        if(tempSelectedNotebook.selectedPage.texts.length > 0){
            tempPageView = readOnlyPageDisplay(tempSelectedNotebook.selectedPage)
            tempNoteView= readOnlyNoteDisplay(tempSelectedNotebook.selectedPage.texts[tempSelectedNotebook.selectNoteValue]);
            tempNoteTitle = tempSelectedNotebook.selectedPage.texts[tempSelectedNotebook.selectNoteValue].title;
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
        console.log('working');
        let stateObj = this.props.stateObj;
        let d = new Date();
        let tempNotebooks = stateObj.Notebooks;
        let tempSelectedNotebook = tempNotebooks[stateObj.selectedNotebookValue];
        let tempObj = {
                name: '<New Page>',
                section: tempSelectedNotebook.PageList.length > 0 ? tempSelectedNotebook.PageList.length: 0,
                texts: [],
                deletedTexts: [],
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
            }
           console.log(tempObj.section);
            tempSelectedNotebook.pageName = '';
            tempSelectedNotebook.selectedPage = tempObj;
            tempSelectedNotebook.selectedPageValue =tempObj.section;
            tempSelectedNotebook.selectedNote = {};
            tempSelectedNotebook.PageList.push(tempObj);
            tempNotebooks[stateObj.selectedNotebookValue] = tempSelectedNotebook;
            console.log(tempNotebooks);
            var newPageCheck = stateObj.isNewPage;
            if(newPageCheck){newPageCheck = false};
            let obj ={
                Notebooks: tempNotebooks,
                noteTitle: '',
                noteView:'',
                pageView:'',
                isNewPage: newPageCheck,
                isNewNote: true,              
            };
            this.props.pageComponentSave(obj);
    }

    removePage() {
        let stateObj = this.props.stateObj;

        let index = stateObj.selectedNotebookValue;
        let tempNotebookList = stateObj.Notebooks;
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
                console.log(x);
                tempPageList[x].section = x;
            }
            let newIndex = pageIndex < tempPageList.length ? pageIndex : pageIndex - 1;
            console.log(newIndex);
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
        };
        this.props.pageComponentSave(obj);
    }

    render() {
        var pageStateObj = this.props.stateObj;
        var pageSelection = [];
        if (pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList != undefined && pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList.length > 0) {
            pageSelection = pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList.map((e) =>
                <option key={e.section} value={e.section}>
                    {e.name}  ({e.date}) - {e.texts.length}
                </option>
            );
        }

        var code = pageStateObj.isNewPage ? 
        (
            <div>
                <label htmlFor="title">Page:</label>
                <button onClick={this.addPage}>New Page</button>
            </div>
        ) : (
         
         <div>
             <label htmlFor="title">Page:</label>
             <select id="selectPage" onChange={this.selectPage} value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue}>
                 {pageSelection}
             </select>
             <input type="text" id="title" name="title" value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPage.name} onChange={this.handlePageNameChange} />
             <button onClick={this.removePage} id={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPage.section}>Remove Page</button>
             <button onClick={this.addPage}>New Page</button>
         </div>
     
    )
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
        };

        this.removeNote = this.removeNote.bind(this);
        this.saveNote = this.saveNote.bind(this);
        this.editNote = this.editNote.bind(this);
        this.selectNote = this.selectNote.bind(this);

        this.handleChangeNoteEdit = this.handleChangeNoteEdit.bind(this);
        this.handleNoteTitleChange = this.handleNoteTitleChange.bind(this);

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
            console.log(tempNotebooks[notebookIndex].PageList[noteStateObj.Notebooks[notebookIndex].selectedPageValue].texts);
            console.log(tempNotebooks[notebookIndex].selectNoteValue);
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
        //let tempSelected = document.getElementById("selectNote");
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
        console.log(noteStateObj);
        var code;
        if(noteStateObj.isNewNote){
            code = (
                <div>
                    <label>Note:</label>
                </div>
            )
        }else if(this.state.noteEdit){
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
        } else{
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
        /*add a note section.*/
        var atbStateObj = this.props.stateObj;
        let tempNotebooks = atbStateObj.Notebooks;
        let tempSelectedNotebook = atbStateObj.Notebooks[atbStateObj.selectedNotebookValue];
        //let globaltaglist = tempSelectedNotebook.globalTagList;
        let dataIndex = tempSelectedNotebook.selectedPageValue;
        //console.log(dataIndex);
        if (tempSelectedNotebook.mainText != undefined && tempSelectedNotebook.mainText.trim() !== '') {
            let d = new Date();
            let tempId = tempSelectedNotebook.PageList.length > 0 ? tempSelectedNotebook.PageList[dataIndex].texts.length : 0;
            let tempArray = [];
            tempArray = tempSelectedNotebook.PageList;
            let tempText = tempSelectedNotebook.mainText;
            
            /*
            let tempTagList = [];
            //global tag assign
            
            globaltaglist.forEach((a) => {
                tempText.split(' ').forEach((b) => {
                    if (b === a) {
                        tempTagList.push(b);
                    }
                });
            });
            
            let reg = /(\*\-[^\s]+)/g;
            let tempTagString = '';
            let tempTagArray = [...tempText.matchAll(reg)];
            tempTagArray.forEach((a) => {
                let tempString = a['0'];
                tempString = tempString.replace(/(\*\-)/g, '');
                tempTagList.push(tempString);
                globaltaglist.push(tempString);
            });
            let globalTemp = new Set();
            let localTemp = new Set();
            tempTagList.forEach((a) => { localTemp.add(a) });
            globaltaglist.forEach((c) => {
                globalTemp.add(c);
            });
            globaltaglist = [...globalTemp];
            tempTagList = [...localTemp];
            tempTagList.forEach((a) => {
                tempTagString += ' (' + a + ') ';
            });
            */
            //global tag assign
            let tempObject = {
                original_id: tempId,
                original_text: tempText,
                id: tempId,
                title:'<New Note>',
                text: tempText + "\n",//.replace(/(\*\-)/g, '') + "\n",
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
                //tags: '',
                //tagString: ''
            }
            
            tempArray[dataIndex].texts.push(tempObject);
            //note create section here
            let tempPageDisplay = readOnlyPageDisplay(tempArray[dataIndex]);
            let tempNoteDisplay = readOnlyNoteDisplay(tempArray[dataIndex].texts[tempId]);
            tempSelectedNotebook.PageList = tempArray;
            tempSelectedNotebook.selectedPage = tempArray[dataIndex];
            //tempSelectedNotebook.globalTagList = globaltaglist;
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
            //this.save();
           //this.myRefresh();
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
        console.log(tempSelectedNotebook);
        tempNotebooks[atbStateObj.selectedNotebookValue] = tempSelectedNotebook;
        let obj ={
            Notebooks: tempNotebooks
        };

        this.props.atbComponentHandleChange(obj);
    }
    /*
  tagAssign() {
        this.mydebug('tagAssign');
        let tempSelectedNotebook = this.state.selectedNotebook;
        let textarea = document.getElementById("awesometextarea");
        let formatted = '';
        let len = textarea.value.length;
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        let sel = textarea.value.substring(start, end);
        let replace = '' + sel;

        textarea.value = textarea.value.substring(0, start) + replace + textarea.value.substring(end, len);
        formatted = textarea.value;
        tempSelectedNotebook.mainText = formatted;
        this.setState({
            selectedNotebook: tempSelectedNotebook
        });

    }
*/
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
                        <button onClick={this.addNote} id={atbStateObj.Notebooks[atbStateObj.selectedNotebookValue].selectedPage.section}>Add Note</button>
                    </div>
                </div>
            </div>
        );
    }
}
