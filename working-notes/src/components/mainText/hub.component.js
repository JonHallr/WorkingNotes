import React, {Component} from 'react';
import {MainTextComponent} from './MainTextComponent'
import { callbackify } from 'util';
import './hub.css'

export class HubComponent extends Component{

    constructor(props){
        super(props);
        this.stateChange = props.stateChange || new Function();

        this.state ={
            theList: [],
            selected:{},
            ddList:[],
            upload: ''
        }

        this.passAlong = this.passAlong.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.upload = this.upload.bind(this);
        this.assign = this.assign.bind(this);
    }
    
    downloadNoteFile = () => {
        const x = document.createElement("a");
        let temp = JSON.stringify(this.state.theList);
        console.log(temp);
        const file = new Blob([temp], {type: 'application/json'});
        x.href = URL.createObjectURL(file);
        x.download = "myText.json";
        document.body.appendChild(x); // Required for this to work in FireFox
        x.click();
      }

    passAlong(){
        console.log('works');
        let listSelect = document.getElementById("ddlist");
        console.log(listSelect);
            let select = this.state.theList[listSelect.value];
            console.log(select);
            this.setState({
                selected:select

            }); 
    }
    setSelected(event){
        let target = event.target;
        console.log(target.value);
    }
assign(anything){
    console.log(anything);
}

readFileAsync(file){
    return new Promise((resolve,reject) =>{
        let reader = new FileReader();

        reader.onload = () =>{
            resolve(reader.result);
        }
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

    async upload(){
        try{
            let doc = document.getElementById('upload');
            var file = doc.files.item(0);
            let contentBuffer = await this.readFileAsync(file);
            let temp = JSON.parse(contentBuffer);
            let templist = [];
            let count = 0;
            temp.forEach((a) =>{
                let b = {
                    name: a.title,
                    position: count
                }
                templist.push(b);
                count++;
            });
            this.setState({
                theList: temp,
                ddList: templist
            })
            console.log(temp);
            console.log(contentBuffer);
        }catch(err){
            console.log(err);

        }
        console.log(this.state.theList);


    }

    render(){
        let NoteDropDownList =  this.state.ddList.map((a) =>
            <option key={a.position} onClick={this.setSelected} value={a.position}>{a.name}</option>
        );
        return(
            <div>
                <div className="wrapper">
                    <div className="notelist">
                        <select id="ddlist">                        
                                    {NoteDropDownList}
                        </select>
                        <button onClick={this.passAlong}>Load</button>                   
                    </div>
                        
                    <div className="export">
                        <button onClick={this.downloadNoteFile}>Export</button>
                    </div>
                    <div className="upload">
                        <input id="upload" type="file" /> 
                        <button onClick={this.upload}>Upload</button>
                    </div>
                </div>
                <MainTextComponent lifeLine={this.passAlong} noteMain={this.state.selected}/>
            </div>
        );
    }
}