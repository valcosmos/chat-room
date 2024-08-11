'use client'

import { UserOutlined } from '@ant-design/icons'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function HeaderUser() {
  const [headPic, setHeadPic] = useState()

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const info = JSON.parse(userInfo)
      setHeadPic(info.headPic)
    }
  }, [])

  return (
    <Link href="/update-info">
      {headPic
        ? (
            <img src={headPic} width={40} height={40} className="icon" />
          )
        : (
            <UserOutlined className="text-4xl" />
          )}
    </Link>
  )
}
