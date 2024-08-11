import { UserOutlined } from '@ant-design/icons'
import React from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-20 border-b flex justify-between items-center px-5">
        <h1 className="text-4xl">聊天室</h1>
        <UserOutlined className="text-4xl" />
      </div>
      <div className="flex-1">
        { children}
      </div>
    </div>
  )
}
