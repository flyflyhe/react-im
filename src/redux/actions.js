/**
 * 对应 reducers 中的 action 同步/异步请求
 */
import Cookies from 'js-cookie'
import {
    initChatData, receiveChatMsg, sendChatMsg, showRightType, showFriendInfo, authSuccess,
    errMsg, userInfo,logOut, modifyUserContacts, getNewFriends, getMailList, initUser
} from './init'
import { reqUserInfo, reqLogin } from '../api'
import {pySegSort} from '../utils'

// 数据模拟
import {user, contact} from '../config/initMain'
import {mailList} from '../config/mailList'
import {newFriend} from '../config/newFriend'
import {websocket} from '../utils/websocket'
import ajax from '../api/ajax'

// 用户登录
export const login = (username, password) => {
    return async dispatch => {
        const response = await reqLogin({username, password})

        const result = response.data
        username = result.name
        password = result.password

        user.id = result.id
        user.name = result.name

        Cookies.set('token', user.id)
        dispatch(authSuccess(`欢迎你${username}`))
    }

    // return async dispatch => {
    //     Cookies.set('token', username+password)
    //     dispatch(authSuccess(`欢迎你${username}`))
    // }
}

// 退出登录
export const logout = () => {
    return async dispatch => {
        Cookies.remove('token'); dispatch(logOut({}))
    }
}

// 界面信息初始化
export const initMain = token => {
    return async dispatch => {
        const response = await reqUserInfo(Cookies.get('token'))

        const result = response.data
        dispatch(userInfo({userInfo: result, contacts: contact || []}))
        websocket(result)  // 这里可接入 socket
    }
}

// 获取用户信息
export const initUserInfo = token => {
    return async dispatch => {
        const response = await reqUserInfo(token)
        const result = response.data
        if (result.code === 200) {
            dispatch(userInfo(result.data))
            // websocket(result.data.userInfo)
        } else {
            dispatch(errMsg(result.msg))
        }
    }
}

// 修改消息会话列表
export const modifyContacts = contacts => {
    return dispatch => {
        dispatch(modifyUserContacts({contacts}))
    }
}

// 初始化消息列表
export const initChatInfo = chatUserInfo => {
    return dispatch => {
        dispatch(initChatData({chatUserInfo, loading: false, showRightType: 'message'}))
    }
}

// 切换右侧显示状态
export const changeRightType = type => {
    return dispatch => {
        dispatch(showRightType({showRightType: type}))
    }
}

// 发送消息
export const pushChatMsg = chat => {
    return dispatch => {
        dispatch(sendChatMsg(chat))
    }
}

// 收到好友消息
export const recvChatMsg = chat => {
    return dispatch => {
        dispatch(receiveChatMsg(chat))
    }
}

// 获取好友基本信息
export const getFriendInfo = friend_uid => {
    return async dispatch => {
        await dispatch(changeRightType('userInfo'))
        await dispatch(showFriendInfo(friend_uid))
    }
}

// 获取好友申请列表
export const getNewFriendList = token => {
    return async dispatch => {
        dispatch(getNewFriends(newFriend))
    }
}

// 获取用户通讯录列表
export const getUserMailList = token => {
    return async dispatch => {
        dispatch(getMailList(pySegSort(mailList)))
    }
}