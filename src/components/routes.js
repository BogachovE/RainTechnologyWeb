import {Router, Route, IndexRedirect, IndexRoute} from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App'
import Base from './Base/index'
import TakePhoto from './TakePhoto/index'
import NotFound from './NotFound/index'

import React from 'react'

const Routes =  (props) => (
    <MuiThemeProvider>
        <Router {...props}>
            <Route path='/' component={App}>

                <IndexRoute component={TakePhoto}/>
                <IndexRedirect to={'/photo'}/>

                <Route path="/photo" component={TakePhoto}/>
                <Route path='/base' component={Base}/>
                <Route path={'*'} component={NotFound}/>
            </Route>
        </Router>
    </MuiThemeProvider>
);

export default Routes

