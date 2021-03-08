
import ReactDOM from "react-dom"
import Home from '../Home';

it("renders without crashing", () => {
  const home = document.createElement("home")
  ReactDOM.render(<Home />, home)
})