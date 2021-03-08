import ReactDOM from "react-dom"
import ELogin from "../pages/ELogin"
import {render, cleanup} from "@testing-library/react"
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



it("matches snapshot", () => {
    const tree = renderer.create(<ELogin/>).toJSON()
    expect(tree).toMatchSnapshot()
})