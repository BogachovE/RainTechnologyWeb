import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import Routes from './routes'

import {fireInit} from '../firebase/firebase'

class Root extends Component {
    constructor(props){
        super(props);
        fireInit()
    }

    render() {
        return (
            <Routes history={browserHistory}/>
        )
    }
}
export default Root
