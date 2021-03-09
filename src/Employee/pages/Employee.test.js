
import ReactDOM from "react-dom"
import Employee from './Employee';
import EmployeeForm from "../components/EmployeeForm"
import { act } from 'react-dom/test-utils'
import {render, fireEvent, cleanup} from "@testing-library/react"

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


describe("Employee check", () => {
  describe("with valid inputs", () => {
    it('calls the onSubmit function', async () => {
      const mockOnSubmit = jest.fn()
      const {getByLabelText, getByRole} = render(<EmployeeForm onSubmit={mockOnSubmit}/>)

      await act(async () => {
        fireEvent.change(getByLabelText("Full Name"), {target: {value: "Test Test"}})
        fireEvent.change(getByLabelText("Email"), {target: {value: "test@gmail.com"}})
        fireEvent.change(getByLabelText("PIN Number"), {target: {value: 1234}})
        fireEvent.change(getByLabelText("Department"), {target: {value: "Kitchen"}})
        fireEvent.change(getByLabelText("Mobile Number"), {target: {value: "0876666666"}})
      })

      await act(async () => {
        fireEvent.click(getByRole("button"))
      })

      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })
})