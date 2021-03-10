// import ReactDOM from "react-dom"
// import MLogin from '../pages/MLogin';
// import {render, cleanup, shallow, mount, act, fireEvent, getByText} from "@testing-library/react"
// import renderer from "react-test-renderer"
// afterEach(cleanup)
// it("renders without crashing", () => {
//   const mlog = document.createElement("mlog")
//   ReactDOM.render(<MLogin />, mlog)
// })
// describe("Login", () => {
//   describe("with valid inputs", () => {
//     it('calls the onSubmit function', async () => {
//       const mockOnSubmit = jest.fn()
//       const {getByLabelText, getByText} = render(<MLogin onSubmit={mockOnSubmit}/>)
//       await act(async () => {
//         fireEvent.change(getByLabelText("Email"), {target: {value: "test@gmail.com"}})
//         fireEvent.change(getByLabelText("Password"), {target: {value: "pass123"}})
//       })
//       await act(async () => {
//         fireEvent.click(getByText("button"))
//       })
//       expect(mockOnSubmit).toHaveBeenCalled()
//     })
//   })
// })
// //quick tests to make sure Text fields render
// it("renders correctly", () => {
//     const {getByTestId} = render(<MLogin />)
//     expect(getByTestId("email")).toHaveTextContent("Email Address")
//     expect(getByTestId("password")).toHaveTextContent("Password")
// })
// it("matches snapshot", () => {
//     const tree = renderer.create(<MLogin/>).toJSON()
//     expect(tree).toMatchSnapshot()
// })
"use strict";