import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { PageLoader } from './components/ui/States'
import { RequireAuth } from './lib/auth'

const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Clients = lazy(() => import('./pages/Clients'))
const ClientDetails = lazy(() => import('./pages/ClientDetails'))
const Suppliers = lazy(() => import('./pages/Suppliers'))
const SupplierDetails = lazy(() => import('./pages/SupplierDetails'))
const Quotations = lazy(() => import('./pages/Quotations'))
const QuotationEditor = lazy(() => import('./pages/QuotationEditor'))
const QuotationDetails = lazy(() => import('./pages/QuotationDetails'))
const Orders = lazy(() => import('./pages/Orders'))
const OrderDetails = lazy(() => import('./pages/OrderDetails'))
const Shipments = lazy(() => import('./pages/Shipments'))
const ShipmentDetails = lazy(() => import('./pages/ShipmentDetails'))
const Inventory = lazy(() => import('./pages/Inventory'))
const InventoryDetails = lazy(() => import('./pages/InventoryDetails'))
const Finances = lazy(() => import('./pages/Finances'))
const InvoiceDetails = lazy(() => import('./pages/InvoiceDetails'))
const Documents = lazy(() => import('./pages/Documents'))
const DocumentDetails = lazy(() => import('./pages/DocumentDetails'))
const Partners = lazy(() => import('./pages/Partners'))
const PartnerDetails = lazy(() => import('./pages/PartnerDetails'))
const Reports = lazy(() => import('./pages/Reports'))
const Settings = lazy(() => import('./pages/Settings'))
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
        <Route path="clients" element={<Clients />} />
        <Route path="clients/:id" element={<ClientDetails />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="suppliers/:id" element={<SupplierDetails />} />
        <Route path="quotations" element={<Quotations />} />
        <Route path="quotations/new" element={<QuotationEditor />} />
        <Route path="quotations/:id" element={<QuotationDetails />} />
        <Route path="quotations/:id/edit" element={<QuotationEditor />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="shipments" element={<Shipments />} />
        <Route path="shipments/:id" element={<ShipmentDetails />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="inventory/:id" element={<InventoryDetails />} />
        <Route path="finances" element={<Finances />} />
        <Route path="finances/invoices/:id" element={<InvoiceDetails />} />
        <Route path="documents" element={<Documents />} />
        <Route path="documents/:id" element={<DocumentDetails />} />
        <Route path="partners" element={<Partners />} />
        <Route path="partners/:id" element={<PartnerDetails />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
