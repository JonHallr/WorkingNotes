import React, {Component} from 'react';
import './TextNote.css';

export class TextNoteComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: this.props.namePass,
            textNoteList:[{
                text: '',
                time: ''
            }]

        };
           this.handleTextNoteList = this.handleTextNoteList.bind(this);
           this.handleNameChange = this.handleNameChange.bind(this);
           this.somethingRandome = this.somethingRandome.bind(this);

    }
    handleNameChange(event){
        let target = event.target;
        let value = target.value;
        let name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleTextNoteList(props){
        if(this.props.mainText.trim() !== ''){
            let d = new Date();
            let tempArray = [];
            tempArray = this.state.textNoteList;
            let tempObject = {
                text: "-" + this.props.mainText + "\n",
                time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() 
            }
            tempArray.push(tempObject);
            this.setState({
                textNoteList: tempArray});
        }
        this.props.onListUpdate(this.state.textNoteList, this.state.name);
        this.props.onFilterTextChange();
        this.props.doRefresh();
    }
    somethingRandome(event){
        console.log(event.target);
    }

    render(){
        var textNoteListArray = this.state.textNoteList.map((e) =>
        <div key={e.time.toString() + e.text.length} onClick={this.somethingRandome}>                
            <p>{e.time + e.text}</p>
        </div>
    );
        return(
        <div className='text-note'>
            <input type="text" name="name" defaultValue={this.state.name} onChange={this.handleNameChange} />
            <div>
                <button onClick={this.handleTextNoteList}>Add</button>
            </div>
            <ul>{textNoteListArray}</ul>

        </div>);
    }
}