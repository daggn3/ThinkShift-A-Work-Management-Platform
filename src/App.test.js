

import ReactDOM from "react-dom"
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect'
import { App, LocationDisplay } from './App'



it("renders without crashing", () => {
  const div = document.createElement("div")
  ReactDOM.render(<App />, div)
})

test('full app rendering/navigating', () => {
  const history = createMemoryHistory()
  render(
    <Router history={history}>
      <App />
    </Router>
  )
  // verify page content for expected route
  // often you'd use a data-testid or role query, but this is also possible
  expect(screen.getByText(/You are on the Login page/i)).toBeInTheDocument()})