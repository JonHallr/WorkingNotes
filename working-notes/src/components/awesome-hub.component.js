import React, { Component } from 'react';
import * as CryptoJS from 'crypto-js';
import './css/awesome-hub.css';
//import {TextNoteComponent} from '../notes/TextNoteComponent';
import { getIndexOfObject } from './shared/util';
import { ClockComponent } from './shared/clock.component';


export class AwesomeHubComponent extends Component {

    constructor(props) {
        super(props);
        this.stateChange = props.stateChange || new Function();

        this.state = {
            //Hub Section
            Notebooks: [], //Main note list
            DeletedNotebooks: [],
            selected: false,
            upload: '',
            selectedNotebook: {},
            selectedNotebookValue: 0,
            active: 'T',
            yours: '',
            isEncrypt: false,
            isUploaded: false,
            isNew: false,
            pageView: '',
            noteView: '',
            noteTitle: '',
            isNewPage: true,
            isNewNote: true,
            noteEdit:false,
        };


        //Hub Section
        this.load = this.load.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.upload = this.upload.bind(this);
        //Note Section
        this.handlePageNameChange = this.handlePageNameChange.bind(this);
        this.handleNoteTitleChange = this.handleNoteTitleChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.myRefresh = this.myRefresh.bind(this);
        this.addPage = this.addPage.bind(this);

        this.selectPage = this.selectPage.bind(this);
        this.addNote = this.addNote.bind(this);
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

        this.readOnlyPageDisplay = this.readOnlyPageDisplay.bind(this);

        this.editNote = this.editNote.bind(this);

        this.handleChangeNoteEdit = this.handleChangeNoteEdit.bind(this);

        this.saveNote = this.saveNote.bind(this);

        this.removeNote = this.removeNote.bind(this);
        ;
    }

    mydebug(name) {
        if (this.state.active === 'T') { console.log(name); }
    }
    //File

    readFileAsync(file) {
        this.mydebug("readFileAsync");
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
        this.mydebug('upload');
        try {
            let doc = document.getElementById('upload');
            var file = doc.files.item(0);
            let contentBuffer = await this.readFileAsync(file);
            var temp;
            if (this.state.isEncrypt) {
                let key = this.state.yours;
                let back = CryptoJS.AES.decrypt(contentBuffer, key);
                temp = JSON.parse(back.toString(CryptoJS.enc.Utf8));
            } else {
                temp = JSON.parse(contentBuffer);
            }
            let tempNotebooks = temp.Notebooks;
            let tempDeletedNotebooks = temp.DeletedNotebooks;
           let hasPages = false;
           let tempPageView = '';
           let hasNotes = false;
           let tempNoteView = '';
           let noteTitleCheck = '';
           if(tempNotebooks[0].PageList.length > 0){
                hasPages = true;
                tempPageView = this.readOnlyPageDisplay(tempNotebooks[0].selectedPage);
                if(tempNotebooks[0].PageList[0].texts.length > 0){
                    hasNotes = true;
                    noteTitleCheck = tempNotebooks[0].PageList[0].texts[0].title;
                    tempNoteView = this.readOnlyNoteDisplay(tempNotebooks[0].selectedPage.texts[0]);
                }          
           }
           
            this.setState({
                Notebooks: tempNotebooks,
                DeletedNotebooks: tempDeletedNotebooks,
                selectedNotebookValue: 0,
                isUploaded: true,
                isNewPage: !hasPages,
                isNewNote: !hasNotes,
                noteTitle: noteTitleCheck,
                pageView: tempPageView,
                noteView: tempNoteView,
            });
            //this.load();
        } catch (err) {
            console.log('catch');
            console.log(err);

        }
    }
    downloadNoteFile = () => {
        const x = document.createElement("a");
        let tempObject = {
            Notebooks: this.state.Notebooks,
            DeletedNotebooks: this.state.DeletedNotebooks
        }
        let temp = JSON.stringify(tempObject);
        var crazy;
        if (this.state.isEncrypt && this.state.yours.length > 0) {
            let key = this.state.yours;
            crazy = CryptoJS.AES.encrypt(temp, key);
        }

        const file = new Blob([this.state.isEncrypt ? crazy : temp], { type: 'application/json' });
        //const file = new Blob([temp], {type: 'application/json'});
        x.href = URL.createObjectURL(file);
        x.download = "MyAwesomeNote.json";
        document.body.appendChild(x); // Required for this to work in FireFox
        x.click();
    }

