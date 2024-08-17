'use client'

import { Button, Input, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import TextArea from 'antd/es/input/TextArea'
import { chatHistoryList, chatroomList } from '@/interface'
import type { UserInfo } from '@/app/(public)/update-info/page'

interface JoinRoomPayload {
  chatroomId: number
  userId: number
}

interface SendMessagePayload {
  sendUserId: number
  chatroomId: number
  message: Message
}

interface Message {
  type: 'text' | 'image'
  content: string
}

type Reply =
  | {
    type: 'sendMessage'
    userId: number
    message: ChatHistory
  }
  | {
    type: 'joinRoom'
    userId: number
  }

interface Chatroom {
  id: number
  name: string
  createTime: Date
}

interface ChatHistory {
  id: number
  content: string
  type: number
  chatroomId: number
  senderId: number
  createTime: Date
  sender: UserInfo
}

interface User {
  id: number
  email: string
  headPic: string
  nickName: string
  username: string
  createTime: Date
}

export function getUserInfo(): User {
  return JSON.parse(localStorage.getItem('userInfo')!)
}

export default function Chat() {
  const socketRef = useRef<Socket>()
  const [roomId, setChatroomId] = useState<number>()

  useEffect(() => {
    if (!roomId) {
      return
    }
    const socket = (socketRef.current = io('http://localhost:3005'))
    socket.on('connect', () => {
      const payload: JoinRoomPayload = {
        chatroomId: roomId,
        userId: getUserInfo().id,
      }

      socket.emit('joinRoom', payload)

      socket.on('message', (reply: Reply) => {
        if (reply.type === 'sendMessage') {
          // queryChatHistoryList(roomId)
          setChatHistory((chatHistory) => {
            return chatHistory ? [...chatHistory, reply.message] : [reply.message]
          })
          setTimeout(() => {
            document.getElementById('bottom-bar')?.scrollIntoView({ block: 'end' })
          }, 300)
        }
      })
    })
    return () => {
      socket.disconnect()
    }
  }, [roomId])

  function sendMessage(value: string) {
    if (!value) {
      return
    }
    if (!roomId) {
      return
    }

    const payload: SendMessagePayload = {
      sendUserId: getUserInfo().id,
      chatroomId: roomId,
      message: {
        type: 'text',
        content: value,
      },
    }

    socketRef.current?.emit('sendMessage', payload)
  }

  const [chatHistory, setChatHistory] = useState<Array<ChatHistory>>()

  const [roomList, setRoomList] = useState<Array<Chatroom>>()

  const userInfo = getUserInfo()

  async function queryChatroomList() {
    try {
      const res = await chatroomList('room-1')

      if (res.status === 201 || res.status === 200) {
        setRoomList(
          res.data.map((item: Chatroom) => {
            return {
              ...item,
              key: item.id,
            }
          }),
        )
      }
    }
    catch (e: any) {
      message.error(e.response?.data?.message || '系统繁忙，请稍后再试')
    }
  }

  useEffect(() => {
    queryChatroomList()
  }, [])

  async function queryChatHistoryList(chatroomId: number) {
    try {
      const res = await chatHistoryList(chatroomId)

      if (res.status === 201 || res.status === 200) {
        setChatHistory(
          res.data.map((item: Chatroom) => {
            return {
              ...item,
              key: item.id,
            }
          }),
        )
      }
    }
    catch (e: any) {
      message.error(e.response?.data?.message || '系统繁忙，请稍后再试')
    }
  }
  const [inputText, setInputText] = useState('')

  return (
    <div className="relative flex m-5 w-[800px] h-[600px]">
      <div className="w-[150px] border border-black overflow-auto">
        {roomList?.map((item) => {
          return (
            <div
              className=""
              key={item.id}
              data-id={item.id}
              onClick={() => {
                queryChatHistoryList(item.id)
                setChatroomId(item.id)
              }}
            >
              {item.name}
            </div>
          )
        })}
      </div>
      <div className="border border-black flex-1 overflow-auto">
        {chatHistory?.map((item) => {
          return (
            <div
              className={`p-5 flex flex-wrap ${item.senderId === userInfo.id ? 'text-right justify-end' : ''}`}
              key={item.id}
              data-id={item.id}
            >
              <div className="w-full">
                <img className="w-5 h-5 pr-2.5" src={item.sender.headPic} />
                <span className="sender-nickname">{item.sender.nickName}</span>
              </div>
              <div
                className={`border border-black px-5 py-2.5 rounded bg-sky-600 ${item.senderId === userInfo.id ? 'text-right justify-end bg-white' : ''}`}
              >
                {item.content}
              </div>
            </div>
          )
        })}
        <div id="bottom-bar" key="bottom-bar"></div>
      </div>
      <div className="w-[648px] border border-black h-[100px] absolute bottom-0 right-0">
        <div className="flex">
          <div className="w-[100px] hover:font-bold cursor-pointer" key={1}>
            表情
          </div>
          <div className="w-[100px] hover:font-bold cursor-pointer" key={2}>
            图片
          </div>
          <div className="w-[100px] hover:font-bold cursor-pointer" key={3}>
            文件
          </div>
        </div>
        <div className="flex w-[650px]">
          <TextArea
            className="message-input-box"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value)
            }}
          />
          <Button
            className="w-12 h-12"
            type="primary"
            onClick={() => {
              sendMessage(inputText)
              setInputText('')
            }}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}
