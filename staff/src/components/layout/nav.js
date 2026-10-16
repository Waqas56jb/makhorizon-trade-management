// Staff navigation — only the modules employees need.
import { Bell, ClipboardList, FolderOpen, LayoutDashboard, LifeBuoy, ListChecks, Ship, UserRound } from 'lucide-react'

export const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-tasks', label: 'My Tasks', icon: ListChecks, badge: 'tasks', match: ['/my-tasks', '/tasks'] },
  { to: '/my-orders', label: 'My Orders', icon: ClipboardList, match: ['/my-orders', '/orders'] },
  { to: '/my-shipments', label: 'My Shipments', icon: Ship, badge: 'shipments', match: ['/my-shipments', '/shipments'] },
  { to: '/documents', label: 'Documents', icon: FolderOpen },
  { to: '/notifications', label: 'Notifications', icon: Bell, badge: 'notifications' },
  { to: '/profile', label: 'My Profile', icon: UserRound },
  { to: '/help', label: 'Help & Instructions', icon: LifeBuoy },
]

export const sectionFor = (pathname) => NAV.find((n) => (n.match ?? [n.to]).some((m) => pathname.startsWith(m)))
