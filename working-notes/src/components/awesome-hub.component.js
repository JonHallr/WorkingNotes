import React, { Component } from 'react';
import './css/awesome-hub.css';
import { readOnlyPageDisplay, readOnlyNoteDisplay } from './shared/util';
import { clone, parenthesizedExpression } from '@babel/types';

import cloneDeep from 'lodash/cloneDeep';

import { LandingPage } from './landing-page';
import { NoteComponent } from './note-component';
import { NotebookComponent } from './notebook-component';
import { PageComponent } from './page-component';
import { PageViewComponent } from './page-view';

export class AwesomeHubComponent extends Component {

    constructor(props) {
        super(props);
        this.stateChange = props.stateChange || new Function();

        this.state = {
            Notebooks: [], //Main note list
            DeletedNotebooks: [],
            selectedNotebookValue: 0,
            isUploaded: false,
            pageView: '',
            noteView: '',
            noteTitle: '',
            isNewPage: true,
            isNewNote: true,
            noteEdit: false,
            freshNotebook: false,
            displayPageView: false,
        };

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

        this.changeView = this.changeView.bind(this);

    }
    pageComponentHandleChange(e) {
        this.setState({
            Notebooks: e
        });


        this.save();
    }
    pageComponentSave(e) {
        this.setState({
            Notebooks: e.Notebooks,
            pageView: e.pageView,
            noteView: e.noteView,
            noteTitle: e.noteTitle,
            isNewNote: e.isNewNote,
            isNewPage: e.isNewPage,
        });
        this.save();
    }
    NotebookComponentHandleChange(e) {
        this.setState({
            Notebooks: e
        });
        this.save();
    }
    NotebookComponentSave(e) {
        this.setState({
            Notebooks: e.Notebooks,
            DeletedNotebooks: e.DeletedNotebooks,
            selectedNotebookValue: e.selectedNotebookValue,
            pageView: e.pageView,
            noteView: e.noteView,
            noteTitle: e.noteTitle,
            isNewNote: e.isNewNote,
            isNewPage: e.isNewPage,
            freshNotebook: e.freshNotebook,
        });
        this.save();
    }
    atbComponentHandleChange(e) {
        this.setState({
            Notebooks: e
        });
        this.save();
    }
    atbComponentSave(e) {
        this.setState({
            Notebooks: e.Notebooks,
            pageView: e.pageView,
            noteView: e.noteView,
            noteTitle: e.noteTitle,
            isNewNote: e.isNewNote,
        });
        this.save();
    }
    noteComponentHandleChange(e) {
        this.setState({
            Notebooks: e.Notebooks,
            noteTitle: e.noteTitle,
        });
        this.save();
    }
    noteComponentSave(e) {
        this.setState({
            Notebooks: e.Notebooks,
            pageView: e.pageView,
            noteView: e.noteView,
            noteTitle: e.noteTitle,
            isNewNote: e.isNewNote,
        });
        this.save();
    }
    updateNoteViews(e) {
        this.setState({
            pageView: e.pageView,
            noteView: e.noteView,
        });
        this.save();
    }

    landingUpload(e) {
        this.setState({
            Notebooks: e.Notebooks,
            DeletedNotebooks: e.DeletedNotebooks,
            selectedNotebookValue: e.selectedNotebookValue,
            isUploaded: e.isUploaded,
            isNewPage: e.isNewPage,
            isNewNote: e.isNewNote,
            noteTitle: e.noteTitle,
            pageView: e.pageView,
            noteView: e.noteView,

        });
        this.save();
    }
    landingFreshNotebook() {
        this.setState({
            freshNotebook: true,
        });

    }

    changeView() {
        let temp = !this.state.displayPageView;
        this.setState({
            displayPageView: temp,
        })
    }
    async save() {
        let selectedListItem = this.state.Notebooks[this.state.selectedNotebookValue];
        if (selectedListItem) {
            let xlist = this.state.Notebooks;
            xlist.splice(selectedListItem.ID, 1, {
                ID: selectedListItem.ID,
                title: selectedListItem.title,
                PageList: selectedListItem.PageList,
                DeletedPageList: selectedListItem.DeletedPageList,
                selectedPageValue: selectedListItem.selectedPageValue,
                selectedNotebookValue: this.state.selectedNotebookValue,
                date: selectedListItem.date,
                time: selectedListItem.time
            });
            await this.setState({
                Notebooks: xlist,
            });
        }

    }

    render() {
        var code;
        if ((!this.state.isUploaded && !this.state.freshNotebook)) {
            code = (
                <div className="hub">
                    <LandingPage
                        landingUpload={this.landingUpload}
                        landingFreshNotebook={this.landingFreshNotebook}
                        NotebookComponentSave={this.NotebookComponentSave} />
                </div>
            );
        } else {
            var stateObj = this.state;
            var displayView;
            if (this.state.displayPageView) {
                displayView = (
                    <PageViewComponent
                        stateObj={stateObj}
                    />
                );
            } else {
                displayView = (
                    <NoteComponent
                        stateObj={stateObj}
                        noteComponentHandleChange={this.noteComponentHandleChange}
                        noteComponentSave={this.noteComponentSave}
                        updateNoteViews={this.updateNoteViews}
                    />
                );
            }
            code = (
                <div className="notebook-wrapper">
                        <NotebookComponent
                            notebookStateObj={stateObj}
                            NotebookComponentHandleChange={this.NotebookComponentHandleChange}
                            NotebookComponentSave={this.NotebookComponentSave} />
                        <PageComponent
                            stateObj={stateObj}
                            pageComponentHandleChange={this.pageComponentHandleChange}
                            pageComponentSave={this.pageComponentSave}
                        />
                    <div className="switch">
                        <button onClick={this.changeView}>Switch</button>
                    </div>
                        {displayView}
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
