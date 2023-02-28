import { Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CssBaseline,
  makeStyles,
  Theme
} from '@material-ui/core';
import { useAuth, useSMS } from '../../hooks/useAuth';

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    minWidth: '30vw',
    padding: theme.spacing(3)
  },
  link: {
    textDecoration: 'underline !important',
    '&:hover': {
      cursor: 'pointer !important',
      color: '#3f51b5 !important'
    }
  }
}));

function NotFound() {
  const { authTokens } = useAuth();
  const { smsTokens } = useSMS();
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Card className={classes.card}>
        <CardHeader
          title={
            <Typography component="h1" variant="h5">
              404 | Page not found :(
            </Typography>
          }
        />
        <CardContent>
          <p>
            Maybe the page you are looking for has been removed, or you typed in
            the wrong URL
          </p>
        </CardContent>
        <Link to="/signin" className={classes.link}>
          Back Sign In
        </Link>
        {authTokens && smsTokens && (
          <Link to="/" className={classes.link}>
            Back Home Page
          </Link>
        )}
      </Card>
    </Container>
  );
}

export default NotFound;
