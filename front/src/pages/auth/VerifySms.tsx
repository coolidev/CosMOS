import { FC, useState, useEffect } from 'react';
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';
import { updateEmail } from 'src/slices/user';
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
import { useSMS } from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import useStyles from 'src/utils/styles';
import { updateSocketId } from 'src/utils/ws';

const VerifySms: FC = () => {
  const { settings, saveSettings } = useSettings();
  const [sms_code, setSMSCode] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setSMSTokens } = useSMS();
  const history = useHistory();
  const location = useLocation<{ email: string }>();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { socket } = useSelector((state) => state.webSocket);

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

      handleSuccess(response.data.sms_code);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('checkedShow', response.data.intro);
      localStorage.setItem('introPopCheckbox', response.data.intro);
      localStorage.setItem('name', response.data.name);
    } catch (error) {
      setError(error.result);
      setLoading(false);
    }
  }

  const handleSuccess = (data: any) => {
    const storedData: string | null = window.localStorage.getItem('settings');
    const setting = storedData
      ? JSON.parse(storedData)
      : { isLogin: true, theme: settings.theme };

    saveSettings(setting);
    setSMSTokens(data);
    dispatch(updateEmail(location.state.email));
    history.push('/');
    updateSocketId(socket, location.state.email);
  };

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
                {'Verify'}
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
};

export default VerifySms;
