import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  ViewState, EditingState, GroupingState, IntegratedGrouping, IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Resources,
  WeekView,
  Appointments,
  GroupingPanel,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AppointmentTooltip,
  CurrentTimeIndicator,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';
import axios from "axios"
import { data as appointments } from '../components/appointments';

//a quick random color generator
const randomColor = () => "#" + Math.floor(Math.random()*16777215).toString(16);


const groupOrientation = viewName => viewName.split(' ')[0];
const grouping = [{
  resourceName: 'staffId',
}];


export default function Emptimetable() {


    //Our route to get a specific employee timetable
  const specemp = "http://localhost:5000/employee/schedule"


  //Creating state const
  const [data, setData] = React.useState(appointments);


  //Create our staff state to a specific frame
  const [staff, setStaff] = React.useState([
    {
      fieldName: 'staffId',
      title: 'Staff',
      instances: []
      }
  ])

  React.useEffect(() => {

    //setting our state for our employee and their timetable
         Promise.all(
          [
            axios.get(specemp, {withCredentials:true})
          ]
        ).then(ret => {
          let app = ret[0].data
          setData(app.map(e =>({
            ...e, 
            startDate: new Date(e.startDate),
            endDate: new Date(e.endDate)
          })) )
          setStaff([{
            fieldName: 'staffId',
            title: 'Staff',
            instances: [
              {text: window.sessionStorage.getItem("name"),
              id: window.sessionStorage.getItem("id"),
              color: randomColor()}]}

          ])
          
        })
  }, [])
  
  return (
    <Paper>
      {(staff[0].instances.length !== 0) &&
      <Scheduler
        data={data}
        height={900}
      >
        <ViewState
          defaultCurrentDate= {Date.parse(new Date())}
        />
        <GroupingState
          grouping={grouping}
          groupOrientation={groupOrientation}
        />
        <WeekView
          startDayHour={8}
          endDayHour={24}
          excludedDays={[]}
          cellDuration={60}
          name="Vertical Orientation"
        />
        <WeekView
          startDayHour={6}
          endDayHour={23}
          excludedDays={[0, 6]}
          name="Horizontal Orientation"
        />
        <Appointments />
        <Resources
          data={staff}
          mainResourceName="staffId"
        />
        <IntegratedGrouping />
        <AppointmentTooltip />
        <GroupingPanel />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <CurrentTimeIndicator />
      </Scheduler>
}
    </Paper>
  );
};
