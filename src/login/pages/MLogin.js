import React, {Component} from 'react';
import { withStyles } from "@material-ui/core/styles";
import {Avatar, Button, CssBaseline, TextField,Link,Grid,Box,Typography,Container} from '@material-ui/core';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import Copyright from "../components/copyright"
import Snackbar from '@material-ui/core/Snackbar';
import axios from "axios"
import { Redirect } from "react-router"
import MuiAlert from '@material-ui/lab/Alert';



//Material UI theme//
const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});


class MLogin extends Component {
  
  constructor(props) {
    super()


    //states needed for logins
    this.state = {
      open : false,
      email:"",
      password:"",
      fireRedirect: false
    }


    //our binders for our functions
    this.changeEmail = this.changeEmail.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  //changes email state to current value
  changeEmail(event) {
    this.setState({
      email:event.target.value
    })
  }

  //changes password to current value
  changePassword(event) {
    this.setState({
      password:event.target.value
    })
  }

  //changes open state for our snackbar
  handleClick = () =>{
    this.setState({open: true})
  }

  //handles a clickaway close for our snackbar
  handleClose = (reason) => {
    if(reason ==="clickaway") {
      return
    }
    this.setState({open: false})
  }

  //submit and send to database to recieve token and response
  onSubmit(event){
    event.preventDefault()

    const signin = {
      email: this.state.email,
      password: this.state.password
    }
    
    //Posts info to database, if 200 response, redirects to home
    axios.post("http://ec2-34-245-24-4.eu-west-1.compute.amazonaws.com:5000/login/manager", signin, {withCredentials:true})
    .then(response => { 
      this.setState({
      email:"",
      password:"",
      fireRedirect: true,
      })
      //sets our login type to be "manager"
      this.props.Logintype("manager")
    }).catch(e => {
      this.setState({
        open:true
      })
    })
    

  }


  render() {

    const { classes } = this.props;
    const { fireRedirect } = this.state
    

  return (



    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <SupervisedUserCircleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ThinkShift Manager Sign in
        </Typography>
        <form onSubmit={this.onSubmit} className={classes.form} data-testid ="form">
          <TextField  data-testid ="email"
            onChange={this.changeEmail}
            value={this.state.email}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField  data-testid ="password"
            onChange = {this.changePassword}
            value={this.state.password}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <div>
          <Button
            label="Button"
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            data-testid="button"
          >
            Sign In
          </Button>
          </div>
          <Button
            variant="link"
            href="/elogin"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
            Employee login
          </Button>

          <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}

           open={this.state.open} autoHideDuration={2000} onClose={this.handleClose}>

          <MuiAlert elevation={6} variant="filled" onClose={this.handleClose} severity="error">
            Login Failed! Please Try Again.
          </MuiAlert>

      </Snackbar>

          <Grid container>
            <Grid item xs>


            </Grid>
            <Grid item>
              <Link href="http://ec2-34-245-24-4.eu-west-1.compute.amazonaws.com:3000/signup" variant="body2">
                {"Don't have an account? Sign Up!"}
              </Link>
            </Grid>
            <Grid item>
            </Grid>
          </Grid>
        </form>

        {/* redirects to home */}
        {fireRedirect && (
          <Redirect to={"/emp"}/>
        )}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}}

export default withStyles(styles, { withTheme: true })(MLogin);