import { useState, useEffect } from 'react';
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom';
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
import { useSMSPassword } from '../../hooks/useAuth';
import useStyles from '../../utils/styles';

function VerifyCodeSms() {
  const [sms_code, setSMSCode] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setSMSPassword } = useSMSPassword();
  const history = useHistory();
  const location = useLocation<{ email: string }>();
  const classes = useStyles();

  useEffect(() => {
    const isUser = sms_code.trim() !== '' ? true : false;
    isUser ? setDisabled(false) : setDisabled(true);
  }, [sms_code]);

  function handleChange(event) {
    const { value } = event.target;
    setSMSCode(value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const payload = { sms_code, email: location.state.email };
      const response = await axios.post('/sms-verify', payload);
      handleSuccess(response.data);
    } catch (error) {
      setError(error.result);
      setLoading(false);
    }
  }

  function handleSuccess(data: any) {
    setSMSPassword(data);
    history.push({ pathname: `/change-password`, state: { email: location.state.email } });
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
                VERIFICATION
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
                name="sms_code"
                variant="outlined"
                margin="normal"
                label="SMS Code"
                autoComplete="email"
                fullWidth
                required
                value={sms_code}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={disabled || loading}
                className={classes.submit}
              >
                Verify
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

export default VerifyCodeSms;
