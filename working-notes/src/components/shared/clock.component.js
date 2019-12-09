import React, {Component} from 'react';

export class ClockComponent extends Component{
    constructor(props){
        super(props);
        this.stateChange = props.stateChange || new Function();
        this.state = {
            time: ''
        };
        this.clock = this.clock.bind(this);
    }
    clock(){
        let currentTime = new Date();
        let hour = currentTime.getHours();
        let min = currentTime.getMinutes();
        let sec = currentTime.getSeconds();
        let isAm = true;
        if(hour > 12){
            hour = hour - 12;
            isAm = false;
        }

        let time = (hour < 10 ? '0'+ hour : hour)
                     + ':' +
                    (min < 10 ? '0' + min : min)
                     + ':' +
                    (sec < 10 ? '0' + sec: sec)
                     + ' ' +
                    (isAm ? 'am' : 'pm');
        this.setState({
            time:time
        });

    }

    render(){
        setInterval(this.clock,1000);
        return(
            <div>
                {this.state.time}
            </div>
        );
    }
}