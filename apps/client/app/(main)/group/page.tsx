'use client'

import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, Table, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useRouter } from 'next/navigation'
import { MembersModal } from './MembersModal'
import { AddMemberModal } from './AddMemberModal'
import { CreateGroupModal } from './CreateGroupModal'
import { chatroomList } from '@/interface'

interface SearchGroup {
  name: string
}

interface GroupSearchResult {
  id: number
  name: string
  type: boolean
  userCount: number
  userIds: Array<number>
  createTime: Date
}

export default function Group() {
  const [groupResult, setGroupResult] = useState<Array<GroupSearchResult>>([])

  const [isMembersModalOpen, setMembersModalOpen] = useState(false)
  const [isMemberAddModalOpen, setMemberAddModalOpen] = useState(false)
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false)

  const [chatroomId, setChatroomId] = useState<number>(-1)

  const [queryKey, setQueryKey] = useState<string>('')

  const router = useRouter()

  const columns: ColumnsType<GroupSearchResult> = useMemo(
    () => [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (_, record) => {
          return new Date(record.createTime).toLocaleString()
        },
      },
      {
        title: '人数',
        dataIndex: 'userCount',
      },
      {
        title: '操作',
        render: (_, record) => (
          <div className="space-x-2">
            <a
              href="#"
              onClick={() => {
                router.push(`/chat?chatroomId=${record.id}`)
              }}
            >
              聊天
            </a>
            <a
              href="#"
              onClick={() => {
                setChatroomId(record.id)
                setMembersModalOpen(true)
              }}
            >
              详情
            </a>
            <a
              href="#"
              onClick={() => {
                setChatroomId(record.id)
                setMemberAddModalOpen(true)
              }}
            >
              添加成员
            </a>
          </div>
        ),
      },
    ],
    [],
  )

  const searchGroup = async (values: SearchGroup) => {
    try {
      const res = await chatroomList(values.name || '')

      if (res.status === 201 || res.status === 200) {
        setGroupResult(
          res.data
            .filter((item: GroupSearchResult) => {
              return item.type === true
            })
            .map((item: GroupSearchResult) => {
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
    searchGroup({
      name: form.getFieldValue('name'),
    })
  }, [])

  return (
    <div className="p-5">
      <div className="mb-8">
        <Form form={form} onFinish={searchGroup} name="search" layout="inline" colon={false}>
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
      <div className="group-table">
        <Table columns={columns} dataSource={groupResult} style={{ width: '1000px' }} />
      </div>

      <MembersModal
        isOpen={isMembersModalOpen}
        handleClose={() => {
          setMembersModalOpen(false)
        }}
        chatroomId={chatroomId}
        queryKey={queryKey}
      />

      <AddMemberModal
        isOpen={isMemberAddModalOpen}
        handleClose={() => {
          setMemberAddModalOpen(false)

          setQueryKey(Math.random().toString().slice(2, 10))
          searchGroup({
            name: form.getFieldValue('name'),
          })
        }}
        chatroomId={chatroomId}
      />
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        handleClose={() => {
          setCreateGroupModalOpen(false)

          searchGroup({
            name: form.getFieldValue('name'),
          })
        }}
      />
    </div>
  )
}
