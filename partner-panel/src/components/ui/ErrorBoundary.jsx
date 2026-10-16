import { Component } from 'react'
import { ErrorState } from './States'

/** Catches render errors in a page so the rest of the portal keeps working. */
export default class ErrorBoundary extends Component {
  state = { error: null, resetKey: this.props.resetKey }

  static getDerivedStateFromError(error) {
    return { error }
  }

  // Clear the error when the route changes.
  static getDerivedStateFromProps(props, state) {
    return props.resetKey !== state.resetKey ? { error: null, resetKey: props.resetKey } : null
  }

  render() {
    if (this.state.error)
      return (
        <div className="card">
          <ErrorState title="This page could not be displayed" message="An unexpected error occurred. Try again, or reset the demo data from Settings if the problem continues." onRetry={() => this.setState({ error: null })} />
        </div>
      )
    return this.props.children
  }
}
