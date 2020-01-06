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
        };


        //Hub Section
        this.load = this.load.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.upload = this.upload.bind(this);
        //Note Section
        this.handlePageNameChange = this.handlePageNameChange.bind(this);
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
            let temping = this.state.Notebooks;
            temp.forEach((a) => {
                temping.push(a);
            });
            this.setState({
                Notebooks: temp,
                //selectedNotebook: temp[0],
                selectedNotebookValue: 0,
                //PageListDD: templist,
                isUploaded: true
            });
            this.load();
        } catch (err) {
            console.log('catch');
            console.log(err);

        }
    }
    downloadNoteFile = () => {
        const x = document.createElement("a");
        let temp = JSON.stringify(this.state.Notebooks);
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

        let index = this.state.selectedNotebook.ID;
        let tempNotebookList = this.state.Notebooks;
        let tempDNotebookList = this.state.DeletedNotebooks;
        let deletedNotebook = tempNotebookList[index];
        tempDNotebookList.push(deletedNotebook);
        tempNotebookList.splice(index, 1);
        for (let x = index; x < tempNotebookList.length; x++) {
            tempNotebookList[x].ID = x;
        }
        let templist = this.dropDownListCreator(tempNotebookList);
        this.setState({
            Notebooks: tempNotebookList,
            DeletedNotebooks: tempDNotebookList,
            selectedNotebook: tempNotebookList[0],
            selectedNotebookValue: 0,
        });
        this.save();

    }
    PageDelete(e) {
        this.mydebug('PageDelete')
        let target = e.target;
        let index = target.id - 1;
        let tempPageList = new Array();
        tempPageList = this.state.PageList;
        let tempDPageList = this.state.DeletedPageList;
        let deletedPage = tempPageList[index];
        tempDPageList.push(deletedPage);
        tempPageList.splice(index, 1);
        for (let x = index; x < tempPageList.length; x++) {
            tempPageList[x].section = x + 1;
        }
        let newIndex = index < tempPageList.length ? index : tempPageList.length - 1;
        this.setState({
            PageList: tempPageList,
            DeletedPageList: tempDPageList,
            selectedPage: tempPageList[newIndex],
            selectPageValue: index
        });
        this.save();
        //this.setText(newIndex)
    }
    NoteTextDelete(e) {
        let target = e.target;
        let index = target.id;
        let selectedIndex = Number(this.state.selectedPage.section) - 1;
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
        let tempNotebooks = this.state.Notebooks;
        let selectedNotebookIndex = this.state.selectedNotebookValue;
        let tempSelectedNotebook = tempNotebooks[selectedNotebookIndex];
        //var templateList = tempSelectedNotebook.pageName.split(";");
        //templateList.forEach((name) => {
            let hv = tempSelectedNotebook.PageList.length > 0 ? true : false;
            let temp = tempSelectedNotebook;
            let os = hv ? temp.PageList[temp.PageList.length - 1] : 0;
            let ns = hv ? os.section + 1 : os + 1;
            let tempObj = {
                name: '<New Page>',
                section: ns,
                texts: [],
                deletedTexts: []
            }
            temp.pageName = '';
            temp.selectedPage = tempObj;
            temp.selectedPageValue = ns;
            temp.selectedNote = {};
            temp.PageList.push(tempObj);
            tempNotebooks[selectedNotebookIndex] = temp;
            this.setState({
                Notebooks: tempNotebooks
            });
            this.save();
        //});
    }
    addNotebook() {
        this.mydebug('addNotebook');
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
            selectedDisplayText: '',
            globalTagList: [],
            isNew: true
        });
        tempList.push(singleObj);
        this.setState({
            Notebooks: tempList,
            selectedNotebookValue: tempID,
            isNew: true
        });

    }
    addNote(event) {
        console.log(event.target.id);
        /*add a note section.*/
        this.mydebug("addNote");
        let tempNotebooks = this.state.Notebooks;
        let tempSelectedNotebook = this.state.Notebooks[this.state.selectedNotebookValue];
        let globaltaglist = tempSelectedNotebook.globalTagList;
        let dataIndex = tempSelectedNotebook.selectedPageValue - 1;// Number(event.target.id);
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
                text: tempText.replace(/(\*\-)/g, '') + "\n",
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                date: d.getMonth() + '/' + d.getDay() + '/' + d.getFullYear(),
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
            this.setState({
                Notebooks: tempNotebooks,
                pageView: tempPageDisplay,
                noteView: tempNoteDisplay,
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

    //save
    async save() {
        this.mydebug('save');
        let selectedListItem = this.state.Notebooks[this.state.selectedNotebookValue];
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
                globalTagList: selectedListItem.globalTagList,
                selectedPageValue: selectedListItem.selectedPageValue,
                selectedNote: selectedListItem.selectedNote,
                selectNoteValue: selectedListItem.selectNoteValue,
                selectedNotebookValue: this.state.selectedNotebookValue
            });
            await this.setState({
                Notebooks: xlist,
            });
        }

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

    selectNotebook() {
        this.mydebug("selectNotebook");
        let tempSelected = document.getElementById("PageListDD");
        let id = Number(tempSelected.options[tempSelected.selectedIndex].value);
        let selectedTempNotebook = {};
        selectedTempNotebook = this.state.Notebooks[id].selectedNotebook;
        console.log(selectedTempNotebook);
        this.setState({
            selectedNotebook: selectedTempNotebook,
            selectedNotebookValue: id
        });
        this.load();
    }

    selectPage() {
        /*update the selected page*/
        this.mydebug("selectPage");
        let tempSelected = document.getElementById("selectPage");
        let id = Number(tempSelected.options[tempSelected.selectedIndex].value);
        let dataIndex = id - 1;
        let selectedTemp = {};
        console.log(id);
        let tempNotebook = this.state.Notebooks;
        let tempSelectedNotebook = tempNotebook[this.state.selectedNotebookValue];
        tempSelectedNotebook.selectedPage = tempSelectedNotebook.PageList[dataIndex];
        tempSelectedNotebook.selectedPageValue = id;
        console.log(tempSelectedNotebook);
        if(tempSelectedNotebook.selectedPage.texts.length > 0){
            var tempPageView = this.readOnlyPageDisplay(tempSelectedNotebook.selectedPage)
            console.log(tempSelectedNotebook.selectNoteValue);
            var tempNoteView= this.readOnlyNoteDisplay(tempSelectedNotebook.selectedPage.texts[tempSelectedNotebook.selectNoteValue]);
            console.log(tempNotebook);

        };
        this.setState({
            Notebooks: tempNotebook,
            pageView: tempPageView,
            noteView:tempNoteView
        });
    }

    selectNote() {
        /*update the selected note*/
        this.mydebug("selectNote");
        let tempSelected = document.getElementById("selectNote");
        let id = Number(tempSelected.options[tempSelected.selectedIndex].value);
        let tempNotebook = this.state.Notebooks;
        let tempSelectedNotebook = tempNotebook[this.state.selectedNotebookValue];
        let temp = tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue - 1];

        tempSelectedNotebook.selectNoteValue = id;
        console.log(tempSelectedNotebook)
        let tempdisplay = this.readOnlyNoteDisplay(temp.texts[id])
        this.setState({
            Notebooks: tempNotebook,
            noteView: tempdisplay
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
        let temp = {};
        let tempNotebooks = this.state.Notebooks;
        let tempSelectedNotebook = this.state.Notebooks[this.state.selectedNotebookValue];
        tempSelectedNotebook[name] = value;
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
        
        //var SelectedPage = this.state.Notebooks[this.state.selectedNotebookValue].PageList.length > 0 ? this.state.Notebooks[this.state.selectedNotebookValue].selectedPage : {};
        let selectedNotebook = this.state.Notebooks[this.state.selectedNotebookValue];
        var notebookSelect = undefined;
        var pageSelection = undefined;
        var noteSelection = undefined;
        if (this.state.Notebooks.length > 0) {

            if (this.state.Notebooks != undefined && this.state.Notebooks.length > 0) {
                notebookSelect = this.state.Notebooks.map((e) =>
                    <option key={e.ID} value={e.ID}>
                        {e.title} - {e.PageList.length}
                    </option>
                );
            }
            //Note Section
            if (selectedNotebook.PageList != undefined && selectedNotebook.PageList.length > 0) {
                pageSelection = selectedNotebook.PageList.map((e) =>
                    <option key={e.section} value={e.section}>
                        {e.name} - {e.texts.length}
                    </option>
                );
            }
            console.log('noteSelection');
            let pageIndex = selectedNotebook.selectedPageValue - 1;
            let pagelist = selectedNotebook.PageList[pageIndex];
            if (pagelist != undefined && pagelist.texts != undefined) {
                var pageName = pagelist.name;
                noteSelection = pagelist.texts.map((e) =>
                    <option key={e.id} value={e.id}>
                        {e.id + 1}: {pageName} ({e.date})
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
                                    <PageComponent handlePageNameChange={this.handlePageNameChange}
                                        handleChange={this.handleChange}
                                        title={this.state.Notebooks[this.state.selectedNotebookValue].selectedPage.name}
                                        Notebooks={this.state.Notebooks}
                                        selectedNotebookValue={this.state.selectedNotebookValue}
                                        selectPage={this.selectPage}
                                        pageSelection={pageSelection}
                                        addPage={this.addPage}
                                        PageDelete={this.PageDelete}
                                    />
                                   <AwesomeTextBoxComponent 
                                        handleChange={this.handleChange}
                                        selected={this.state.Notebooks[this.state.selectedNotebookValue].selectedPage}
                                        Notebooks={this.state.Notebooks}
                                        selectedNotebookValue={this.state.selectedNotebookValue}
                                        tagAssign={this.tagAssign}
                                        addNote={this.addNote}
                                   />
                                <div className="page-col-one-row-three">
                                    <label>Note:</label>
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
                            <div className="pag-col-two-wrapper">
                                <div className="page-col-two">
                                    <label>Page View:</label>

                                    <div className="TheNote">
                                        <div className="readOnlyDisplay">
                                            {this.state.pageView}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
                  </div>*/
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
tempNotebook
*/

class LandingPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="wrapper">
                <div className="new">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" value={this.props.title} onChange={this.props.handleChange} />
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
        return (
            <div className="page-inner-wrapper">
                <div className="page-inner-col-one">
                    <label htmlFor="title">Page:</label>
                    <select id="selectPage" onChange={this.props.selectPage} value={this.props.Notebooks[this.props.selectedNotebookValue].selectedPageValue}>
                        {this.props.pageSelection}
                    </select>
                    <input type="text" id="title" name="title" value={this.props.title} onChange={this.props.handlePageNameChange} />
                    <button onClick={this.props.PageDelete} id={this.props.Notebooks[this.props.selectedNotebookValue].selectedPage.section}>Remove Page</button>
                    <button onClick={this.props.addPage}>New Page</button>
                </div>
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
                        <button onClick={this.props.tagAssign}>Tag</button>
                    </div>
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
