import React, { Component } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

class Timer extends Component {
    constructor(props){
        super(props);
        this.state={seconds: 5, matchFound: false};
    }
    onStart=()=>{
        if (this.state.matchFound === true) {
            let navigate = useNavigate();
            navigate("/room-1")
        }
        if (this.state.seconds === 0) {
            this.onCancel()
        }
        else {
            this.setState({seconds:this.state.seconds-1});
        }
    }

    timer=()=>{
        this.f=setInterval(this.onStart,1000);
        document.getElementById('btn-start').disabled=true;
        document.getElementById('btn-cancel').disabled=false;
        // axios.post("/...", data={userId: "tester1"}).then(res => {
        //     isFound = res.user2Id
        //     if (isFound) {
        //         this.setState({matchFound: true})
        //     }
        // })
    }

    onPause=()=>{
        clearInterval(this.f);
    }
    onCancel=()=>{
        clearInterval(this.f);
        this.setState({seconds:5, matchFound: false})
        document.getElementById('btn-start').disabled=false;
        document.getElementById('btn-cancel').disabled=true;
    }
    render(){
        return(
            <div>
                <h1>{this.state.seconds}</h1>
                <button id='btn-start' onClick={this.timer}>Find Match</button>
                <button id='btn-cancel' onClick={this.onCancel}>Cancel Match</button>
            </div>
        )
    }
}

export default Timer