import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './redux/store'
import App from './pages/app'
import Login from './pages/login/login'
import Register from './pages/login/register'

import './assets/css/base.less'

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register} />
                <Route path='/' component={App} />
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
)