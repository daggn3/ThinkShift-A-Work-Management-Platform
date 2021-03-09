import {Typography, Link} from '@material-ui/core'




function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="http://ec2-34-245-24-4.eu-west-1.compute.amazonaws.com:3000">
          ThinkShift
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

export default Copyright