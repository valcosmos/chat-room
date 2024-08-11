'use client'

import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, Table, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { chatroomList } from '@/interface'

interface SearchGroup {
  name: string
}

interface GroupSearchResult {
  id: number
  name: string
  createTime: Date
}

export default function Group() {
  const [groupResult, setGroupResult] = useState<Array<GroupSearchResult>>([])

  const columns: ColumnsType<GroupSearchResult> = useMemo(
    () => [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
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

  const searchGroup = async (values: SearchGroup) => {
    try {
      const res = await chatroomList(values.name || '')

      if (res.status === 201 || res.status === 200) {
        setGroupResult(
          res.data.map((item: GroupSearchResult) => {
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
    </div>
  )
}
