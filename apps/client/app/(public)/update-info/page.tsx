'use client'

import { Button, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { HeadPicUpload } from './HeadPicUpload'
import { getUserInfo, updateInfo, updateUserInfoCaptcha } from '@/interface'

export interface UserInfo {
  headPic: string
  nickName: string
  email: string
  captcha: string
}

const layout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

export default function UpdateInfo() {
  const [form] = useForm()
  const _router = useRouter()

  useEffect(() => {
    async function query() {
      const res = await getUserInfo()

      if (res.status === 201 || res.status === 200) {
        form.setFieldValue('headPic', res.data.headPic)
        form.setFieldValue('nickName', res.data.nickName)
        form.setFieldValue('email', res.data.email)
        form.setFieldValue('username', res.data.username)
      }
    }
    query()
  }, [])

  const onFinish = async (values: UserInfo) => {
    try {
      const res = await updateInfo(values)
      if (res.status === 201 || res.status === 200) {
        message.success('用户信息更新成功')
        const userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
          const info = JSON.parse(userInfo)
          info.headPic = values.headPic
          info.nickName = values.nickName

          localStorage.setItem('userInfo', JSON.stringify(info))
        }
      }
    }
    catch (e: any) {
      message.error(e.response?.data?.message || '系统繁忙，请稍后再试')
    }
  }

  const sendCaptcha = async function () {
    try {
      const res = await updateUserInfoCaptcha()
      if (res.status === 201 || res.status === 200) {
        message.success('发送成功')
      }
    }
    catch (e: any) {
      message.error(e.response?.data?.message || '系统繁忙，请稍后再试')
    }
  }

  return (
    <div className="w-96 mx-auto mt-20">
      <Form form={form} {...layout1} onFinish={onFinish} colon={false} autoComplete="off">
        <Form.Item shouldUpdate label="头像" name="headPic" rules={[{ required: true, message: '请输入头像!' }]}>
          <HeadPicUpload />
        </Form.Item>

        <Form.Item label="昵称" name="nickName" rules={[{ required: true, message: '请输入昵称!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '请输入合法邮箱地址!' },
          ]}
        >
          <Input />
        </Form.Item>

        <div className="flex justify-end">
          <Form.Item
            label="验证码"
            name="captcha"
            rules={[{ required: true, message: '请输入验证码!' }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" onClick={sendCaptcha}>
            发送验证码
          </Button>
        </div>

        <Form.Item {...layout1} label=" ">
          <Button block type="primary" htmlType="submit">
            修改密码
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
