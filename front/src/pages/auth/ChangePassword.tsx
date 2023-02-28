import { FC, useState, useEffect } from 'react';
import axios from 'src/utils/axios';
import { useHistory, useLocation } from 'react-router-dom';
import 'react-phone-input-2/lib/material.css';
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
import { useChangePassword, useSMSPassword } from '../../hooks/useAuth';
import catchErrors from '../../utils/catch-errors';
import useStyles from '../../utils/styles';

const INITIAL_USER = {
  password: '',
  passwordConfirm: ''
};

const ChangePassword: FC = () => {
  const [user, setUser] = useState(INITIAL_USER);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setChangePassword } = useChangePassword();
  const { setSMSPassword } = useSMSPassword();
  const history = useHistory();
  const location = useLocation<{ email: string }>();
  const classes = useStyles();

  useEffect(() => {
    const isUser = Object.values(user).every((el) => Boolean(el));
    const passwordsMatch = user.password === user.passwordConfirm;
    isUser && passwordsMatch ? setDisabled(false) : setDisabled(true);
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
      const url = '/change-password';
      const payload = { ...user, email: location.state.email };
      const response = await axios.post(url, payload);
      handleSuccess(response.data);
    } catch (error) {
      catchErrors(error.error, setError);
      setLoading(false);
    }
  }

  function handleSuccess(data: any) {
    setChangePassword('');
    setSMSPassword('');
    history.push('/signin');
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
                CART SYSTEM CHANGE PASSWORD
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
                id="password"
                name="password"
                variant="outlined"
                margin="normal"
                label="New Password"
                type="password"
                autoComplete="password"
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                id="passwordConfirm"
                name="passwordConfirm"
                variant="outlined"
                margin="normal"
                label="Confirm New Password"
                type="password"
                autoComplete="password"
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
                Change password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default ChangePassword;
