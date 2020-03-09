import React, { Component } from 'react';
import './css/awesome-hub.css';
import { readOnlyPageDisplay,readOnlyNoteDisplay } from './shared/util';
import { clone, parenthesizedExpression } from '@babel/types';

export class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.upload = this.upload.bind(this);
        this.landingNotebookAdd = this.landingNotebookAdd.bind(this);
    }
    landingNotebookAdd() {
        let d = new Date();
        let tempList = [];
        let tempID = 0;
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
        let obj ={
            Notebooks: tempList,
            DeletedNotebooks: [],
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
            let tempSelectedNotebook = temp.selectedNotebookValue != undefined ? temp.selectedNotebookValue : 0;
            let tempDeletedNotebooks = temp.DeletedNotebooks;
           let hasPages = false;
           let tempPageView = '';
           let hasNotes = false;
           let tempNoteView = '';
           let noteTitleCheck = '';
           if(tempNotebooks[tempSelectedNotebook].PageList.length > 0){
                hasPages = true;
                let selectedPage = tempNotebooks[tempSelectedNotebook].selectedPageValue != undefined ? tempNotebooks[tempSelectedNotebook].selectedPageValue : 0;
                tempPageView = readOnlyPageDisplay(tempNotebooks[tempSelectedNotebook].PageList[selectedPage]);
                if(tempNotebooks[tempSelectedNotebook].PageList[selectedPage].texts.length > 0){
                    hasNotes = true;
                    let selectedNote = tempNotebooks[tempSelectedNotebook].PageList[selectedPage].selectedNoteValue != undefined ? tempNotebooks[tempSelectedNotebook].PageList[selectedPage].selectedNoteValue : 0;
                    noteTitleCheck = tempNotebooks[tempSelectedNotebook].PageList[selectedPage].texts[selectedNote].title;
                    tempNoteView = readOnlyNoteDisplay(tempNotebooks[tempSelectedNotebook].PageList[selectedPage].texts[selectedNote]);
                }          
           }
           
            let obj = {
                Notebooks: tempNotebooks,
                DeletedNotebooks: tempDeletedNotebooks,
                selectedNotebookValue: tempSelectedNotebook,
                isUploaded: true,
                isNewPage: !hasPages,
                isNewNote: !hasNotes,
                noteTitle: noteTitleCheck,
                pageView: tempPageView,
                noteView: tempNoteView,
            };
            this.props.landingUpload(obj);
        } catch (err) {

        }
    }

    render() {
        return (
            <div className="wrapper">
                <div>
                    <button onClick={this.landingNotebookAdd} >New Notebook</button>
                </div>
                <div>
                    <input id="upload" type="file" />
                    <button onClick={this.upload}>Upload</button>
                </div>
            </div>

        );
    }
}