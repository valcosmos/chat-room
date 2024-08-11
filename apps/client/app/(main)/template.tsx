import React from 'react'
import HeaderUser from './HeaderUser'
import Menu from './Menu'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-20 border-b flex justify-between items-center px-5">
        <h1 className="text-4xl">聊天室</h1>
        <HeaderUser />
      </div>
      <div className="flex-1">
        <div className="flex">
          <div className="w-52">
            <Menu />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
