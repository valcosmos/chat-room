'use client'
import { Button, Form, Input, Table, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useMemo, useState } from 'react'
import { friendshipList } from '@/interface'

interface SearchFriend {
  name: string
}

interface FriendshipSearchResult {
  id: number
  username: string
  nickName: string
  headPic: string
  email: string
}

export default function Home() {
  const [friendshipResult, setFriendshipResult] = useState<Array<FriendshipSearchResult>>([])

  const columns: ColumnsType<FriendshipSearchResult> = useMemo(
    () => [
      {
        title: '昵称',
        dataIndex: 'nickName',
      },
      {
        title: '头像',
        dataIndex: 'headPic',
        render: (_, record) => (
          <div>
            <img src={record.headPic} />
          </div>
        ),
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '操作',
        render: (_, _record) => (
          <div>
            <a href="#">聊天</a>
          </div>
        ),
      },
    ],
    [],
  )

  const searchFriend = async (values: SearchFriend) => {
    try {
      const res = await friendshipList(values.name || '')

      if (res.status === 201 || res.status === 200) {
        setFriendshipResult(
          res.data.map((item: FriendshipSearchResult) => {
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

  const [form] = useForm()

  useEffect(() => {
    searchFriend({
      name: form.getFieldValue('name'),
    })
  }, [])

  return (
    <div className="p-5">
      <div className="mb-8">
        <Form form={form} onFinish={searchFriend} name="search" layout="inline" colon={false}>
          <Form.Item label="名称" name="name">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="friendship-table">
        <Table columns={columns} dataSource={friendshipResult} style={{ width: '1000px' }} />
      </div>
    </div>
  )
}
