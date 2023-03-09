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
  Avatar,
  makeStyles,
  Theme,
  colors
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'src/utils/axios';
import { useAuth } from '../../hooks/useAuth';
import useStyles from '../../utils/styles';

const newStyles = makeStyles((theme: Theme) => ({
  inputParams: {
    backgroundColor: "#EEEEEE",
    borderRadius: theme.spacing(1),
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white'
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.red[400]
    }
  }
}))

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
  const newClasses = newStyles();

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
        <Card className={classes.authcard} style={{ backgroundColor: '#fff' }}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                <svg width="26px" height="26px" viewBox="0 0 700 700" fill='white'>
                  <g>
                    <path d="m160.98 221.2h376.96c23.477 0 42.684 19.207 42.684 42.684v253.43c0 23.477-19.207 42.684-42.684 42.684h-376.96c-23.477 0-42.684-19.207-42.684-42.684v-253.43c0-23.477 19.207-42.684 42.684-42.684zm210.01 176c26.793-14.258 37.891-31.438 39.086-44.855 6.4219-71.695-123.11-73.281-121.34 0.042969 0.31641 13.152 10.129 29.562 34.633 44.746-6.918 32.316-10.586 52.105-10.586 85.582h69.641c0.003907-33.473-4.5156-53.203-11.438-85.516zm58.758-206.65c0.82031-152.27-160.58-151.54-160.58 2.6719h-80.289c0-255.25 321.16-256.18 321.16-2.6719h-80.293z" fill-rule="evenodd" />
                  </g>
                </svg>
              </Avatar>
            }
            title={
              <Typography component="h1" variant="h5" style={{ textDecoration: "underline" }}>
                CoSMOS LOGIN
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
                className={newClasses.inputParams}
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
                className={newClasses.inputParams}
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
                <Typography variant="body2" color="primary" align="center" style={{ fontStyle: 'italic' }}>
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
