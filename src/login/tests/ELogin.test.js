import ReactDOM from "react-dom"
import ELogin from "../pages/ELogin"
import {render, cleanup, shallow, mount, act, fireEvent, getByText} from "@testing-library/react"
import renderer from "react-test-renderer"

afterEach(cleanup)

it("renders without crashing", () => {
  const elog = document.createElement("elog")
  ReactDOM.render(<ELogin />, elog)
})

//quick tests to make sure Text fields render


it("renders correctly", () => {
    const {getByTestId} = render(<ELogin />)
    expect(getByTestId("email")).toHaveTextContent("Email Address")
    expect(getByTestId("password")).toHaveTextContent("Password")
})

describe("Login", () => {
  describe("with valid inputs", () => {
    it('calls the onSubmit function', async () => {
      const mockOnSubmit = jest.fn()
      const {getByLabelText, getByText} = render(<ELogin onSubmit={mockOnSubmit}/>)

      await act(async () => {
        
        fireEvent.change(getByLabelText("Email"), {target: {value: "test@gmail.com"}})
        fireEvent.change(getByLabelText("Password"), {target: {value: "1234"}})
      })

      await act(async () => {
        fireEvent.click(getByText("button"))
      })

      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })
})


it("matches snapshot", () => {
    const tree = renderer.create(<ELogin/>).toJSON()
    expect(tree).toMatchSnapshot()
})