import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { PageLoader } from './components/ui/States'
import { RequireAuth } from './lib/auth'

const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const MyTasks = lazy(() => import('./pages/MyTasks'))
const TaskDetails = lazy(() => import('./pages/TaskDetails'))
const MyOrders = lazy(() => import('./pages/MyOrders'))
const OrderDetails = lazy(() => import('./pages/OrderDetails'))
const MyShipments = lazy(() => import('./pages/MyShipments'))
const ShipmentDetails = lazy(() => import('./pages/ShipmentDetails'))
const Documents = lazy(() => import('./pages/Documents'))
const DocumentDetails = lazy(() => import('./pages/DocumentDetails'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Profile = lazy(() => import('./pages/Profile'))
const Help = lazy(() => import('./pages/Help'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="my-tasks" element={<MyTasks />} />
        <Route path="tasks/:id" element={<TaskDetails />} />
        <Route path="my-orders" element={<MyOrders />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="my-shipments" element={<MyShipments />} />
        <Route path="shipments/:id" element={<ShipmentDetails />} />
        <Route path="documents" element={<Documents />} />
        <Route path="documents/:id" element={<DocumentDetails />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
