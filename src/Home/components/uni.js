import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {
  ViewState, EditingState, GroupingState, IntegratedGrouping, IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Resources,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  GroupingPanel,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  DragDropProvider,
  CurrentTimeIndicator,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';
import axios from "axios"
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));



//a quick random color generator
const randomColor = () => "#" + Math.floor(Math.random()*16777215).toString(16);


const groupOrientation = viewName => viewName.split(' ')[0];
const grouping = [{
  resourceName: 'staffId',
}];


export default function Timetable() {
  const classes = useStyles();

  //Our route to get a specific employee timetable
  const emp = 'http://ec2-34-245-24-4.eu-west-1.compute.amazonaws.com:5000/manager/employees'
  const time = "http://ec2-34-245-24-4.eu-west-1.compute.amazonaws.com:5000/manager/timetable"
  const posty = "http://ec2-34-245-24-4.eu-west-1.compute.amazonaws.com:5000/manager/timetable"
  const notify = "http://ec2-34-245-24-4.eu-west-1.compute.amazonaws.com:5000/manager/timetable/send"

  //Creating state const
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("Employees Have Been Notified!")
  const[snack, setSnack] = React.useState("success")

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
            axios.get(emp, {withCredentials:true}),
            axios.get(time, {withCredentials:true})
          ]
        ).then(ret => {
          let employees = ret[0].data
          let app = ret[1].data
          setData(app.map(e =>({
            ...e, 
            startDate: new Date(e.startDate),
            endDate: new Date(e.endDate)
          })) )
          setStaff([
            {
              fieldName: 'staffId',
              title: 'Staff',
              instances: employees.map(e => ({
                text: e.name,
                id: e._id,
                color: randomColor()
              }))
              }
          ])
        })
  }, [])
  
  const postChanges = (input) => {
    axios.post(posty, input, {withCredentials:true}).then(res => console.log(res))
  } 


  const onCommitChanges = React.useCallback(({ added, changed, deleted }) => {
    if (added) {
      const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
      setData([...data, { id: startingAddedId, ...added }])
      postChanges([...data, { id: startingAddedId, ...added }])
       
    }
    if (changed) {
      setData(data.map(appointment => (
        changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment)))

        postChanges(data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment)))
        
    }
    if (deleted !== undefined) {
      setData(data.filter(appointment => appointment.id !== deleted))
      postChanges(data.filter(appointment => appointment.id !== deleted))
      
    }
  }, [setData, data]);


  const publish = () => {
    axios.get(notify, {withCredentials:true}).then(res => console.log(res.status)).catch(e => {
      if (e.response.status !== 200) {
        setMsg("Sorry, It's Been Too Soon Since Your Last Email!")
        setSnack("error")
      }
    })
    setOpen(true)
  }

  const handleClose = (reason) => {
    if(reason ==="clickaway") {
      return
    }
    setOpen(false)
  }

  return (
    <div>
      <div className={classes.root}>
      <Tooltip title="Inform Employees Via Email"> 
      <Button onClick={publish} variant="contained" color="secondary" >
        Notify Employees
      </Button>
      </Tooltip>
      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}

           open={open} autoHideDuration={2000} onClose={handleClose}>

          <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={snack}>
          {msg}
          </MuiAlert>

      </Snackbar>
      </div>
    <Paper>
      
      {(staff[0].instances.length !== 0) &&
      <Scheduler
        data={data}
        height={900}
      >
        <ViewState
          defaultCurrentDate = {Date.parse(new Date())}
        />
        <EditingState
          onCommitChanges={onCommitChanges}
        />
        <GroupingState
          grouping={grouping}
          groupOrientation={groupOrientation}
        />
        <WeekView
          startDayHour={8}
          endDayHour={20}
          excludedDays={[]}
          cellDuration={60}
          name="Vertical Orientation"
        />
        <WeekView
          startDayHour={6}
          endDayHour={23}
          excludedDays={[]}
          name="Horizontal Orientation"
        />
        <Appointments />
        <Resources
          data={staff}
          mainResourceName="staffId"
        />
        <IntegratedGrouping />
        <IntegratedEditing />
        <AppointmentTooltip />
        <AppointmentForm />
        <GroupingPanel />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <DragDropProvider />
        <CurrentTimeIndicator />
      </Scheduler>
}

    </Paper>
    </div>
    
  );
};
