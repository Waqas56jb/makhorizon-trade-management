import { useMemo } from 'react'
import { useEmployee } from '../lib/auth'
import { myDocuments, myNotifications, myOrders, myShipments, myTasks } from '../lib/selectors'
import { useAppState } from '../lib/store'

/** Everything visible to the signed-in employee, derived from the demo store. */
export default function useMine() {
  const s = useAppState()
  const employee = useEmployee()
  const id = employee?.id
  return useMemo(
    () => ({
      state: s,
      employee,
      tasks: myTasks(s, id),
      orders: myOrders(s, id),
      shipments: myShipments(s, id),
      documents: myDocuments(s, id),
      notifications: myNotifications(s, id),
      activity: s.activity.filter((a) => a.employeeId === id),
      orderById: (oid) => s.orders.find((o) => o.id === oid && o.assignedTo === id),
      shipmentById: (sid) => s.shipments.find((x) => x.id === sid && x.assignedTo === id),
    }),
    [s, employee, id],
  )
}
