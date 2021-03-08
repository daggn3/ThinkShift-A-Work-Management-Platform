import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import {Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container} from '@material-ui/core';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import Copyright from "../../login/components/copyright"
import axios from "axios"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Redirect } from "react-router"




//Material UI theme
const styles = theme => ({
  paper: {
    marginTop: theme.spacing(9),
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
    marginTop: theme.spacing(3),
    alignItems:"center",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    textAlign:"center",
  },

});

class SignUp extends Component {

  constructor() {
    super()

    //Setting our info states
    this.state = {
      name:"",
      email:"",
      password:"",
      open:false,
      fireRedirect: false
    }


    //our binders for our functions
    this.changeFullName = this.changeFullName.bind(this)
    this.changeEmail = this.changeEmail.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }


  //change name, email and password functions
  changeFullName(event) {
    this.setState({
      name:event.target.value
    })
  }

  changeEmail(event) {
    this.setState({
      email:event.target.value
    })
  }

  changePassword(event) {
    this.setState({
      password:event.target.value
    })
  }

  //event handlers for our snackbar
  handleClick = () =>{
    this.setState({open: true})
  }

  handleClose = (reason) => {
    if(reason ==="clickaway") {
      return
    }
    this.setState({open: false})
  }

  //onSubmit handler to send response to backend and retrieve token
  onSubmit(event){
    event.preventDefault()

    const registered = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }
    
    //posts info to database, if response 200, redirect to login page
    axios.post("http://localhost:5000/login/create", registered)
    .then(response => {
      this.setState({
        fireRedirect: true,
        })
        console.log(response.data)
    })

    this.setState({
      name:"",
      email:"",
      password:"",
      open:true
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
          ThinkShift Manager Sign Up
        </Typography>
        <div>
        <form onSubmit={this.onSubmit} className={classes.form} data-testid ="form">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField data-testid ="name"
                onChange={this.changeFullName}
                value={this.state.name}
                autoComplete="full name"
                name="Full Name"
                variant="outlined"
                required
                fullWidth
                id="fullname"
                label="Full Name"
                autoFocus
              />
              
              
            </Grid>
            <Grid item xs={12} sm={6}>
            </Grid>
            <Grid item xs={12}>
              <TextField data-testid ="email"
                onChange={this.changeEmail}
                value={this.state.email}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField data-testid ="password"
                onChange = {this.changePassword}
                value={this.state.password}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            title = "submit-button"
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          

          <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
           open={this.state.open} autoHideDuration={6000} onClose={this.handleClose}>
          <MuiAlert elevation={6} variant="filled" onClose={this.handleClose} severity="success">
            Sign Up Successful!
          </MuiAlert>
      </Snackbar>

          <Grid container justify="flex-end">
            <Grid item>

              <Link className={classes.link} href="http://localhost:3000" variant="body2">
                Already have an account? Sign in!
              </Link>

            </Grid>
          </Grid>
        </form>
        </div>
        {/*redirect state to login */}
         {fireRedirect && (
          <Redirect to={"/"}/> 
        )}

      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
  }
}

export default withStyles(styles, { withTheme: true })(SignUp);