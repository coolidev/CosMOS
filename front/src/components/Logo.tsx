import { Link } from 'react-router-dom';
import { Box, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: '#FFF',
    textDecoration: 'none',
    '&:hover': {
      color: '#FFF'
    }
  },
  image: {
    height: '1.5rem'
  }
}));

export const LogoLight = () => {
  const classes = useStyles();

  return (
    <Box mr={3}>
      <Link to="/" className={classes.root}>
        <img src={'/logo.png'} alt="Logo" className={classes.image} />
      </Link>
    </Box>
  );
};

export const LogoDark = () => {
  const classes = useStyles();

  return (
    <Box mr={3}>
      <Link to="/" className={classes.root}>
        <img src={'/logo-dark.png'} alt="LogoDark" className={classes.image} />
      </Link>
    </Box>
  );
};
