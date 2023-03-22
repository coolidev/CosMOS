import { FC } from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box,
  Grid,
  Button,
  TextField,
  makeStyles,
  FormHelperText
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

interface PasswordResetProps {
  error: string;
  className?: string;
  onChange: () => void;
  onSubmit: (data: any) => void;
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const PasswordReset: FC<PasswordResetProps> = ({
  error,
  className,
  onChange,
  onSubmit,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        currentPassword: '',
        password: '',
        passwordConfirm: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        currentPassword: Yup.string(),
        password: Yup.string()
          .min(7, 'Must be at least 7 characters')
          .max(255)
          .required('Required'),
        passwordConfirm: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          onSubmit(values);
          setStatus({ success: true });
          setSubmitting(false);
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          {error ? (<Alert severity="error">{error}</Alert>) : null}
          <TextField
            id="currentPassword"
            name="currentPassword"
            value={touched.currentPassword && errors.currentPassword}
            variant="outlined"
            margin="normal"
            label="Current Password"
            type="password"
            autoComplete="current-password"
            onChange={handleChange}
            fullWidth
            size='small'
            required
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="New Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            size="small"
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
            fullWidth
            helperText={touched.passwordConfirm && errors.passwordConfirm}
            label="Confirm Password"
            margin="normal"
            name="passwordConfirm"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.passwordConfirm}
            size="small"
            variant="outlined"
          />
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>{errors.submit.toString()}</FormHelperText>
            </Box>
          )}
          <Box my={3}>
            <Grid container justifyContent="center" alignItems="center" spacing={2}>
              <Grid item md={6}>
                <Button
                  color="secondary"
                  disabled={isSubmitting}
                  size="medium"
                  type="submit"
                  variant="contained"
                  fullWidth
                >
                  Reset Password
                </Button>
              </Grid>
              <Grid item md={6}>
                <Button
                  color="secondary"
                  size="medium"
                  variant="contained"
                  onClick={() => onChange()}
                  fullWidth
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      )}
    </Formik>
  );
};

PasswordReset.propTypes = {
  className: PropTypes.string
};

export default PasswordReset;
