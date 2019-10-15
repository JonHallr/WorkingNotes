import React, {Component} from 'react';
import './TextNote.css';
/*

  id: 0,
  text: '',
  time: ''
            
*/
export class TextNoteComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: this.props.namePass,
            textNoteList:[]

        };
           this.handleTextNoteList = this.handleTextNoteList.bind(this);
           this.handleNameChange = this.handleNameChange.bind(this);
           this.onClickEdit = this.onClickEdit.bind(this);
           this.remove = this.remove.bind(this);

    }
    handleNameChange(event){
        let target = event.target;
        let value = target.value;
        let name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleTextNoteList(){
        if(this.props.mainText.trim() !== ''){
            let d = new Date();
            let tempId = this.state.textNoteList.length;
            let tempArray = [];
            tempArray = this.state.textNoteList;
            let tempObject = {
                id: tempId,
                text: this.props.mainText + "\n",
                time: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "\n"
            }
            tempArray.push(tempObject);
            this.setState({
                textNoteList: tempArray});
        }
        this.props.onListUpdate(this.state.textNoteList, this.props.sectionId, this.state.name);
        this.props.onFilterTextChange();
        this.props.doRefresh();
    }
    onClickEdit(event){
        console.log(event.target.id);
        let temp = event.target.id;
        this.props.edit(temp, this.props.sectionId);
    }
    remove(){
        
        this.props.deleteSection(this.props.sectionId);
    }

    render(){
        var textNoteListArray = this.state.textNoteList.map((e) =>
        <div key={e.time.toString() + e.text.length} >                
            <p id={e.id} onClick={this.onClickEdit}>{e.time + e.text}</p>
        </div>
    );
        return(
        <div className='text-note'>
            <div className ='close'>
                <button onClick={this.remove}>X</button>
            </div>
            <input type="text" name="name" defaultValue={this.state.name} onChange={this.handleNameChange} />
            <div>
                <button onClick={this.handleTextNoteList}>Add</button>
            </div>
            <ul>{textNoteListArray}</ul>

        </div>);
    }
}