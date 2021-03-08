import React from "react"
import Nav from "../components/Nav"
import Timetable from "../components/uni"
import Emptimetable from "../components/emptable"
import Empnav from "../components/Empnav"


function Home(props){
    if (props.login === "employee") {   
        return (
            <div>
                <Empnav login={props.login}/>
            < Emptimetable login={props.login}/>
            </div>
        )


    }

    

   else {
    return (
        <div>
                <Nav login={props.login}/>
    
            <Timetable login={props.login} />

        </div>
    )
   }
}

export default Home