    //Delete
    DeleteNotebook(e) {
        this.mydebug('DeleteNotebook')
        let index = this.state.selectedNotebookValue;
        let tempNotebookList = this.state.Notebooks;
        let tempDNotebookList = this.state.DeletedNotebooks;
        let deletedNotebook = this.state.Notebooks[index];
        tempDNotebookList.push(deletedNotebook);
        tempNotebookList.splice(index, 1);
        if(tempNotebookList.length > 0){
            for (let x = 0; x < tempNotebookList.length; x++) {
                tempNotebookList[x].ID = x;
            }
            this.setState({
                Notebooks: tempNotebookList,
                DeletedNotebooks: tempDNotebookList,
                selectedNotebook: tempNotebookList[0],
                selectedNotebookValue: 0,
            });
            this.save();

        }



    }
    PageDelete(e) {
        this.mydebug('PageDelete')

        let index = this.state.selectedNotebookValue;
        let tempNotebookList = this.state.Notebooks;
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
            tempPageView = this.readOnlyPageDisplay(tempNotebookList[index].selectedPage);
            if(tempNotebookList[index].selectedPage.texts.length > 0){
                tempNoteView= this.readOnlyNoteDisplay(tempNotebookList[index].selectedPage.texts[tempNotebookList[index].selectNoteValue]);
                tempNoteTitle = tempNotebookList[index].selectedPage.texts[tempNotebookList[index].selectNoteValue].title;
                hasNotes = true;
            };
        }else{
            tempNotebookList[index].PageList = [];
            tempNotebookList[index].DeletedPageList = tempDPageList;
            tempNotebookList[index].selectedPageValue = undefined;
            tempNotebookList[index].selectedPage = {};
        }
        this.setState({
            Notebooks: tempNotebookList,
            pageView: tempPageView,
            noteView:tempNoteView,
            noteTitle:tempNoteTitle,
            isNewNote: !hasNotes,
            isNewPage: !hasPages,
        });
        this.save();
    }

    removeNote(e){
        let target = e.target;
        let index = target.id;
        let notebookIndex = this.state.selectedNotebookValue;
        let tempNotebooks = this.state.Notebooks;
        let tempTexts = tempNotebooks[notebookIndex].PageList[this.state.Notebooks[notebookIndex].selectedPageValue].texts;
        let tempDeletedTexts = tempNotebooks[notebookIndex].PageList[this.state.Notebooks[notebookIndex].selectedPageValue].deletedTexts;
        tempDeletedTexts.push(tempTexts[index]);
        tempTexts.splice(index,1);
        let tempPageView = '';
        let tempNoteView = '';
        let tempNoteTitle = '';
        let hasNotes = false;   
        if(tempTexts.length > 0){    
            for (let x = index; x < tempTexts.length; x++) {
                tempTexts[x].id = Number(x);
            }
            tempNotebooks[notebookIndex].PageList[this.state.Notebooks[notebookIndex].selectedPageValue].texts = tempTexts;
            tempNotebooks[notebookIndex].PageList[this.state.Notebooks[notebookIndex].selectedPageValue].deletedTexts = tempDeletedTexts;
            tempPageView = this.readOnlyPageDisplay(tempNotebooks[notebookIndex].PageList[this.state.Notebooks[notebookIndex].selectedPageValue])
            tempNoteView= this.readOnlyNoteDisplay(tempNotebooks[notebookIndex].selectedPage.texts[tempNotebooks[notebookIndex].selectNoteValue]);
            tempNoteTitle = tempNotebooks[notebookIndex].selectedPage.texts[tempNotebooks[notebookIndex].selectNoteValue].title;
            hasNotes = true;

        }else{
            tempNotebooks[notebookIndex].PageList[this.state.Notebooks[notebookIndex].selectedPageValue].texts = [];
            tempNotebooks[notebookIndex].PageList[this.state.Notebooks[notebookIndex].selectedPageValue].deletedTexts = tempDeletedTexts;

        }

        this.setState({
            Notebooks: tempNotebooks,
            pageView: tempPageView,
            noteView:tempNoteView,
            noteTitle:tempNoteTitle,
            isNewNote: !hasNotes,
        })



    }

    NoteTextDelete(e) {
        let target = e.target;
        let index = target.id;
        let selectedIndex = this.state.selectedPage.section;
        let tempList = this.state.PageList;

        let tempSection = this.state.selectedPage;
        let tempDelete = tempSection.texts[index];
        tempSection['deletedTexts'] == undefined ? tempSection['deletedTexts'] = [] : tempSection['deletedTexts'] = tempSection.deletedTexts;
        tempSection.deletedTexts.push(tempDelete);
        tempSection.texts.splice(index, 1);
        for (let x = index; x < tempSection.texts.length; x++) {
            tempSection.texts[x].id = Number(x);
        }
        tempList[selectedIndex] = tempSection;
        this.setState({
            PageList: tempList,
            selectedPage: tempSection
        });
        this.save();
    }

    //add

    addPage() {
        this.mydebug('addPage');
        let d = new Date();
        let tempNotebooks = this.state.Notebooks;
        let tempSelectedNotebook = tempNotebooks[this.state.selectedNotebookValue];
        let tempObj = {
                name: '<New Page>',
                section: tempSelectedNotebook.PageList.length > 0 ? tempSelectedNotebook.PageList.length: 0,
                texts: [],
                deletedTexts: [],
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
            }
        /*
            let pagelistCheck = tempSelectedNotebook.PageList.length > 0 ? true : false;
            let os = pagelistCheck ? tempSelectedNotebook.PageList[tempSelectedNotebook.PageList.length - 1] : 0;
            let ns = pagelistCheck ? os.section + 1 : os + 1;
            let tempObj = {
                name: '<New Page>',
                section: ns,
                texts: [],
                deletedTexts: [],
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
            }
            */
           console.log(tempObj.section);
            tempSelectedNotebook.pageName = '';
            tempSelectedNotebook.selectedPage = tempObj;
            tempSelectedNotebook.selectedPageValue =tempObj.section;
            tempSelectedNotebook.selectedNote = {};
            tempSelectedNotebook.PageList.push(tempObj);
            tempNotebooks[this.state.selectedNotebookValue] = tempSelectedNotebook;
            console.log(tempNotebooks);
            var newPageCheck = this.state.isNewPage;
            if(newPageCheck){newPageCheck = false};
            this.setState({
                Notebooks: tempNotebooks,
                noteTitle: '',
                noteView:'',
                pageView:'',
                isNewPage: newPageCheck,
                isNewNote: true,              
            });
            this.save();
    }
    addNotebook() {
        this.mydebug('addNotebook');
        let d = new Date();
        let tempList = this.state.Notebooks.length > 0 ? this.state.Notebooks : [];
        let tempID = this.state.Notebooks.length > 0 ? this.state.Notebooks.length : 0;
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
            isNew: true,
            time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
            date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
        });
        tempList.push(singleObj);
        this.setState({
            Notebooks: tempList,
            selectedNotebookValue: tempID,
            isNew: true,
            isNewPage: true,
            isNewNote: true,
            noteView: '',
            pageView: '',
        });

    }
    addNote(event) {
        console.log(event.target.id);
        /*add a note section.*/
        this.mydebug("addNote");
        let tempNotebooks = this.state.Notebooks;
        let tempSelectedNotebook = this.state.Notebooks[this.state.selectedNotebookValue];
        let globaltaglist = tempSelectedNotebook.globalTagList;
        let dataIndex = tempSelectedNotebook.selectedPageValue;
        console.log(dataIndex);
        if (tempSelectedNotebook.mainText != undefined && tempSelectedNotebook.mainText.trim() !== '') {
            let d = new Date();
            let tempId = tempSelectedNotebook.PageList.length > 0 ? tempSelectedNotebook.PageList[dataIndex].texts.length : 0;
            let tempArray = [];
            tempArray = tempSelectedNotebook.PageList;
            let tempText = tempSelectedNotebook.mainText;
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
            
            //global tag assign
            let tempObject = {
                original_id: tempId,
                original_text: tempText,
                id: tempId,
                title:'<New Note>',
                text: tempText.replace(/(\*\-)/g, '') + "\n",
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear(),
                visible: 'collapse',
                tags: tempTagList,
                tagString: tempTagString
            }
            tempArray[dataIndex].texts.push(tempObject);
            //note create section here
            let tempPageDisplay = this.readOnlyPageDisplay(tempArray[dataIndex]);
            let tempNoteDisplay = this.readOnlyNoteDisplay(tempArray[dataIndex].texts[tempId]);
            tempSelectedNotebook.PageList = tempArray;
            tempSelectedNotebook.selectedPage = tempArray[dataIndex];
            tempSelectedNotebook.globalTagList = globaltaglist;
            tempSelectedNotebook.selectedNote = tempObject;
            tempSelectedNotebook.selectNoteValue = tempId;
            tempSelectedNotebook.mainText = '';
            tempNotebooks[this.state.selectedNotebookValue] = tempSelectedNotebook;

            var isNewNoteCheck = this.state.isNewNote;
            if(isNewNoteCheck){isNewNoteCheck = false};
            this.setState({
                Notebooks: tempNotebooks,
                pageView: tempPageDisplay,
                noteView: tempNoteDisplay,
                noteTitle: tempObject.title,
                isNewNote:isNewNoteCheck,
            });

            this.save();
            this.myRefresh();
        }


    }

    //Edit
    onClickEdit(e) {
        let target = e.target;
        let id = target.id;
        let textarea = document.getElementById(id + 'textarea');
        if (target.innerHTML === 'Edit') {
            target.innerHTML = 'Done';
            textarea.readOnly = false;
        } else {
            target.innerHTML = 'Edit';
            textarea.readOnly = true;
        }
    }

    editNote(e){
        this.setState({
            noteEdit: true,
        })
    }

    //save
    async save() {
        this.mydebug('save');
        let selectedListItem = this.state.Notebooks[this.state.selectedNotebookValue];
        console.log(selectedListItem);
        if (selectedListItem) {
            await this.globalTagAssign();
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
                globalTagList: selectedListItem.globalTagList,
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

    saveNote(e){        
        let tempSelectedNotebook = this.state.Notebooks[this.state.selectedNotebookValue];
        
        let tempPageDisplay = this.readOnlyPageDisplay(tempSelectedNotebook.selectedPage);
        let tempNoteDisplay = this.readOnlyNoteDisplay(tempSelectedNotebook.selectedPage.texts[tempSelectedNotebook.selectNoteValue]);
        this.setState({
            noteEdit: false,
            pageView: tempPageDisplay,
            noteView:tempNoteDisplay
        });
    }

    //load
    async load() {
        this.mydebug('load');
        let selectedListItem = document.getElementById("PageListDD");
        if (selectedListItem) {
            let selectedItem = this.state.Notebooks[selectedListItem.value];
            //Load
            await this.setState({
                selectedNotebookValue: selectedItem.ID
            });
        };

    }

    //Selected
    async setSelected(event) {
        this.mydebug("setSelected");
        let target = event.target;

        if (target != undefined && this.state.Notebooks.length > 0) {
            let value = this.state.title === this.state.Notebooks[target.value].title ? true : false;
            this.setState({
                selected: value
            });
        }
        await this.load();
    }

    selectNotebook(event) {
        this.mydebug("selectNotebook");
        let target = event.target;
        let value = target.value;
        let id = value;
        let selectedTempNotebook = {};
        selectedTempNotebook = this.state.Notebooks[id];
        let hasPages = false;
        let tempPageView = '';
        let hasNotes = false;
        let tempNoteView = '';
        let noteTitleCheck = '';
        if(selectedTempNotebook.PageList.length > 0){
             hasPages = true;
             tempPageView = this.readOnlyPageDisplay(selectedTempNotebook.selectedPage);
             if(selectedTempNotebook.selectedPage.texts.length > 0){
                 hasNotes = true;
                 noteTitleCheck = selectedTempNotebook.selectedNote.title;
                 tempNoteView = this.readOnlyNoteDisplay(selectedTempNotebook.selectedNote);
             }          
        }
        this.setState({
            selectedNotebook: selectedTempNotebook,
            selectedNotebookValue: id,
            isNewPage: !hasPages,
            isNewNote: !hasNotes,
            pageView:tempPageView,
            noteView: tempNoteView,
            noteTitle:noteTitleCheck,
        });
        this.load();
    }

    selectPage(event) {
        /*update the selected page*/
        this.mydebug("selectPage");
        let target = event.target;
        let value = Number(target.value);
        console.log(value);
        let id = value;
        let dataIndex = id - 1;
        console.log(id);
        let tempNotebook = this.state.Notebooks;
        let tempSelectedNotebook = tempNotebook[this.state.selectedNotebookValue];
        tempSelectedNotebook.selectedPage = tempSelectedNotebook.PageList[id];
        tempSelectedNotebook.selectedPageValue = id;
        console.log(tempSelectedNotebook);
        let tempPageView = '';
        let tempNoteView = '';
        let tempNoteTitle = '';
        let hasNotes = false;
        if(tempSelectedNotebook.selectedPage.texts.length > 0){
            tempPageView = this.readOnlyPageDisplay(tempSelectedNotebook.selectedPage)
            tempNoteView= this.readOnlyNoteDisplay(tempSelectedNotebook.selectedPage.texts[tempSelectedNotebook.selectNoteValue]);
            tempNoteTitle = tempSelectedNotebook.selectedPage.texts[tempSelectedNotebook.selectNoteValue].title;
            hasNotes = true;
        };
        this.setState({
            Notebooks: tempNotebook,
            pageView: tempPageView,
            noteView:tempNoteView,
            noteTitle:tempNoteTitle,
            isNewNote: !hasNotes,
        });
    }

    selectNote() {
        /*update the selected note*/
        this.mydebug("selectNote");
        let tempSelected = document.getElementById("selectNote");
        let id = Number(tempSelected.options[tempSelected.selectedIndex].value);
        let tempNotebook = this.state.Notebooks;
        let tempSelectedNotebook = tempNotebook[this.state.selectedNotebookValue];
        let temp = tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue];

        tempSelectedNotebook.selectNoteValue = id;
        console.log(tempSelectedNotebook)
        let tempdisplay = this.readOnlyNoteDisplay(temp.texts[id])
        this.setState({
            Notebooks: tempNotebook,
            noteView: tempdisplay,
            noteTitle: temp.texts[id].title,
        });
    }

    //util
    myRefresh() {
        this.mydebug("myRefresh");
        this.setState({
            mainText: ''
        });
    }
    dropDownListCreator(temp) {
        this.mydebug('dropDownListCreator');
        let templist = [];
        let count = 0;
        temp.forEach((a) => {
            if (a != undefined) {
                let b = {
                    name: a.title,
                    position: count
                }
                templist.push(b);
                count++;
            }

        });
        return templist;
    }
    onOff(event) {
        /*Hides the text section of a note in the list*/
        this.mydebug("onOff");
        if (event != undefined) {
            let id = event.target.id;
            let temp = this.state.selectedPage;
            temp.texts.forEach((a) => {
                if (a.id == id) {
                    switch (a.visible) {
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

        }

    }
    test() {
        let value = !this.state.isEncrypt;
        this.setState({
            isEncrypt: value
        });
    }

    //HandleChanges
    handleChange(event) {
        //This will handle any state that is not an object or part of an array I pass in the name of the state value and assign that and then assign the value 
        //this is helpful because then I only need one handleChange for at least these simple changes.
        let target = event.target;
        let value = target.value;
        let name = target.name;
        console.log(name);
        let temp = {};
        let tempNotebooks = this.state.Notebooks;
        let tempSelectedNotebook = this.state.Notebooks[this.state.selectedNotebookValue];
        tempSelectedNotebook[name] = value;
        console.log(tempSelectedNotebook);
        tempNotebooks[this.state.selectedNotebookValue] = tempSelectedNotebook;
        this.setState({
            Notebooks: tempNotebooks
        });
        if (name === 'title') {
            this.save();
        }
    }
    handlePageNameChange(event) {
        //This handles the name change for a page
        let target = event.target;
        let value = target.value;
        let tempNotebooks = this.state.Notebooks;
        let tempSelectedNotebook = this.state.Notebooks[this.state.selectedNotebookValue];
        tempSelectedNotebook.selectedPage.name = value;
        tempNotebooks[this.state.selectedNotebookValue] = tempSelectedNotebook;
        this.setState({
            Notebooks: tempNotebooks
        });
            this.save();
    }
    handleNoteTitleChange(event) {
        //This handles the name change for a note
        let target = event.target;
        let value = target.value;
        let tempNotebooks = this.state.Notebooks;
        let tempSelectedNotebook = this.state.Notebooks[this.state.selectedNotebookValue];
        tempSelectedNotebook.selectedPage.texts[tempSelectedNotebook.selectNoteValue].title = value;
        tempNotebooks[this.state.selectedNotebookValue] = tempSelectedNotebook;
        this.setState({
            Notebooks: tempNotebooks,
            noteTitle: value,
        });
            this.save();
    }
    handleNoteSectionEditChange(event) {
        //This will handle any state that is not an object or part of an array I pass in the name of the state value and assign that and then assign the value 
        //this is helpful because then I only need one handleChange for at least these simple changes.
        let target = event.target;
        let value = target.value;
        let name = target.name;
        let textIndex = Number(target.id.replace('textarea', ''));
        let selectedIndex = Number(this.state.selectedPage.section) - 1;

        let tempSelected = this.state.selectedPage;
        let tempList = this.state.PageList;
        tempSelected.texts[textIndex].text = value;
        tempList[selectedIndex] = tempSelected;

        this.setState({
            PageList: tempList,
            selectedPage: tempSelected
        });
    }

    handleChangeNoteEdit(event){
        let target = event.target;
        let value = target.value;
        let tempNotebooks = this.state.Notebooks;
        let tempSelectedNotebook = this.state.Notebooks[this.state.selectedNotebookValue];
        tempSelectedNotebook.selectedPage.texts[tempSelectedNotebook.selectNoteValue].text = value;
        tempNotebooks[this.state.selectedNotebookValue] = tempSelectedNotebook;
        this.setState({
            Notebooks: tempNotebooks,
        });
    }

    //Display

    readOnlyPageDisplay(textPass) {
        let temp= []
        temp.push(textPass)
        return textPass.texts.map((a) =>
            <pre>{a.text}</pre>
        );
    }
    readOnlyNoteDisplay(textPass) {
        let temp = [];
        temp.push(textPass);
        return temp.map((a) =>
            <pre>{a.text}</pre>
        );
    }

    //Tag
    globalTagAssign() {
        let tempNotebooks = this.state.Notebooks;
        let tempSelectedNotebooks = this.state.Notebooks[this.state.selectedNotebookValue];
        let globalTemp = [...tempSelectedNotebooks.globalTagList];
        let pageTemp = [...tempSelectedNotebooks.PageList];
        let pageListTemp = [];
        pageTemp.forEach((a) => {
            let noteListTemp = [];
            a.texts.forEach((c) => {
                let tempTag = c.tags;
                c.text.split(' ').forEach((d) => {
                    globalTemp.forEach((b) => {
                        if (d === b) {
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
        tempSelectedNotebooks.PageList = pageListTemp;
        tempNotebooks[this.state.selectedNotebookValue] = tempSelectedNotebooks;
        this.setState({
            Notebooks: tempNotebooks
        });
    }
    tagAssign() {
        this.mydebug('tagAssign');
        let tempSelectedNotebook = this.state.selectedNotebook;
        let textarea = document.getElementById("awesometextarea");
        let formatted = '';
        let len = textarea.value.length;
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        let sel = textarea.value.substring(start, end);
        let replace = '*-' + sel;

        textarea.value = textarea.value.substring(0, start) + replace + textarea.value.substring(end, len);
        formatted = textarea.value;
        tempSelectedNotebook.mainText = formatted;
        this.setState({
            selectedNotebook: tempSelectedNotebook
        });

    }


    render() {
        
        let selectedNotebook = this.state.Notebooks[this.state.selectedNotebookValue];
        var notebookSelect = undefined;
        var pageSelection = undefined;
        var noteSelection = undefined;
        if (this.state.Notebooks.length > 0) {

            if (this.state.Notebooks != undefined && this.state.Notebooks.length > 0) {
                notebookSelect = this.state.Notebooks.map((e) =>
                    <option key={e.ID} value={e.ID}>
                        {e.title}  ({e.date}) - {e.PageList.length}
                    </option>
                );
            }
            //Note Section
            if (selectedNotebook.PageList != undefined && selectedNotebook.PageList.length > 0) {
                pageSelection = selectedNotebook.PageList.map((e) =>
                    <option key={e.section} value={e.section}>
                        {e.name}  ({e.date}) - {e.texts.length}
                    </option>
                );
            }
            let pageIndex = selectedNotebook.selectedPageValue ;
            let pagelist = selectedNotebook.PageList[pageIndex];
            if (pagelist != undefined && pagelist.texts != undefined) {
                var pageName = pagelist.name;
                noteSelection = pagelist.texts.map((e) =>
                    <option key={e.id} value={e.id}>
                        {e.id + 1} : {e.title} ({e.date} : {e.time})
                </option>
                );
            }
        }
        var code;
        if ((!this.state.isUploaded && !this.state.isNew)) {
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
        } else {
            code = (
                <div className="notebook-wrapper basic">
                    <div className="notebook">
                        <OverviewComponent handleChange={this.handleChange}
                            DeleteNotebook={this.DeleteNotebook}
                            title={this.state.Notebooks[this.state.selectedNotebookValue].title}
                            originalTitle={this.state.Notebooks[this.state.selectedNotebookValue].originalTitle}
                            selected={this.state.selected}
                            selectNotebook={this.selectNotebook}
                            notebookSelect={notebookSelect}
                            saveLoad={this.saveLoad}
                            addNotebook={this.addNotebook}
                            downloadNoteFile={this.downloadNoteFile}
                            selectedNotebookValue={this.state.selectedNotebookValue} />
                        <div className="page-wrapper">
                            <div className="page-col-one-wrapper ">
                                    <PageComponent 
                                        handlePageNameChange={this.handlePageNameChange}
                                        handleChange={this.handleChange}
                                        title={this.state.Notebooks[this.state.selectedNotebookValue].selectedPage.name}
                                        Notebooks={this.state.Notebooks}
                                        selectedNotebookValue={this.state.selectedNotebookValue}
                                        selectPage={this.selectPage}
                                        pageSelection={pageSelection}
                                        addPage={this.addPage}
                                        PageDelete={this.PageDelete}
                                        isNewPage = {this.state.isNewPage}
                                    />
                                   <AwesomeTextBoxComponent 
                                        handleChange={this.handleChange}
                                        selected={this.state.Notebooks[this.state.selectedNotebookValue].selectedPage}
                                        Notebooks={this.state.Notebooks}
                                        selectedNotebookValue={this.state.selectedNotebookValue}
                                        tagAssign={this.tagAssign}
                                        addNote={this.addNote}
                                   />
                                   <NoteComponent
                                        selectNote={this.selectNote}
                                        Notebooks={this.state.Notebooks}
                                        selectedNotebookValue = {this.state.selectedNotebookValue}
                                        noteSelection = {noteSelection}
                                        noteTitle = {this.state.noteTitle}
                                        handleNoteTitleChange = {this.handleNoteTitleChange}
                                        noteView = {this.state.noteView}
                                        isNewNote = {this.state.isNewNote}
                                        noteEdit ={this.state.noteEdit}
                                        editNote = {this.editNote}
                                        handleChangeNoteEdit = {this.handleChangeNoteEdit}
                                        texts = {this.editNote ?this.state.Notebooks[this.state.selectedNotebookValue].selectedPage.texts : ''}
                                        textIndex = {this.state.Notebooks[this.state.selectedNotebookValue].selectNoteValue}
                                        saveNote = {this.saveNote}
                                        removeNote={this.removeNote}
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
    }

    render() {
        return (
            <div className="wrapper">
                <div className="new">
                    <button onClick={this.props.addNotebook} >New Notebook</button>
                </div>
                <div className="crypt">
                    <label htmlFor="yours">Key:</label>
                    <input type="text" name='yours' value={this.props.yours} onChange={this.props.handleChange} style={{ visibility: this.props.isEncrypt ? 'visible' : 'hidden' }} />
                </div>
                <div className="upload">
                    <input id="upload" type="file" />
                    <button onClick={this.props.upload}>Upload</button>
                    <label htmlFor="encryptCheck">Encrypt:</label>
                    <input type='checkbox' name="encryptCheck" value={this.props.isEncrypt} onClick={this.props.test} />
                </div>
            </div>

        );
    }
}


class OverviewComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="OverviewWrapper">
                <div className="TitleSection">
                    <label htmlFor="title">Notebook:</label>
                    <select id="PageListDD" onChange={this.props.selectNotebook} value={this.props.selectedNotebookValue}>
                        {this.props.notebookSelect}
                    </select>
                    <input type="text" id="title" name="title" value={this.props.title} onChange={this.props.handleChange} />
                </div>
                <div className="notebooklist">
                    <button onClick={this.props.DeleteNotebook}>{'Remove Notebook'}</button>
                    <button onClick={this.props.addNotebook}>{'Add Notebook'}</button>
                    <button onClick={this.props.downloadNoteFile}>Export</button>

                </div>
            </div>
        );
    }
}


class PageComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        var code = this.props.isNewPage ? 
        (
            <div>
                <label htmlFor="title">Page:</label>
                <button onClick={this.props.addPage}>New Page</button>
            </div>
        ) : (
         
         <div>
             <label htmlFor="title">Page:</label>
             <select id="selectPage" onChange={this.props.selectPage} value={this.props.Notebooks[this.props.selectedNotebookValue].selectedPageValue}>
                 {this.props.pageSelection}
             </select>
             <input type="text" id="title" name="title" value={this.props.title} onChange={this.props.handlePageNameChange} />
             <button onClick={this.props.PageDelete} id={this.props.Notebooks[this.props.selectedNotebookValue].selectedPage.section}>Remove Page</button>
             <button onClick={this.props.addPage}>New Page</button>
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
    }

    render() {
        var code;
        if(this.props.isNewNote){
            code = (
                <div>
                    <label>Note:</label>
                </div>
            )
        }else if(this.props.noteEdit){
            code = (
                <div>
                   <label>Note:</label>
                   <div id="notes">
                       <select id="selectNote" onChange={this.props.selectNote} value={this.props.Notebooks[this.props.selectedNotebookValue].selectNoteValue}>
                           {this.props.noteSelection}
                       </select>                                        
                       <input type="text" id="title" name="title" value={this.props.noteTitle} onChange={this.props.handleNoteTitleChange} />
                        <button onClick={this.props.saveNote} id="noteSave">Save</button>
                        <button onClick={this.props.removeNote} value={this.props.Notebooks[this.props.selectedNotebookValue].selectNoteValue} id={this.props.Notebooks[this.props.selectedNotebookValue].selectNoteValue}>Remove Note</button>
                       <div className="TheNote">
                           <div className="readOnlyDisplay">
                                <textarea id="editNoteTextArea" value={this.props.texts[this.props.textIndex].text} rows="10" cols="100" onChange={this.props.handleChangeNoteEdit} />                    
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
                       <select id="selectNote" onChange={this.props.selectNote} value={this.props.Notebooks[this.props.selectedNotebookValue].selectNoteValue}>
                           {this.props.noteSelection}
                       </select>                                        
                       <input type="text" id="title" name="title" value={this.props.noteTitle} onChange={this.props.handleNoteTitleChange} />
                        <button onClick={this.props.editNote} id="noteEdit">Edit</button>
                        <button onClick={this.props.removeNote} value={this.props.Notebooks[this.props.selectedNotebookValue].selectNoteValue} id={this.props.Notebooks[this.props.selectedNotebookValue].selectNoteValue}>Remove Note</button>
                        <div className="TheNote">
                           <div className="readOnlyDisplay">
                               {this.props.noteView}
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
    }

    render() {
        return (
            <div className="awesome-wrapper">
                <div className="awesome-col-one">
                    <h2>Awesome Text Box for Page {this.props.selected.name}</h2>
                    <div>
                        <textarea className='main-text' name="mainText" id="awesometextarea" value={this.props.Notebooks[this.props.selectedNotebookValue].mainText} onChange={this.props.handleChange} rows="10" cols="50" />
                    </div>
                    <div>                        
                        <button onClick={this.props.addNote} id={this.props.selected.section}>Add Note</button>
                    </div>
                </div>
            </div>
        );
    }
}


/* not base function

                    <div>
                        <button onClick={this.props.tagAssign}>Tag</button>
                    </div>

*/


                /*  <div className="wrapper">
                          <div className ="TheAwesomeTextBox">                    
                              <div className="wrapper">
                                  <div className="SectionThreeATB">
                                      <div className="Overview"> 
                                          <OverviewComponent  handleChange={this.handleChange} 
                                                              DeleteNotebook={this.DeleteNotebook} 
                                                              title={this.state.Notebooks[this.state.selectedNotebookValue].title}
                                                              originalTitle ={this.state.Notebooks[this.state.selectedNotebookValue].originalTitle}
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
                                                  <textarea className='main-text' name="mainText" id="awesometextarea" value={this.state.Notebooks[this.state.selectedNotebookValue].mainText} onChange={this.handleChange} rows="10" cols="50"/>
                                              </div>                            
                                              <div>
                                                  <button onClick={this.tagAssign}>Tag</button>
                                                  <button onClick={this.addNote} id={selected.section}>Add Note</button>
                                              </div>             
                                          </div>
                                          
                                  </div>
                                  <div className="SectionTwoATB">
                                          <div className="TheAwesomeTextBoxChild" id="NoteSectionList">
                                              <select id="selectPage"  onChange={this.selectPage} value={this.state.Notebooks[this.state.selectedNotebookValue].selectedPageValue}>
                                                  {pageSelection}
                                              </select>
                                              <div>
                                                  <input type="text" name="pageName" value={this.state.Notebooks[this.state.selectedNotebookValue].pageName} onChange={this.handleChange}/>
                                                  <button onClick={this.addPage}>New Page</button>
                                              </div> 
                                              <div id="info_section">
                                                  <label>{this.state.Notebooks[this.state.selectedNotebookValue].selectedPage.name}</label> 
                                                  <button onClick={this.PageDelete} id={this.state.Notebooks[this.state.selectedNotebookValue].selectedPage.section}>Remove Page</button>
                                              </div>
                                          </div>
                                      <div className="NoteSection" >
                                              <div id="notes">
                                              <select id="selectNote" onChange={this.selectNote} value={this.state.Notebooks[this.state.selectedNotebookValue].selectNoteValue}>
                                                  {noteSelection}
                                              </select>
                                              <div className="readOnlyDisplay">
                                                  {this.state.noteView}
                                              </div>
                                              </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="TheNote">
                              <div className="readOnlyDisplay">
                                  {this.state.pageView}
                              </div>
                          </div>
                  </div>
*/

/*
tempNotebook



                                <div className="page-col-one-row-three">
                                    <label>Note:</label>
                                    <div id="notes">
                                        <select id="selectNote" onChange={this.selectNote} value={this.state.Notebooks[this.state.selectedNotebookValue].selectNoteValue}>
                                            {noteSelection}
                                        </select>                                        
                                        <input type="text" id="title" name="title" value={this.state.noteTitle} onChange={this.handleNoteTitleChange} />
                                       <div className="TheNote">
                                       <div className="readOnlyDisplay">
                                            {this.state.noteView}
                                        </div>
                                       </div>
                                       
                                    </div>

                                </div>
*/