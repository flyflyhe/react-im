import React, {Component} from 'react'

import LayoutMain from '../../components/layout'
import Contacts from './contacts'

class ChatContainer extends Component {

    componentDidMount = () => {
        console.log('-----')
        console.log(this.props)
    }

    render() {
        return (
            <LayoutMain router={{path: '/', components: Contacts}}/>
        )
    }
}

export default ChatContainer