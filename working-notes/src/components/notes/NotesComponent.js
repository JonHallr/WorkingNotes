import React, {Component} from 'react';

export class NotesComponent extends Component{

    constructor(props){
        super(props);
        this.stateChange = props.stateChange || new Function();
        this.state ={
            notes:[{
                text: '',
                time: ''
            }]
        };

        this.handleNote = this.handleNote.bind(this);

    }

  
    handleNote(props){
        if(this.props.value.trim() !== ''){
            let d = new Date();
            let tempArray = [];
            tempArray = this.state.notes;
            let tempObject = {
                text: this.props.value,
                time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' - '
            }
            tempArray.push(tempObject);
            this.setState({
                    notes: tempArray});
            console.log(this.state.notes);
        }
        
    }



    render(){
        var notesList = this.state.notes.map((entry) =>
            <div>                
                <p>{entry.time}  {entry.text}</p>
            </div>
        );

        return (             
                <div>
                   <div><button onClick={this.handleNote}>{this.props.name}</button></div> 
                    <label>{this.props.name}</label>
                    <ul>{notesList}</ul>
                </div>
            
        );
    }

}
