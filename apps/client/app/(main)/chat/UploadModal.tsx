'use client'

import { Modal } from 'antd'
import { useState } from 'react'
import { FileUpload } from './FileUpload'

interface UploadImageModalProps {
  isOpen: boolean
  handleClose: (imageSrc?: string) => void
  type: 'image' | 'file'
}

export function UploadModal(props: UploadImageModalProps) {
  const [imgSrc, setImgSrc] = useState<string>('')
  const [fileUrl, setFileUrl] = useState<string>('')

  return (
    <Modal
      title={`上传${props.type === 'image' ? '图片' : '文件'}`}
      open={props.isOpen}
      onOk={() => {
        props.handleClose(imgSrc)
        setImgSrc('')
      }}
      onCancel={() => props.handleClose()}
      okText="确认"
      cancelText="取消"
    >
      <FileUpload
        value={fileUrl}
        type={props.type}
        onChange={(value: string) => {
          setFileUrl(value)
        }}
      />
    </Modal>
  )
}
