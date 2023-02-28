import React, { useState, useEffect } from 'react';
import axios from 'src/utils/axios';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
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

import { useAuth } from '../../hooks/useAuth';
import catchErrors from '../../utils/catch-errors';
import useStyles from '../../utils/styles';

const INITIAL_USER = {
  name: '',
  email: '',
  password: '',
  phone: ''
};

function Register() {
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
    if (event.target) {
      const { name, value } = event.target;
      setUser((prevState) => ({ ...prevState, [name]: value }));
    } else {
      setUser((prevState) => ({ ...prevState, phone: event }));
    }
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const url = '/signup';
      const payload = { ...user };
      const response = await axios.post(url, payload);
      handleSucess(response.data);
    } catch (error) {
      catchErrors(error, setError);
      setLoading(false);
    }
  }

  function handleSucess(data: any) {
    setAuthTokens(data);
    history.push('/sms');
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.singupPaper}>
        <Card className={classes.authcard}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
            }
            title={
              <Typography component="h1" variant="h5">
                CART SYSTEM SIGN UP
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
                id="name"
                name="name"
                variant="outlined"
                margin="normal"
                label="Name"
                type="text"
                onChange={handleChange}
                fullWidth
                required
              />
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
              <PhoneInput
                placeholder="phone number"
                value={user.phone}
                onChange={handleChange}
                country={'us'}
                inputClass={classes.phoneInput}
                isValid
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={disabled || loading}
                className={classes.submit}
              >
                Sign Up
              </Button>
              <RouterLink to="/signin" className="mt-2 mb-2">
                <Typography variant="body2" color="primary" align="center">
                  {'Back to signin'}
                </Typography>
              </RouterLink>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

export default Register;
