import React, {Component} from 'react';
import {MainTextComponent} from './MainTextComponent'
import { callbackify } from 'util';

export class HubComponent extends Component{

    constructor(props){
        super(props);
        /*
        let temp = '{"active":"F","sectionName":"","mainText":"","theNote":"Test\\nTest\\n\\nasdsa\\n\\n14:24:31\\nsdfsfs\\n\\n14:24:33\\njyjthtyh\\n\\n\\nsdfs\\n14:24:29\\nDoing all the testing \\nwhat wah\\n","title":"Test","author":"Test","description":"","selectedNote":{"name":"asdsa","section":1,"texts":[{"id":0,"text":"sdfsfs\\n","time":"14:24:31","visible":"collapse","tags":[],"tagString":""},{"id":1,"text":"jyjthtyh\\n\\n","time":"14:24:33","visible":"collapse","tags":[],"tagString":""}]},"selectedDisplayText":[{"type":"table","key":null,"ref":null,"props":{"children":[{"type":"tr","key":null,"ref":null,"props":{"className":"noteSectionBackground","id":0,"children":{"type":"td","key":null,"ref":null,"props":{"id":0,"children":[{"type":"div","key":null,"ref":null,"props":{"id":0,"children":"+"},"_owner":null,"_store":{}},{"type":"div","key":null,"ref":null,"props":{"id":0,"children":[" ","14:24:31"," - ","sdfsfs\\n"]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}},"_owner":null,"_store":{}},{"type":"tr","key":null,"ref":null,"props":{"style":{"visibility":"collapse"},"children":[{"type":"td","key":null,"ref":null,"props":{"className":"textareaFormat","children":{"type":"textarea","key":null,"ref":null,"props":{"value":"sdfsfs\\n","rows":"10","cols":"100"},"_owner":null,"_store":{}}},"_owner":null,"_store":{}},{"type":"td","key":null,"ref":null,"props":{"className":"tagFormat","children":""},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}},{"type":"table","key":null,"ref":null,"props":{"children":[{"type":"tr","key":null,"ref":null,"props":{"className":"noteSectionBackground","id":1,"children":{"type":"td","key":null,"ref":null,"props":{"id":1,"children":[{"type":"div","key":null,"ref":null,"props":{"id":1,"children":"+"},"_owner":null,"_store":{}},{"type":"div","key":null,"ref":null,"props":{"id":1,"children":[" ","14:24:33"," - ","jyjthtyh\\n\\n"]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}},"_owner":null,"_store":{}},{"type":"tr","key":null,"ref":null,"props":{"style":{"visibility":"collapse"},"children":[{"type":"td","key":null,"ref":null,"props":{"className":"textareaFormat","children":{"type":"textarea","key":null,"ref":null,"props":{"value":"jyjthtyh\\n\\n","rows":"10","cols":"100"},"_owner":null,"_store":{}}},"_owner":null,"_store":{}},{"type":"td","key":null,"ref":null,"props":{"className":"tagFormat","children":""},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}],"sectionList":[{"name":"asdsa","section":1,"texts":[{"id":0,"text":"sdfsfs\\n","time":"14:24:31","visible":"collapse","tags":[],"tagString":""},{"id":1,"text":"jyjthtyh\\n\\n","time":"14:24:33","visible":"collapse","tags":[],"tagString":""}]},{"name":"sdfs","section":2,"texts":[{"id":0,"text":"Doing all the testing \\nwhat wah\\n","time":"14:24:29","visible":"collapse","tags":[],"tagString":""}]}],"globalTagList":[],"wordCheck":"wahsdfsfsjyjthtyh\\n","tagTrigger":""}'
        let obj = JSON.parse(temp);
        let tempOne = '{"active":"F","sectionName":"","mainText":"","theNote":"Test\\nTest\\n\\nasdsa\\n\\n14:24:31\\nsdfsfs\\n\\n14:24:33\\njyjthtyh\\n\\n\\nsdfs\\n14:24:29\\nDoing all the testing \\nwhat wah\\n","title":"OtherTest","author":"Test","description":"","selectedNote":{"name":"asdsa","section":1,"texts":[{"id":0,"text":"sdfsfs\\n","time":"14:24:31","visible":"collapse","tags":[],"tagString":""},{"id":1,"text":"jyjthtyh\\n\\n","time":"14:24:33","visible":"collapse","tags":[],"tagString":""}]},"selectedDisplayText":[{"type":"table","key":null,"ref":null,"props":{"children":[{"type":"tr","key":null,"ref":null,"props":{"className":"noteSectionBackground","id":0,"children":{"type":"td","key":null,"ref":null,"props":{"id":0,"children":[{"type":"div","key":null,"ref":null,"props":{"id":0,"children":"+"},"_owner":null,"_store":{}},{"type":"div","key":null,"ref":null,"props":{"id":0,"children":[" ","14:24:31"," - ","sdfsfs\\n"]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}},"_owner":null,"_store":{}},{"type":"tr","key":null,"ref":null,"props":{"style":{"visibility":"collapse"},"children":[{"type":"td","key":null,"ref":null,"props":{"className":"textareaFormat","children":{"type":"textarea","key":null,"ref":null,"props":{"value":"sdfsfs\\n","rows":"10","cols":"100"},"_owner":null,"_store":{}}},"_owner":null,"_store":{}},{"type":"td","key":null,"ref":null,"props":{"className":"tagFormat","children":""},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}},{"type":"table","key":null,"ref":null,"props":{"children":[{"type":"tr","key":null,"ref":null,"props":{"className":"noteSectionBackground","id":1,"children":{"type":"td","key":null,"ref":null,"props":{"id":1,"children":[{"type":"div","key":null,"ref":null,"props":{"id":1,"children":"+"},"_owner":null,"_store":{}},{"type":"div","key":null,"ref":null,"props":{"id":1,"children":[" ","14:24:33"," - ","jyjthtyh\\n\\n"]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}},"_owner":null,"_store":{}},{"type":"tr","key":null,"ref":null,"props":{"style":{"visibility":"collapse"},"children":[{"type":"td","key":null,"ref":null,"props":{"className":"textareaFormat","children":{"type":"textarea","key":null,"ref":null,"props":{"value":"jyjthtyh\\n\\n","rows":"10","cols":"100"},"_owner":null,"_store":{}}},"_owner":null,"_store":{}},{"type":"td","key":null,"ref":null,"props":{"className":"tagFormat","children":""},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}],"sectionList":[{"name":"asdsa","section":1,"texts":[{"id":0,"text":"sdfsfs\\n","time":"14:24:31","visible":"collapse","tags":[],"tagString":""},{"id":1,"text":"jyjthtyh\\n\\n","time":"14:24:33","visible":"collapse","tags":[],"tagString":""}]},{"name":"sdfs","section":2,"texts":[{"id":0,"text":"Doing all the testing \\nwhat wah\\n","time":"14:24:29","visible":"collapse","tags":[],"tagString":""}]}],"globalTagList":[],"wordCheck":"wahsdfsfsjyjthtyh\\n","tagTrigger":""}'
        
        let idk = JSON.parse(tempOne);
        let something = [];
        something.push(obj);
        something.push(idk);
       

        let templist = [];
        let count = 0;
        something.forEach((a) =>{
            let temp = {
                name: a.title,
                position: count
            }
            templist.push(temp);
            count++;
        })
         */
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
        x.download = "myText.txt";
        document.body.appendChild(x); // Required for this to work in FireFox
        x.click();
      }

