
import ReactDOM from "react-dom"
import MLogin from '../pages/MLogin';
import {render, cleanup, shallow, mount, act, fireEvent} from "@testing-library/react"
import renderer from "react-test-renderer"


afterEach(cleanup)

it("renders without crashing", () => {
  const mlog = document.createElement("mlog")
  ReactDOM.render(<MLogin />, mlog)
})


describe("submit works", () => {
  it("submits", () => {
    const log = render(<MLogin/>)
    const spy = jest.spyOn(MLogin.prototype, "onSubmit")
    const p = log.find("Button")
    p.simulate("submit")
    expect(spy).toHaveBeenCalled()
  })
})


//quick tests to make sure Text fields render

it("renders correctly", () => {
    const {getByTestId} = render(<MLogin />)
    expect(getByTestId("email")).toHaveTextContent("Email Address")
    expect(getByTestId("password")).toHaveTextContent("Password")
})

// it("matches snapshot", () => {
//     const tree = renderer.create(<MLogin/>).toJSON()
//     expect(tree).toMatchSnapshot()
// })