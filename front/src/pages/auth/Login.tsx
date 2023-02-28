import { useState, useEffect } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
  TextField,
  CssBaseline,
  Button,
  Avatar
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import axios from 'src/utils/axios';
import { useAuth } from '../../hooks/useAuth';
import useStyles from '../../utils/styles';

const INITIAL_USER = {
  email: '',
  password: ''
};

function Login() {
  const [user, setUser] = useState(INITIAL_USER);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuthTokens } = useAuth();
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    const isUser = Object.values(user).every((el) => Boolean(el));
    isUser ? setDisabled(false) : setDisabled(true);
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const payload = { ...user };
      const response = await axios.post('/signin', payload);
      handleSucess(response.data);
    } catch (error) {
      setError(error.result);
      //catchErrors(error, setError);
      setLoading(false);
    }
  }

  function handleSucess(data: any) {
    setAuthTokens(data);
    history.push({ pathname: `/sms`, state: { email: user.email } });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Card className={classes.authcard}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
            }
            title={
              <Typography component="h1" variant="h5">
                CART LOGIN
              </Typography>
            }
          />
          <CardContent>
            <form
              className={classes.form}
              onSubmit={handleSubmit}
              onError={() => Boolean(error)}
              onLoad={() => loading}
              noValidate
            >
              {error ? <Alert severity="error">{error}</Alert> : <></>}
              <TextField
                id="email"
                name="email"
                variant="outlined"
                margin="normal"
                label="Email Address"
                autoComplete="email"
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                id="password"
                name="password"
                variant="outlined"
                margin="normal"
                label="Password"
                type="password"
                autoComplete="current-password"
                onChange={handleChange}
                fullWidth
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={disabled || loading}
                className={classes.submit}
              >
                Sign In
              </Button>
              <RouterLink to="/change-password-landing" className="mt-2 mb-2">
                <Typography variant="body2" color="primary" align="center">
                  {'Forgot password?'}
                </Typography>
              </RouterLink>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
