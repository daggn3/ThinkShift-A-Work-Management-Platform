import {Typography, Link} from '@material-ui/core'




function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Find Out More at: '}
        <Link color="inherit" href="https://gitlab.computing.dcu.ie/daggn3/2021-ca326-ndagg-thinkshift">
          ThinkShift GitLab Repo.
        </Link>{' '}
      </Typography>
    );
  }

export default Copyright