import 'devextreme/dist/css/dx.common.css';
import React, {useState} from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Elogin from "./login/pages/ELogin"
import MLogin from "../src/login/pages/MLogin"
import Home from "./Home/pages/Home"
import Employee from "./Employee/pages/Employee"
import SignUp from './Signup/pages/Signup';
import { func } from 'prop-types';

const App = () => {

  //create a state based on our login
  const[login, Setlogin] = useState("")


  //will be used as props for other components
  const Logintype = (type) => {
    if (type === "manager"){
      Setlogin("manager")

    }
    else if (type === "employee") {
      Setlogin("employee")

    }
    
  }
  
  return (

    <Router>
      <Switch>
      <Route path="/" exact>
        <MLogin Logintype = {Logintype} />
      </Route>
      <Route path="/Elogin" exact>
      <Elogin Logintype = {Logintype} />
      </Route>
      <Route path="/time" exact>
      <Home login = {login}/>
      </Route>
      <Route exact path="/emp" component={Employee}/>
      <Route path="/signup" exact>
      <SignUp />
      </Route>
      </Switch>
    </Router>

  )
}

export default App;

