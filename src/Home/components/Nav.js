import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EventIcon from '@material-ui/icons/Event';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';


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

class ButtonAppBar extends Component {
    constructor(props){
      super()
    }


  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
    };

    logout = (e) => {
      const { cookies } = this.props;
      cookies.remove('thinkToken');
      window.location.href = '/';
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
          <IconButton variant="link" edge="start" className={classes.homeButton} color="inherit" href="/time" aria-label="menu">
            <EventIcon />
          </IconButton>
          <IconButton variant="link" edge="start" className={classes.homeButton} color="inherit" href="/emp" aria-label="menu">
            <EmojiPeopleIcon />
          </IconButton>
          <IconButton onClick={this.logout}  edge="start" className={classes.homeButton} color="inherit" aria-label="menu">
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
}

export default withCookies(withStyles(styles, { withTheme: true })(ButtonAppBar));