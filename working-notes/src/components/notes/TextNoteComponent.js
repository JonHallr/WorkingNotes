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
            name: this.props.selectedName,
            textNoteList:this.props.selectedTexts,
            temp: this.props.selectedValue

        };
           this.handleTextNoteList = this.handleTextNoteList.bind(this);
           this.handleNameChange = this.handleNameChange.bind(this);
           this.onClickEdit = this.onClickEdit.bind(this);
           this.remove = this.remove.bind(this);
           this.try = this.try.bind(this);

    }
    handleNameChange(event){
        console.log("handleNameChange");
        let target = event.target;
        let value = target.value;
        let name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleTextNoteList(){
        
        console.log("handleTextNoteList");
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
        console.log("onClickEdit");
        let temp = event.target.id;
        this.props.edit(temp, this.props.sectionId);
    }
    remove(){
        
        console.log("remove");
        this.props.deleteSection(this.props.sectionId);
    }
    try(){
        
        console.log("try");
        console.log(this.state);
    }

    render(){
        console.log("textNoteSection");

        return(
        <div className='text-note'>
            <div className ='close'>
                <button onClick={this.remove}>X</button>
            </div>
            <button onClick={this.try}>Try</button>
            <input type="text" name="name" defaultValue={this.props.selectedName} onChange={this.handleNameChange} />
            <ul>{this.props.selectedTexts}</ul>

        </div>);
    }
}