'use client'

import type { MenuProps } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { Menu as AMenu } from 'antd'

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '好友',
  },
  {
    key: '2',
    label: '群聊',
  },
  {
    key: '3',
    label: '聊天',
  },
  {
    key: '4',
    label: '收藏',
  },
  {
    key: '5',
    label: '通知',
  },
]

export default function Menu() {
  const pathname = usePathname()
  const router = useRouter()

  const handleMenuItemClick: MenuProps['onClick'] = (info) => {
    let path = ''
    switch (info.key) {
      case '1':
        path = '/'
        break
      case '2':
        path = '/group'
        break
      case '3':
        path = '/chat'
        break
      case '4':
        path = '/collection'
        break
      case '5':
        path = '/notification'
        break
    }
    router.push(path)
  }

  function getSelectedKeys() {
    if (pathname === '/group') {
      return ['2']
    }
    else if (pathname === '/chat') {
      return ['3']
    }
    else if (pathname === '/collection') {
      return ['4']
    }
    else if (pathname === '/notification') {
      return ['5']
    }
    else {
      return ['1']
    }
  }
  return (
    <AMenu
      defaultSelectedKeys={getSelectedKeys()}
      items={items}
      onClick={handleMenuItemClick}
    />
  )
}
