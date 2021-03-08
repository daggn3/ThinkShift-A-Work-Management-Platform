
import ReactDOM from "react-dom"
import Signup from "../pages/Signup";
import {render, fireEvent, cleanup} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import renderer from "react-test-renderer"


afterEach(cleanup)

//basic test to make sure page functions
it("renders without crashing", () => {
  const signup = document.createElement("signup")
  ReactDOM.render(<Signup />, signup)
})


it("check button render", () => {
    const { queryByTitle } = render(<Signup />)
    const btn = queryByTitle("submit-button")
    expect(btn).toBeTruthy()
})



//quick tests to make sure Text fields render
it("renders correctly", () => {
    const {getByTestId} = render(<Signup />)
    expect(getByTestId("name")).toHaveTextContent("Full Name")
    expect(getByTestId("email")).toHaveTextContent("Email Address")
    expect(getByTestId("password")).toHaveTextContent("Password")

})

// it("matches snapshot", () => {
//     const tree = renderer.create(<Signup/>).toJSON()
//     expect(tree).toMatchSnapshot()
// })