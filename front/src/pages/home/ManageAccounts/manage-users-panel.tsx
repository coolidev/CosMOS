/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import axios from 'src/utils/axios';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Typography,
  Button,
  TextField
} from '@material-ui/core';
import { USER_MANAGEMENT_COLUMNS } from 'src/utils/constants/account';
import useStyles from 'src/utils/styles';
import catchErrors from 'src/utils/catch-errors';
import { Alert } from '@material-ui/lab';

interface User {
  email: string;
  name: string;
  phone: string;
  admin: boolean;
  engineer: boolean;
}

const INIT_USER = {
  email: '',
  name: '',
  phone: '',
  admin: false,
  engineer: false
};

function UserManagementSection() {
  const [userList, setUserList] = useState(new Array<User>());
  const classes = useStyles();
  const [newUserFlag, setNewUserFlag] = useState(false);
  const [update, setUpdate] = useState(true);
  const [newUserInfo, setNewUserInfo] = useState(INIT_USER);
  const [editUser, setEditUser] = useState(-1); //set to -1 to disable edit mode
  const [origEmail, setOrigEmail] = useState('');
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editUser < 0) {
      setUpdate(true);
      //setOrigEmail("");
    } else {
      setOrigEmail(userList[editUser]['email']);
    }
  }, [editUser]);

  useEffect(() => {
    if (update) {
      axios.post('/getUserList', { email: localStorage.getItem('email') }).then(res => {
        if (typeof res.data !== 'undefined') {
          setUserList(
            // @ts-ignore
            res.data.filter(function (value) {
              return value.email !== localStorage.getItem('email');
            })
          );
        }
      });
      setUpdate(false);
    }
  }, [update]);

  function handleNewUserChange(event) {
    const { name, value } = event.target;
    if (name.toLowerCase() === 'engineer' || name.toLowerCase() === 'admin') {
      setNewUserInfo((prevState) => ({ ...prevState, [name]: Boolean(value) }));
    } else {
      setNewUserInfo((prevState) => ({ ...prevState, [name]: value }));
    }
  }

  const handleUserChange = (row, column, event) => {
    let copy = [...userList];
    copy[row][column] = event;
    setUserList(copy);
  };

  const handleUserSubmit = (row, event) => {
    event.preventDefault();
    try {
      const payload = {
        email: userList[row]['email'],
        origEmail: origEmail,
        name: userList[row]['name'],
        phone: userList[row]['phone'],
        admin: userList[row]['admin'] ? 'true' : 'false',
        engineer: userList[row]['engineer'] ? 'true' : 'false'
      };
      setError('');
      axios.post('/manage-user', payload)
        .then((res) => {
          setUserUpdateSuccess(true);
          setEditUser(-1);
          setUpdate(true);
        })
        .catch((error) => {
          setUserUpdateSuccess(false);
          catchErrors(error, setError);
        });
    } catch (error) {
      catchErrors(error, setError);
    }
  };

  const createUser = (event) => {
    event.preventDefault();
    try {
      const payload = {
        name: newUserInfo['name'],
        email: newUserInfo['email'],
        phone: newUserInfo['phone'],
        engineer: newUserInfo['engineer'],
        admin: newUserInfo['admin']
      };
      // console.table(newUserInfo);
      // console.table(payload);
      setError('');
      axios.post('/admin-create-user', payload)
        .then((res) => {
          setUserUpdateSuccess(true);
          setNewUserFlag(false);
          setUpdate(true);
          setNewUserInfo(INIT_USER);
        })
        .catch((error) => {
          setUserUpdateSuccess(false);
          catchErrors(error, setError);
        });
    } catch (error) {
      catchErrors(error, setError);
    }
  };

  const deleteUser = (row) => {
    try {
      const payload = {
        email: userList[row]['email']
      };
      if (
        confirm(
          'Are you sure you wish to delete the account for ' +
            userList[row]['name'] +
            '?'
        )
      ) {
        setError('');
        axios.post('/delete-user', payload)
          .then((res) => {
            setEditUser(-1);
            setUpdate(true);
          })
          .catch((error) => {
            catchErrors(error, setError);
          });
      } else {
      }
    } catch (error) {
      catchErrors(error, setError);
    }
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

  return (
    <>
      <Typography component="h4" variant="h4">
        {`User Management`}
      </Typography>
      <br></br>
      {userUpdateSuccess ? (
        <Alert severity="success">User Information Successfully Updated</Alert>
      ) : null}
      {error !== '' ? <Alert severity="error">{error}</Alert> : <></>}
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {USER_MANAGEMENT_COLUMNS.map((column) => (
                <TableCell key={column.id} align="center">
                  {column.label}
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map((row, idx) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={0}
                  key={`row_${row.email}`}
                >
                  {USER_MANAGEMENT_COLUMNS.map((column) => {
                    return (
                      <TableCell key={`col_${column.id}`} align="center">
                        {(() => {
                          if (
                            (column.id === 'admin' || column.id === 'engineer') &&
                            editUser === idx
                          ) {
                            return (
                              <Checkbox
                                checked={Boolean(row[column.id])}
                                size="small"
                                onChange={(e) =>
                                  handleUserChange(
                                    idx,
                                    column.id.toLowerCase(),
                                    e.currentTarget.checked
                                  )
                                }
                                name="checkedShow"
                                color="primary"
                              />
                            );
                          } else if (
                            (column.id === 'admin' || column.id === 'engineer') &&
                            editUser !== idx
                          ) {
                            return (
                              <Checkbox
                                checked={Boolean(row[column.id])}
                                size="small"
                                disabled={true}
                                name="checkedShow"
                                color="primary"
                              />
                            );
                          } else if (editUser === idx) {
                            return (
                              <TextField
                                id={`${column.id}_row${idx}`}
                                name={`${column.id}_row${idx}`}
                                value={row[column.id]}
                                variant="filled"
                                margin="normal"
                                label={column.label}
                                type="text"
                                onChange={(e) =>
                                  handleUserChange(
                                    idx,
                                    column.id.toLowerCase(),
                                    e.target.value.toString()
                                  )
                                }
                                fullWidth
                                required
                              />
                            );
                          } else if (editUser !== idx && column.id === 'phone') {
                            if (row[column.id] !== '') {
                              return formatPhoneNumber(row[column.id]);
                            } else {
                              return '—';
                            }
                          } else {
                            return row[column.id];
                          }
                        })()}
                      </TableCell>
                    );
                  })}
                  {editUser === idx ? (
                    <TableCell key={`col_$edit`} align="center">
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={(e) => handleUserSubmit(idx, e)}
                      >
                        {'Save'}
                      </Button>
                      &nbsp;
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => setEditUser(-1)}
                      >
                        {'Cancel'}
                      </Button>
                    </TableCell>
                  ) : (
                    <TableCell key={`col_$edit`} align="center">
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => setEditUser(idx)}
                      >
                        {'Edit'}
                      </Button>
                      &nbsp;
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => deleteUser(idx)}
                      >
                        {'Delete'}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
          <TableHead>
            {!newUserFlag ? (
              <TableRow role="button" tabIndex={1} key={`newUser`}>
                <TableCell key={0} align="center" colSpan={6}>
                  <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => setNewUserFlag(true)}
                  >
                    {' + New User '}
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow role="button" tabIndex={0} key={`newUser`}>
                {USER_MANAGEMENT_COLUMNS.map((column, idx) => {
                  return (
                    <TableCell key={`col_${column.id}`} align="center">
                      {column.id === 'engineer' || column.id === 'admin' ? (
                        <Checkbox
                          checked={Boolean(newUserInfo[column.id])}
                          size="small"
                          disabled={true}
                          onChange={handleNewUserChange}
                          name={column.id}
                          color="primary"
                        />
                      ) : (
                        <TextField
                          id={column.id}
                          name={column.id}
                          value={newUserInfo[column.id]}
                          variant="outlined"
                          margin="normal"
                          label={column.label}
                          type="text"
                          onChange={handleNewUserChange}
                          fullWidth
                          required
                        />
                      )}
                    </TableCell>
                  );
                })}
                <TableCell key={0} align="center">
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={(e) => createUser(e)}
                  >
                    {' Create '}
                  </Button>
                  &nbsp;
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    className={classes.submit}
                    onClick={() => setNewUserFlag(false)}
                  >
                    {' Cancel '}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableHead>
        </Table>
      </TableContainer>
    </>
  );
}

export default UserManagementSection;
