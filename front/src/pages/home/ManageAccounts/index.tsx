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
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import catchErrors from 'src/utils/catch-errors';
import useStyles from 'src/utils/styles';
import UserManagementSection from './manage-users-panel';
import PasswordReset from './PasswordReset';
import DialogBox from 'src/components/DialogBox';
import { Theme } from 'src/theme';
import { DataGrid } from 'devextreme-react';
import { Column, Editing } from 'devextreme-react/data-grid';

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
    backgroundColor: theme.palette.background.light,
    padding: '0.2rem',
  },
  dialog: {
    minWidth: '50vw'
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontStyle: "normal",
    fontSize: "20px",
    lineHeight: "24px",
    display: "flex",
    alignItems: "center",
    color: "#333333",
    paddingLeft: '.5rem',
    borderBottom: `2px solid ${theme.palette.border.main}`,
  },
  table: {
    backgroundColor: theme.palette.background.light,
  },
  dataTableStyle: {
    '& .dx-command-edit.dx-command-edit-with-icons': {
      textAlign: 'right !important',
      '& *': {
        color: `${theme.palette.border.main} !important`,
      }
    },
  },
  submit: {
    padding: `8px 16px`
  }
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
      axios.get('/getUser', { params: { email: email } }).then(res => {
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

  const handleUpdateUser = ({ field, value }) => {
    if (field !== '' && field !== null) {
      setUser((prevState) => ({ ...prevState, [field]: value }));
      setInfoChangeMode(true);
    }
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
      if (!emailRegex.test(payload.email)) {
        throw new Error('Email is not valid');
      }
      //If there are not 10 or 11 (In case of country code, but only single digit country codes) digits, the phone number is not valid
      if (!(payload.phone.match(/\d/g).length === 10) && !(payload.phone.match(/\d/g).length === 11)) {
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

  const renderProfileField = (data) => {
    return <div style={{ fontWeight: 'bold' }}>{data.text}</div>;
  }

  return (
    <DialogBox
      title={`Manage Account`}
      isOpen={open}
      onClose={onOpen}
      className={{ paper: customClasses.dialog }}
    >
      <CssBaseline />
      <Card className={customClasses.card}>
        <Typography component="p" variant="body1" className={customClasses.subtitle}>
          {`User Profile`}
        </Typography>
        {passwordUpdateSuccess ?
          (<Alert severity="success">Password Successfully Updated</Alert>) : null}
        {userUpdateSuccess ?
          <Alert severity="success">
            {'Account Information Successfully Updated'}
          </Alert>
          : <></>}
        <Grid item md={12} style={{ boxShadow: '0 4px 14px rgba(0,0,0,10%)' }}>
          <DataGrid
            showColumnHeaders={false}
            dataSource={[
              { title: 'Name', slug: 'name', value: user.name },
              { title: 'Email Address', slug: 'email', value: user.email },
              { title: 'Phone Number', slug: 'phone', value: formatPhoneNumber(user.phone) },
              { title: 'Roles', slug: '', value: `${user.admin ? 'Administrator' : ''}${user.engineer && user.admin ? ', ' : ''}${user.engineer ? 'Engineer' : ''}${user.admin || user.engineer ? '' : 'Standard User'}` },
            ]}
            className={customClasses.dataTableStyle}
          >
            <Editing
              mode="row"
              allowUpdating={true}
              onChangesChange={(data) => {
                const key = data[0].key;
                const value = data[0].data.value;

                handleUpdateUser({ field: key.slug, value: value })
              }}
            >
            </Editing>
            <Column
              dataField="title"
              cellRender={(data) => renderProfileField(data)}
              allowEditing={false}
            />
            <Column
              dataField="value"
              allowEditing={true}
            />
          </DataGrid>
          <Grid container md={12}>
            {error ? <Alert severity="error">{error}</Alert> : <></>}
          </Grid>
          <Grid container md={12} justifyContent="flex-end" alignItems='center'>
            {infoChangeMode && (<>
              <TextField
                value={user.oldpassword}
                variant="outlined"
                className='mr-2'
                placeholder='Confirm password *'
                type="password"
                autoComplete="current-password"
                onChange={(e) => handleUpdateUser({ field: "oldpassword", value: e.target.value })}
                size="small"
                required
              />
              <Button
                size="medium"
                variant="contained"
                color="primary"
                className={`${classes.submit} mr-2`}
                onClick={(e) => {
                  handleUserSubmit(e);
                }}
              >
                {'Save Changes'}
              </Button>
            </>)}
            <Button
              type="submit"
              size="medium"
              variant="contained"
              color="primary"
              className={`${classes.submit} mr-4`}
              onClick={() => {
                setPasswordChange(true);
              }}
            >
              {'Reset Password'}
            </Button>
          </Grid>
        </Grid>
        <br />
        {passwordChange ? (
          <Typography component="p" variant="body1" className={customClasses.subtitle}>
            Change Password
          </Typography>
        ) : null}
        {passwordChange && (
          <Grid item md={12} style={{ boxShadow: '0 4px 14px rgba(0,0,0,10%)' }}>
            <PasswordReset
              error={passwordUpdateError}
              onChange={handlePassword}
              onSubmit={handlePasswordSubmit}
            />
          </Grid>
        )}
        <br />
        {isAdmin ? <UserManagementSection /> : null}
      </Card>
    </DialogBox>
  );
};

export default ManageAccounts;
