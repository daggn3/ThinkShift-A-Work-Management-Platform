import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';



//MaterialUI theme
const styles = theme => ({

    nav:{
        backgroundColor:'#3f51b5'
    },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  homeButton: {
    justifyContent:"flex-start"
  },
  title: {
    flexGrow: 1,
  },
});

class Empnav extends Component {
    constructor(props){
      super()
    }



  //take in our cookie
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
    };

    //removes the cookie when logging out
    logout = (e) => {
      const { cookies } = this.props;
      cookies.remove('thinkToken');
      window.location.href = '/elogin';
  // return false;
      }
  render() {
    const { classes } = this.props;



  return (
    <div className={classes.root}>
      <AppBar className = {classes.nav} position="static">
        <Toolbar>
          <SupervisedUserCircleIcon fontSize="large"/>
          <Typography variant="h6" className={classes.title}>
            ThinkShift
          </Typography>
          <IconButton onClick={this.logout} startIcon={<ExitToAppIcon />} edge="start" className={classes.homeButton} color="inherit" aria-label="menu">
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
}



export default withCookies(withStyles(styles, { withTheme: true })(Empnav));