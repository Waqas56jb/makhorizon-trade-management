/**
 * Inquiry submission service — FRONTEND DEMO MODE.
 *
 * No backend is connected yet. These functions simulate a network request so
 * the forms can show realistic loading and confirmation states. Nothing is
 * transmitted, stored, or delivered to MAKHORIZON, and no data is written to
 * localStorage.
 *
 * To integrate a real API later, replace `simulate()` inside each exported
 * function with a fetch/axios call to the server (e.g. POST /api/inquiries)
 * and set DEMO_MODE to false. The function signatures and return shape
 * ({ ok, reference, demo }) can stay the same so the UI needs no changes.
 */

export const DEMO_MODE = true

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function demoReference(prefix) {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6)
  return `${prefix}-DEMO-${stamp}`
}

async function simulate(prefix) {
  await wait(1200 + Math.random() * 600)
  // Simulated success only; nothing leaves the browser.
  return { ok: true, demo: DEMO_MODE, reference: demoReference(prefix) }
}

// eslint-disable-next-line no-unused-vars
export async function submitQuoteRequest(_data) {
  return simulate('QR')
}

// eslint-disable-next-line no-unused-vars
export async function submitContactMessage(_data) {
  return simulate('CT')
}

// eslint-disable-next-line no-unused-vars
export async function submitPartnershipInquiry(_data) {
  return simulate('PI')
}

// eslint-disable-next-line no-unused-vars
export async function subscribeToUpdates(_email) {
  return simulate('NL')
}
