
import ReactDOM from "react-dom"
import Employee from './Employee';
import EmployeeForm from "../components/EmployeeForm"

import {render, cleanup} from "@testing-library/react"

afterEach(cleanup)


it("renders without crashing", () => {
  const emp = document.createElement("emp")
  ReactDOM.render(<Employee />, emp)
})

it("renders correctly", () => {
    const {getByTestId} = render(<EmployeeForm />)
    expect(getByTestId("name")).toHaveTextContent("Full Name")
    expect(getByTestId("email")).toHaveTextContent("Email")
    expect(getByTestId("password")).toHaveTextContent("PIN Number")
    expect(getByTestId("department")).toHaveTextContent("Department")
    expect(getByTestId("mobile")).toHaveTextContent("Mobile")
    
})