import { useState, useEffect } from 'react';
import axios from 'src/utils/axios';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import 'react-phone-input-2/lib/material.css';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
  CssBaseline,
  Button,
  Avatar,
  TextField
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import { useChangePassword } from '../../hooks/useAuth';
import catchErrors from '../../utils/catch-errors';
import useStyles from '../../utils/styles';

function ChangePasswordLanding() {
  const [email, setEmail] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setChangePassword } = useChangePassword();
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    const isValid = email.length !== 0;
    isValid ? setDisabled(false) : setDisabled(true);
  }, [email]);

  const handleChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const url = '/change-password-number';
      const payload = { email: email };
      axios.post(url, payload);
      handleSuccess('');
    } catch (error) {
      catchErrors(error.result, setError);
      setLoading(false);
    }
  }

  function handleSuccess(data: any) {
    setChangePassword(data);
    history.push({ pathname: `/change-password-sms`, state: { email: email } });
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={disabled || loading}
                className={classes.submit}
              >
                Submit
              </Button>
              <RouterLink to="/signin" className="mt-2 mb-2">
                <Typography variant="body2" color="primary" align="center">
                  {'Back to Sign In'}
                </Typography>
              </RouterLink>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

export default ChangePasswordLanding;
