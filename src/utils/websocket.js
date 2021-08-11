import { message as AM, notification } from 'antd'

import store from '../redux/store'
import { modifyContacts } from '../redux/actions'
import message from '../pages/chat/message/message'

let socket = null

function websocket(user) {
    socket = new WebSocket("ws://127.0.0.1:9000")
    socket.onopen = () => {
        socket.send(JSON.stringify({
            "event": "login",
            "data": {"user":{"uid":user.id, "role":user.role}}
        }))
    }

    socket.onmessage = msg => {
        const data = JSON.parse(msg.data)
        console.log(data)
        const touuid = ""
        switch (data.event) {
            case "init":
                break
            case "login":
                //notification['success']({ message: `${data.username} 已连接` })
                break
            case "send":
                const { fromUser, toUser } = data.data
                const content = data.data.msg
                const username = fromUser.username
                AM.success(`message：${username}: ${content}`)

                var contacts = store.getState().user.contacts
                store.dispatch(modifyContacts(contacts))
                break
            case "private":
                var contacts = store.getState().user.contacts
                if(touuid === user.id.toString()) {
                    const findIndex = contacts.findIndex(item => item.uid.toString() === touuid)
                    if(findIndex !== -1) {
                        contacts[findIndex].last = content.replace(/@\S+/, ' ')
                        if(store.getState().chat.chatUserInfo.uid === parseInt(touuid)) {
                            contacts[findIndex].unread = 0
                        } else {
                            contacts[findIndex].unread++
                        }
                    }
                    // 待完善。。。
                    store.dispatch(modifyContacts(contacts))
                }
                break
            case "logout":
                notification['error']({ message: `${data.username} 已退出连接` })
                AM.success(data.uuid + "已下线")
                break
            default:
                break
        }
    }

    socket.onclose = event => {
        // notification['error']({ message: `服务器已断开连接` });
        console.log("Socket Closed Connection: ", event)
    }

    socket.onerror = error => {
        notification['error']({ message: `服务器已断开连接` });
    }
}

// 发送好友消息
const sendMsg = (msg, my_id, friend_id) => {
    console.log("sending msg:", msg)
    socket.send(JSON.stringify({
        event: "send",
        data: {
            fromUser:{uid:my_id,username:""},
            toUser:{uid:friend_id,username:""},
            msg: msg.message
        }
    }))
}

export { websocket, sendMsg }