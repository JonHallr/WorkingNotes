import React, { Component } from 'react';
import './css/awesome-hub.css';

export class PageViewComponent extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let pageViewStateObj = this.props.stateObj
        return (
            <div>
                <label className="label-header">Page View:</label>
                <div className="ThePage inner">
                    <div className="readOnlyDisplay">
                        {pageViewStateObj.pageView}
                    </div>
                </div>
            </div>
        );
    }
}