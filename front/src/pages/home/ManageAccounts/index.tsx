/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, FC } from 'react';
import axios from 'src/utils/axios';
import { useSelector } from 'src/store';
import {
  Grid,
  CssBaseline,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  makeStyles,
  Theme
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import catchErrors from 'src/utils/catch-errors';
import useStyles from 'src/utils/styles';
import UserManagementSection from './manage-users-panel';
import PasswordReset from './PasswordReset';
import DialogBox from 'src/components/DialogBox';

const INITIAL_USER = {
  email: '',
  name: '',
  phone: '',
  oldpassword: '',
  origemail: '',
  admin: '',
  engineer: ''
};

interface ManageAccountProps {
  open: boolean;
  onOpen: () => void;
}

const customStyles = makeStyles((theme: Theme) => ({
  card: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2)
  },
  dialog:{
    minWidth: '50vw'
  },
}));

const ManageAccounts: FC<ManageAccountProps> = ({ open, onOpen }) => {
  const [user, setUser] = useState(INITIAL_USER);
  const [updateBtnDisabled, setUpdateBtnDisabled] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [passwordChange, setPasswordChange] = useState(false);
  const [infoChangeMode, setInfoChangeMode] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [passwordUpdateError, setPasswordUpdateError] = useState('');
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { email } = useSelector(state => state.user);
  const customClasses = customStyles();

  useEffect(() => {
    if (email) {
      axios.get('/getUser', { params: { email: email }}).then(res => {
        setUser(prevState => ({
          ...prevState,
          email: email,
          origemail: email,
          name: res.data.name,
          phone: res.data.phone,
          admin: res.data.isAdmin,
          engineer: res.data.isEngineer
        }));
        setIsAdmin(res.data.isAdmin);
      });
    }
  }, [email, passwordChange]);

  useEffect(() => {
    user.email.length > 0 && user.name.length > 0 && user.phone.length > 0
      ? setUpdateBtnDisabled(false)
      : setUpdateBtnDisabled(true);
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  }

  const handlePasswordSubmit = (values) => {
    try {
      setLoading(true);
      setError('');
      const payload = { 
        email: user.email,
        name: user.name,
        phone: user.phone,
        origemail: user.origemail,
        admin: user.admin,
        engineer: user.engineer, 
        oldpassword: values.currentPassword,
        password: values.password 
      };
      axios.post('/change-password-with-verification', payload)
        .then((res) => {
          setUser(INITIAL_USER);
          setPasswordChange(false);
          setPasswordUpdateSuccess(true);
          setPasswordUpdateError('');
        })
        .catch((error) => {
          setPasswordChange(true);
          setPasswordUpdateSuccess(false);
          catchErrors({ message: error.error }, setPasswordUpdateError);
        });
    } catch (error) {
      setPasswordChange(true);
      catchErrors({ message: error.error }, setPasswordUpdateError);
    }
    setLoading(false);
    setUserUpdateSuccess(false);
  };

  const handleUserSubmit = (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const payload = { ...user };
      // eslint-disable-next-line no-useless-escape
      let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      //checks if the email is valid against this monster of a regex I found online
      if(!emailRegex.test(payload.email)){
        throw new Error('Email is not valid');
      }
      //If there are not 10 or 11 (In case of country code, but only single digit country codes) digits, the phone number is not valid
      if(!(payload.phone.match(/\d/g).length===10) && !(payload.phone.match(/\d/g).length===11)){
        throw new Error('Phone number is not valid');
      }
      axios.post('/change-user-info', payload)
        .then((res) => {
          INITIAL_USER.email = user.email;
          INITIAL_USER.origemail = user.email;
          user.origemail = user.email;
          setUserUpdateSuccess(true);
          localStorage.setItem('email', user.email);
          localStorage.setItem('name', user.name.replace(/[^\w\s]/gi, ''));
        })
        .catch((error) => {
          setInfoChangeMode(true);
          setUserUpdateSuccess(false);
          catchErrors({ message: error.error }, setError);
        });
      setInfoChangeMode(false);
    } catch (error) {
      setInfoChangeMode(true);
      catchErrors({ message: error }, setError);
    }
    setLoading(false);
    user.oldpassword = '';
    setPasswordUpdateSuccess(false);
  };

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? '+1 ' : '';
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
  }

  const handlePassword = () => setPasswordChange(!passwordChange);

  return (
    <DialogBox
      title={`Manage Account`}
      isOpen={open}
      onClose={onOpen}
      className={{ paper: customClasses.dialog }}
    >
      <CssBaseline />
      <Card className={customClasses.card}>
        <CardContent>
          <Typography component="h4" variant="h4">
            {`User Profile`}
          </Typography>
          {passwordUpdateSuccess ? 
            (<Alert severity="success">Password Successfully Updated</Alert>) : null}
          {userUpdateSuccess ? 
            <Alert severity="success">
              {'Account Information Successfully Updated'}
            </Alert>
            : <></>}
          {infoChangeMode ? null : <br></br>}
          {infoChangeMode ? (
            <Grid item md={4}>
              <form
                className={classes.form}
                onSubmit={handleUserSubmit}
                onError={() => Boolean(error)}
                onLoad={() => loading}
                noValidate
                autoComplete="off"
              >
                {error ? <Alert severity="error">{error}</Alert> : <></>}
                <TextField
                  id="name"
                  name="name"
                  value={user.name}
                  variant="filled"
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
                  value={user.email}
                  variant="filled"
                  margin="normal"
                  label="Email Address"
                  type="text"
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  id="phone"
                  name="phone"
                  value={user.phone}
                  variant="filled"
                  margin="normal"
                  label="Phone Number"
                  type="text"
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  id="oldpassword"
                  name="oldpassword"
                  value={user.oldpassword}
                  variant="outlined"
                  margin="normal"
                  label="Confirm Password"
                  type="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  size="medium"
                  variant="contained"
                  color="primary"
                  disabled={updateBtnDisabled || loading}
                  className={classes.submit}
                >
                  {'Update'}
                </Button>
                &nbsp;
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={() => {
                    setInfoChangeMode(false);
                  }}
                >
                  {'Cancel'}
                </Button>
              </form>
            </Grid>
          ) : (
            <TableContainer>
              <Table
                style={{ width: '33%', padding: '5' }}
                className={classes.table}
                aria-label="sticky table"
              >
                <TableBody>
                  <TableRow key={'name'}>
                    <TableCell component="th" scope="row">
                      <b>{'Name'}</b>
                    </TableCell>
                    <TableCell align="left">{user.name}</TableCell>
                  </TableRow>
                  <TableRow key={'email'}>
                    <TableCell component="th" scope="row">
                      <b>{'Email Address'}</b>
                    </TableCell>
                    <TableCell align="left">{user.email}</TableCell>
                  </TableRow>
                  <TableRow key={'phone'}>
                    <TableCell component="th" scope="row">
                      <b>{'Phone Number'}</b>
                    </TableCell>
                    <TableCell align="left">
                      {formatPhoneNumber(user.phone)}
                    </TableCell>
                  </TableRow>
                  <TableRow key={'roles'}>
                    <TableCell component="th" scope="row">
                      <b>{'Roles'}</b>
                    </TableCell>
                    <TableCell align="left">
                      {user.admin ? 'Administrator' : null}
                      {user.engineer && user.admin ? ', ' : ''}
                      {user.engineer ? 'Engineer' : null}
                      {user.admin || user.engineer ? null : 'Standard User'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    size="small"
                    onChange={() => setChecked(!checked)}
                    name="checkedShow"
                    color="primary"
                  />
                }
                label="Disable introduction information popup"
                labelPlacement="end"
              /> */}
              {/* <br></br> */}
              <Button
                type="submit"
                size="medium"
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => {
                  setInfoChangeMode(true);
                }}
              >
                {'Edit Info'}
              </Button>
              &nbsp;
              <Button
                type="submit"
                size="medium"
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => {
                  setPasswordChange(true);
                }}
              >
                {'Reset Password'}
              </Button>
            </TableContainer>
          )}
          <br></br>
          {passwordChange ? (
            <Typography component="h4" variant="h4">
              Change Password
            </Typography>
          ) : null}
          {passwordChange && (
            <Grid item md={4}>
              <PasswordReset
                error={passwordUpdateError}
                onChange={handlePassword}
                onSubmit={handlePasswordSubmit}
              />
            </Grid>
          )}
          <Grid item md={8} />
          {isAdmin ? <UserManagementSection /> : null}
        </CardContent>
      </Card>
    </DialogBox>
  );
};

export default ManageAccounts;
