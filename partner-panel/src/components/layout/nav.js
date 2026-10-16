// Partner navigation. `badge` keys map to counts computed in the sidebar.
import { Bell, Building2, ClipboardList, FileText, FolderOpen, LayoutDashboard, LifeBuoy, MessagesSquare, Search, Settings, Ship, Users } from 'lucide-react'

export const NAV_GROUPS = [
  {
    label: 'Business',
    items: [
      { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      { to: '/opportunities', label: 'Trade Opportunities', icon: Search },
      { to: '/quotations', label: 'Quotations', icon: FileText, badge: 'quotations' },
      { to: '/orders', label: 'Orders', icon: ClipboardList, badge: 'orders' },
      { to: '/shipments', label: 'Shipments', icon: Ship },
      { to: '/documents', label: 'Documents', icon: FolderOpen, badge: 'documents' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { to: '/messages', label: 'Messages', icon: MessagesSquare, badge: 'messages' },
      { to: '/notifications', label: 'Notifications', icon: Bell, badge: 'notifications' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/company-profile', label: 'Company Profile', icon: Building2 },
      { to: '/users', label: 'Team Members', icon: Users },
      { to: '/settings', label: 'Settings', icon: Settings },
      { to: '/help', label: 'Help & Support', icon: LifeBuoy },
    ],
  },
]

export const NAV = NAV_GROUPS.flatMap((g) => g.items)

export const sectionFor = (pathname) => NAV.find((n) => pathname === n.to || pathname.startsWith(`${n.to}/`))
