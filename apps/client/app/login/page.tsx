'use client'

import { Button, Form, Input, message } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'
import { login } from '@/interface'

interface LoginUser {
  username: string
  password: string
}

const layout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

const layout2 = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
}

export default function page() {
  const router = useRouter()

  async function onFinish(values: LoginUser) {
    try {
      const res = await login(values.username, values.password)
      if (res.status === 201 || res.status === 200) {
        message.success('登录成功')

        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userInfo', JSON.stringify(res.data.user))
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    }
    catch (e: any) {
      message.error(e.response?.data?.message || '系统繁忙，请稍后再试')
    }
  }
  return (
    <div className="mx-auto text-center w-96 mt-28">
      <h1 className="mb-4 text-3xl font-bold">聊天室</h1>
      <Form {...layout1} onFinish={onFinish} colon={false} autoComplete="off">
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...layout2}>
          <div className="flex justify-between">
            <a href="/register">创建账号</a>
            <a href="/update_password">忘记密码</a>
          </div>
        </Form.Item>

        <Form.Item {...layout2}>
          <Button block type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
