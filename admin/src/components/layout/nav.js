// Main navigation (shared by the sidebar and header).
import {
  BarChart3,
  Boxes,
  ClipboardList,
  Factory,
  FileText,
  FolderOpen,
  Handshake,
  LayoutDashboard,
  Settings,
  Ship,
  Users,
  Wallet,
} from 'lucide-react'

export const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/suppliers', label: 'Suppliers', icon: Factory },
  { to: '/quotations', label: 'Quotations', icon: FileText },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/shipments', label: 'Shipments', icon: Ship, badge: 'shipments' },
  { to: '/inventory', label: 'Inventory', icon: Boxes, badge: 'inventory' },
  { to: '/finances', label: 'Finances', icon: Wallet, badge: 'finances' },
  { to: '/documents', label: 'Documents', icon: FolderOpen },
  { to: '/partners', label: 'Partners', icon: Handshake },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]
