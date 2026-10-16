import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { PageLoader } from './components/ui/States'
import { ProtectedRoute } from './lib/auth'

const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Opportunities = lazy(() => import('./pages/Opportunities'))
const OpportunityDetails = lazy(() => import('./pages/OpportunityDetails'))
const Quotations = lazy(() => import('./pages/Quotations'))
const QuotationForm = lazy(() => import('./pages/QuotationForm'))
const QuotationDetails = lazy(() => import('./pages/QuotationDetails'))
const Orders = lazy(() => import('./pages/Orders'))
const OrderDetails = lazy(() => import('./pages/OrderDetails'))
const Shipments = lazy(() => import('./pages/Shipments'))
const ShipmentDetails = lazy(() => import('./pages/ShipmentDetails'))
const Documents = lazy(() => import('./pages/Documents'))
const Messages = lazy(() => import('./pages/Messages'))
const Notifications = lazy(() => import('./pages/Notifications'))
const CompanyProfile = lazy(() => import('./pages/CompanyProfile'))
const TeamMembers = lazy(() => import('./pages/TeamMembers'))
const Settings = lazy(() => import('./pages/Settings'))
const Help = lazy(() => import('./pages/Help'))
const NotFound = lazy(() => import('./pages/NotFound'))

const publicPage = (Page) => (
  <Suspense fallback={<PageLoader />}>
    <Page />
  </Suspense>
)

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={publicPage(Login)} />
      <Route path="/forgot-password" element={publicPage(ForgotPassword)} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="opportunities/:id" element={<OpportunityDetails />} />
        <Route path="quotations" element={<Quotations />} />
        <Route path="quotations/new" element={<QuotationForm />} />
        <Route path="quotations/:id" element={<QuotationDetails />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="shipments" element={<Shipments />} />
        <Route path="shipments/:id" element={<ShipmentDetails />} />
        <Route path="documents" element={<Documents />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="company-profile" element={<CompanyProfile />} />
        <Route path="users" element={<TeamMembers />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
