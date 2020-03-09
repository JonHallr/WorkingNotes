import React, { Component } from 'react';
import './css/awesome-hub.css';
import { readOnlyPageDisplay,readOnlyNoteDisplay } from './shared/util';
import { clone, parenthesizedExpression } from '@babel/types';
import cloneDeep from 'lodash/cloneDeep';
export class PageComponent extends Component {
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

        this.menuToggle = this.menuToggle.bind(this);
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
            for (let x = 0; x < temp.length; x++) {
                temp[x].pageNumber = x;
            }
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
            this.menuToggle()

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
            notebooks[copyToNotebook].selectedNoteValue = notebooks[pageStateObj.selectedNotebookValue].selectedNoteValue;
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
        };
        this.setState({
            pageNumber: 1,
            notebookNumber: 0,
            copyToSet: false,
            moveToSet: false,

        });

        this.props.pageComponentSave(obj);
        this.menuToggle()
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
        tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].name = value;
        tempNotebooks[notebookIndex] = tempSelectedNotebook;

        this.props.pageComponentHandleChange(tempNotebooks);
    }
    selectPage(event) {
        let pageStateObj = this.props.stateObj;
        let target = event.target;
        let value = Number(target.value);
        let id = value;
        let tempNotebook = pageStateObj.Notebooks;
        let tempSelectedNotebook = tempNotebook[pageStateObj.selectedNotebookValue];
        tempSelectedNotebook.selectedPageValue = id;
        tempNotebook[pageStateObj.selectedNotebookValue] = tempSelectedNotebook;
        let tempPageView = '';
        let tempNoteView = '';
        let tempNoteTitle = '';
        let hasNotes = false;
        if(tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].texts.length > 0){
            let noteId = Number(tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].selectedNoteValue) > 0 ? Number(tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].selectedNoteValue) : 0;
            tempPageView = readOnlyPageDisplay(tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue])
            tempNoteView= readOnlyNoteDisplay(tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].texts[noteId]);
            tempNoteTitle = tempSelectedNotebook.PageList[tempSelectedNotebook.selectedPageValue].texts[noteId].title;
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
            tempSelectedNotebook.selectedPageValue = tempObj.pageNumber;
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
            };
            this.props.pageComponentSave(obj);
            if(!pageStateObj.isNewPage){
                this.menuToggle()
            }
            
    }

    removePage() {
        let pageStateObj = this.props.stateObj;

        let index = pageStateObj.selectedNotebookValue;
        let tempNotebookList = pageStateObj.Notebooks;
        let pageIndex = tempNotebookList[index].selectedPageValue;
        let tempSelectedNotebook = tempNotebookList[index];

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
            tempPageView = readOnlyPageDisplay(tempNotebookList[index].PageList[pageIndex]);
            if(tempNotebookList[index].PageList[pageIndex].texts.length > 0){
                tempNoteView= readOnlyNoteDisplay(tempNotebookList[index].PageList[pageIndex].texts[tempNotebookList[index].PageList[pageIndex].selectedNoteValue]);
                tempNoteTitle = tempNotebookList[index].PageList[pageIndex].texts[tempNotebookList[index].PageList[pageIndex].selectedNoteValue].title;
                hasNotes = true;
            };
        }else{
            tempNotebookList[index].PageList = [];
            tempNotebookList[index].DeletedPageList = tempDPageList;
            tempNotebookList[index].selectedPageValue = undefined;
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
        this.menuToggle()
    }
    menuToggle(){
        document.getElementById("pageDrop").classList.toggle("show");
    }
    



    render() {
        var pageStateObj = this.props.stateObj;
        var pageSelection = [];
        if (pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList != undefined && pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList.length > 0) {
            pageSelection = pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList.map((e) =>
                <option key={e.pageNumber} value={e.pageNumber}>
                    {e.name}  ({e.date}) - {e.texts.length}
                </option>
            );
        }
        var code;
        if(pageStateObj.isNewPage){
           code = (
                <div>
                    <label className="label-header">Page:</label>
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
                <label className="label-header">Page: </label>
                    <div className="inner">
                    <div>
                        <select id="selectPage" onChange={this.selectPage} value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue}>
                            {pageSelection}
                        </select>
                        <input type="text" id="title" name="title" value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList[pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue].name} onChange={this.handlePageNameChange} />
                    <button className="dropbtn" onClick={this.menuToggle}>
                        <i class="fa fa-bars fa-lg"></i>
                    </button>
                            <div className="dropdown-content" id="pageDrop">
                                <button onClick={this.removePage} id={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList[pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue].pageNumber}>Remove Page</button>
                                <button onClick={this.addPage}>New Page</button>
                                <button onClick={this.copyToSet}>Copy To</button>
                                <button onClick={this.moveToSet}>Move To</button>
                            </div>
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
                <label className="label-header">Page: </label>
                    <div className="inner">
                    <div>
                        <select id="selectPage" onChange={this.selectPage} value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue}>
                            {pageSelection}
                        </select>
                        <input type="text" id="title" name="title" value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList[pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue].name} onChange={this.handlePageNameChange} />
                    <button className="dropbtn" onClick={this.menuToggle}>
                        <i class="fa fa-bars fa-lg"></i>
                    </button>
                            <div className="dropdown-content" id="pageDrop">
                                <button onClick={this.removePage} id={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList[pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue].pageNumber}>Remove Page</button>
                                <button onClick={this.addPage}>New Page</button>
                                <button onClick={this.copyToSet}>Copy To</button>
                                <button onClick={this.moveToSet}>Move To</button>
                            </div>
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
                    
                </div>

           )
        }else{
           code = (
                <div>
                    <label className="label-header">Page: </label>
                    <div className="inner">
                    <select id="selectPage" onChange={this.selectPage} value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue}>
                        {pageSelection}
                    </select>
                    <input type="text" id="title" name="title" value={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList[pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue].name} onChange={this.handlePageNameChange} />
                    <button className="dropbtn" onClick={this.menuToggle}>
                        <i class="fa fa-bars fa-lg"></i>
                    </button>
                            <div className="dropdown-content" id="pageDrop">
                                <button onClick={this.removePage} id={pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].PageList[pageStateObj.Notebooks[pageStateObj.selectedNotebookValue].selectedPageValue].pageNumber}>Remove Page</button>
                                <button onClick={this.addPage}>New Page</button>
                                <button onClick={this.copyToSet}>Copy To</button>
                                <button onClick={this.moveToSet}>Move To</button>
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


