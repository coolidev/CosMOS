/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import {
  Grid,
  Box,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Button,
  TextField,
  FormHelperText,
  makeStyles,
  useTheme,
  IconButton
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useSelector, useDispatch } from 'src/store';
import { getPreference, updatePreference } from 'src/slices/preference';
import useSettings from 'src/hooks/useSettings';
import { BASE_VALS as BaseValues } from 'src/config';
import Welcome from './Welcome';
import { updateProject } from 'src/slices/project';
import type { Theme } from 'src/theme';
import { Close as CloseIcon } from '@material-ui/icons';

interface NewProjectProps {
  isOpen?: boolean;
  isWelcome?: boolean;
  onOpen?: () => void;
  onConfirm?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    maxWidth: '768px',
    minHeight: '49vh'
  },
  dialogBox: {
    '& > div > div': {
      border: `2px solid ${theme.palette.border.main}`,
      borderRadius: '8px'
    }
  },
  title: {
    margin: 0,
    padding: theme.spacing(2, 4),
    backgroundColor: theme.palette.border.main,
    color: "white"
  },
  close: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.background.light,
    zIndex: 100
  },
  formControl: {
    '& option': {
      minHeight: 30,
      verticalAlign: 'middle'
    },
    '& .MuiSelect-select[multiple]': {
      height: '20vh'
    }
  },
  content: {
    marginBottom: theme.spacing(4)
  },
  textBox: {
    backgroundColor: theme.palette.background.light,
    color: theme.palette.text.primary,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
    boxShadow: '0px 4px 14px rgb(0 0 0 / 10%)',
    border: 'none',
    borderRadius: '8px',
    '& fieldset': {
      border: 'none'
    }
  }
}));

const NewProject: FC<NewProjectProps> = ({
  isOpen,
  isWelcome,
  onOpen,
  onConfirm
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const dispatch = useDispatch();
  const { settings, saveSettings } = useSettings();
  const [open, setOpen] = useState<boolean>(isOpen || true);
  const [welcome, setWelcome] = useState<boolean>(false);
  const { preference } = useSelector((state) => state.preference);
  const [projectNameList, setProjectNameList] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getPreference());
    let nameList = preference.project.map((item) => item.projectName);
    setProjectNameList(nameList);
  }, [dispatch]);

  const handleClose = (e, r): void => {
    if (r === 'backdropClick') return;
    setOpen(false);
    onOpen && onOpen();
    onConfirm && onConfirm();
  };

  const handleBack = (): void => {
    setOpen(false);
    setWelcome(true);
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          projectName: '',
          missionName: '',
          missionDescription: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          projectName: Yup.string()
            .max(50)
            .required('Project Name is required')
            .notOneOf(projectNameList),
          missionName: Yup.string().max(255),
          missionDescription: Yup.string()
        })}
        onSubmit={async (
          values,
          { setErrors, setStatus, setSubmitting, resetForm }
        ) => {
          try {
            const idVal = uuidv4();
            const params = {
              project: [
                ...preference.project,
                { id: idVal, ...values, saves: [BaseValues] }
              ]
            };
            dispatch(updatePreference(params));
            dispatch(updateProject(idVal));
            setStatus({ success: true });
            setSubmitting(false);
            resetForm();
            setOpen(false);
            onConfirm && onConfirm();
            onOpen && onOpen();
            saveSettings({ theme: settings.theme, isLogin: false });
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
          handleReset,
          isSubmitting,
          touched,
          values
        }) => (
          <Dialog
            open={isOpen || open}
            onClose={handleClose}
            classes={{ paper: classes.dialog }}
            className={classes.dialogBox}
            disableEscapeKeyDown
            keepMounted
            fullWidth
          >
            <DialogTitle disableTypography className={classes.title}>
              <Typography variant="h3">CoSMOS Project Details</Typography>
              <IconButton className={classes.close} onClick={()=>handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent
              dividers
              style={{ backgroundColor: theme.palette.background.light }}
            >
              <form onSubmit={handleSubmit} onReset={handleReset}>
                <Grid
                  container
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item md={12} xs={12} className={classes.content}>
                    <Typography variant="body1">
                    Enter your mission information below. Your mission name and description will appear in any reports generated by CoSMOS. This may be updated at any time by selecting ‘Manage Project Details’ from the menu.
                    </Typography>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Project Name*</Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <TextField
                      variant="outlined"
                      error={Boolean(touched.projectName && errors.projectName)}
                      fullWidth
                      size="small"
                      // helperText={touched.projectName && errors.projectName}
                      name="projectName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.projectName}
                      className={classes.textBox}
                    />
                  </Grid>
                  <Grid item md={6} />
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Mission Name</Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <TextField
                      variant="outlined"
                      error={Boolean(touched.missionName && errors.missionName)}
                      fullWidth
                      size="small"
                      helperText={touched.missionName && errors.missionName}
                      name="missionName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.missionName}
                      className={classes.textBox}
                    />
                  </Grid>
                  <Grid item md={6} />
                  <Grid item md={12} xs={12}>
                    <Typography variant="body1" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                      Mission Description
                    </Typography>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <TextField
                      variant="outlined"
                      error={Boolean(
                        touched.missionDescription && errors.missionDescription
                      )}
                      fullWidth
                      multiline
                      rows="12"
                      size="small"
                      helperText={
                        touched.missionDescription && errors.missionDescription
                      }
                      name="missionDescription"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.missionDescription}
                      className={classes.textBox}
                    />
                  </Grid>
                </Grid>
                {errors.submit && (
                  <Box mt={3}>
                    <FormHelperText error>{errors.submit.toString()}</FormHelperText>
                  </Box>
                )}
                <Grid container className='py-2'>
                  {isWelcome && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ArrowBackIosIcon fontSize="small" />}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  )}
                  <Box flexGrow={1} />
                  <Button
                    autoFocus
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    color="primary"
                  >
                    Create
                  </Button>
                </Grid>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </Formik>
      {welcome && <Welcome />}
    </>
  );
};

export default NewProject;