    passAlong(){
        console.log('works');
        let listSelect = document.getElementById("ddlist").value;
        console.log(listSelect);
        console.log(listSelect.value);

        //let temp = '{"active":"F","sectionName":"","mainText":"","theNote":"Test\\nTest\\n\\nasdsa\\n\\n14:24:31\\nsdfsfs\\n\\n14:24:33\\njyjthtyh\\n\\n\\nsdfs\\n14:24:29\\nDoing all the testing \\nwhat wah\\n","title":"Test","author":"Test","description":"","selectedNote":{"name":"asdsa","section":1,"texts":[{"id":0,"text":"sdfsfs\\n","time":"14:24:31","visible":"collapse","tags":[],"tagString":""},{"id":1,"text":"jyjthtyh\\n\\n","time":"14:24:33","visible":"collapse","tags":[],"tagString":""}]},"selectedDisplayText":[{"type":"table","key":null,"ref":null,"props":{"children":[{"type":"tr","key":null,"ref":null,"props":{"className":"noteSectionBackground","id":0,"children":{"type":"td","key":null,"ref":null,"props":{"id":0,"children":[{"type":"div","key":null,"ref":null,"props":{"id":0,"children":"+"},"_owner":null,"_store":{}},{"type":"div","key":null,"ref":null,"props":{"id":0,"children":[" ","14:24:31"," - ","sdfsfs\\n"]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}},"_owner":null,"_store":{}},{"type":"tr","key":null,"ref":null,"props":{"style":{"visibility":"collapse"},"children":[{"type":"td","key":null,"ref":null,"props":{"className":"textareaFormat","children":{"type":"textarea","key":null,"ref":null,"props":{"value":"sdfsfs\\n","rows":"10","cols":"100"},"_owner":null,"_store":{}}},"_owner":null,"_store":{}},{"type":"td","key":null,"ref":null,"props":{"className":"tagFormat","children":""},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}},{"type":"table","key":null,"ref":null,"props":{"children":[{"type":"tr","key":null,"ref":null,"props":{"className":"noteSectionBackground","id":1,"children":{"type":"td","key":null,"ref":null,"props":{"id":1,"children":[{"type":"div","key":null,"ref":null,"props":{"id":1,"children":"+"},"_owner":null,"_store":{}},{"type":"div","key":null,"ref":null,"props":{"id":1,"children":[" ","14:24:33"," - ","jyjthtyh\\n\\n"]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}},"_owner":null,"_store":{}},{"type":"tr","key":null,"ref":null,"props":{"style":{"visibility":"collapse"},"children":[{"type":"td","key":null,"ref":null,"props":{"className":"textareaFormat","children":{"type":"textarea","key":null,"ref":null,"props":{"value":"jyjthtyh\\n\\n","rows":"10","cols":"100"},"_owner":null,"_store":{}}},"_owner":null,"_store":{}},{"type":"td","key":null,"ref":null,"props":{"className":"tagFormat","children":""},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}]},"_owner":null,"_store":{}}],"sectionList":[{"name":"asdsa","section":1,"texts":[{"id":0,"text":"sdfsfs\\n","time":"14:24:31","visible":"collapse","tags":[],"tagString":""},{"id":1,"text":"jyjthtyh\\n\\n","time":"14:24:33","visible":"collapse","tags":[],"tagString":""}]},{"name":"sdfs","section":2,"texts":[{"id":0,"text":"Doing all the testing \\nwhat wah\\n","time":"14:24:29","visible":"collapse","tags":[],"tagString":""}]}],"globalTagList":[],"wordCheck":"wahsdfsfsjyjthtyh\\n","tagTrigger":""}'
        //let obj = JSON.parse(temp);
        //let idk = new Object(obj);
        //let list = this.state.theList;
        //list.push(obj);
        //console.log(obj);
        //console.log(idk);
        let select = this.state.theList[listSelect];

        this.setState({
            selected:select
        });
        console.log(this.state.theList);
        console.log(this.state.selected);
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


        /*
        console.log('1');
        let uploadJson = new Blob();
        var newupload;
        let temp = document.getElementById('upload');
        var file = temp.files.item(0);
        var reader = new FileReader();
        
        reader.onload = function(e){
            console.log(this.result);
            uploadJson = this.result;
            
            newupload = JSON.parse(this.result);
            console.log(newupload);
            return this.result;
        }
        reader.readAsText(file)
       //reader.readAsArrayBuffer(file);
        console.log(reader.result);
        console.log(uploadJson);
        console.log(newupload);

        


         var reader = new FileReader();
         if(temp.files.length){
            console.log('2');
            var textfile = temp.files[0];
            reader.readAsText(textfile);
            reader.onload = function(e){
              //  console.log(e.target.result);
              let local = e.target.result;
             // console.log(local);
              //console.log(JSON.parse(local));
              let doThis = JSON.parse(local);
              console.log(doThis);
              if(doThis.length > 0){
                  console.log('yes');
                  uploadJson = doThis;
                  this.assign(uploadJson);
                              }

              JSON.parse(local).forEach((a) =>{
                  console.log(a);
                uploadJson.push(a);
              });

              
              console.log(local);
               uploadJson = local;
               onsole.log(uploadJson);
         this.setState({
                   upload: local
               })
            }
            console.log('3');
        }
        console.log('4');
        console.log(uploadJson);
        //let newData = uploadJson;
        if(uploadJson.length > 0){
            console.log('maybe');
        }
       
        for (var i = 0, len = temp.files.length; i < len; i++) {
            var file = temp.files[i];
    
            var reader = new FileReader();
    
            reader.onload = (function(f) {
                return function(e) {
                    console.log(this.result);
                    uploadJson.push(this.result)
                    // Here you can use `e.target.result` or `this.result`
                    // and `f.name`.
                };
            })(file);
            console.log(file);
            reader.readAsText(file);
        }
        console.log(reader); */
        //console.log(newupload);
        /*
        console.log(temp);
        console.log(temp.fileList);
        const fs = require('fs');
        const json_data = require('C:\\Users\\Kyjia\\Downloads\\Test.json');

        fs.readFile(json_data, 'utf8', function (err, data) {
        try {
            data = JSON.parse(data)
            console.log(data);
        } catch (e) {
            // Catch error in case file doesn't exist or isn't valid JSON
        }
        });

        let response = fetch(temp.value);
        let json = response.json();
        console.log(json);

        let files = document.getElementById('upload').files;
        let file = files[0];
        console.log(file);
        let start = 0;
        let stop = file.size -1;

        let reader = new FileReader();

        let something = file.slice(start, stop +1);
        console.log(something);
        let output = reader.readAsText(something);
        console.log(output);
        */
    }

    render(){
        let NoteDropDownList =  this.state.ddList.map((a) =>
            <option key={a.position} onClick={this.setSelected} value={a.position}>{a.name}</option>
        );
        return(
            <div>
                <div>
                        <select id="ddlist">                        
                            {NoteDropDownList}
                        </select>
                        
                    <div><button onClick={this.downloadNoteFile}>Export</button></div>
                    <input id="upload" type="file" />
                    <div><button onClick={this.upload}>Upload</button></div>
                </div>
                <MainTextComponent lifeLine={this.passAlong} noteMain={this.state.selected}/>
            </div>
        );
    }
}