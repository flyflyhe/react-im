import { message as AM, notification } from 'antd'

import store from '../redux/store'
import { modifyContacts, recvChatMsg } from '../redux/actions'

let socket = null

function websocket(user) {
    socket = new WebSocket("ws://127.0.0.1:9000")
    socket.onopen = () => {
        socket.send(JSON.stringify({
            "event": "login",
            "data": {"user":{"uid":user.id, "role":user.role, username:user.nickname}}
        }))
    }

    socket.onmessage = msg => {
        const data = JSON.parse(msg.data)
        console.log(data)
        const touuid = ""
        var uid = 0
        var contacts = []
        var findIndex = -1
        switch (data.event) {
            case "init":
                break
            case "login_notify":
                notification['success']({ message: `${data.data.user.username} 已连接` })
                contacts = store.getState().user.contacts
                uid = data.data.user.uid

                console.log(contacts)
                findIndex = contacts.findIndex(item => item.id == uid)
                if(findIndex === -1) {
                    contacts.push({
                        "area":"北京-北京",
                        "autograph":"不是每个人都能成为自己想要的样子，但每个人，都可以努力成为自己想要的样子.",
                        "avatar":"http://www.lmsail.com/storage/9d770a4b695cc49ed23525bebca15790.jpeg",
                        "id":uid,
                        "introduction":"90后 | Mr.bo | PHPER工程师",
                        "lockstate":0,
                        "nickname":data.data.user.username,
                        "phone":18899888899
                    })
                }

                // 待完善。。。
                store.dispatch(modifyContacts(contacts))
                break
            case "login":
                notification['success']({ message: '获取在线用户成功' })
                contacts = store.getState().user.contacts
                console.log('login')
                console.log(data.data)

                contacts = data.data

                // 待完善。。。
                store.dispatch(modifyContacts(contacts))
                break    
            case "message":
                const { fromUser, toUser } = data.data
                const content = data.data.msg
                const username = fromUser.username
                AM.success(`message：${username}: ${content}`)

                store.dispatch(recvChatMsg({
                    id: fromUser.uid,
                    to_id: toUser.uid,
                    avatar: "",
                    message: content,
                    position: "left"
                }))
                break
            case "private":
                contacts = store.getState().user.contacts
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
        event: "message",
        data: {
            fromUser:{uid:my_id,username:""},
            toUser:{uid:friend_id,username:""},
            msg: msg.message
        }
    }))
}

export { websocket, sendMsg }