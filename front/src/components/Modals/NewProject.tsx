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
  useTheme
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useSelector, useDispatch } from 'src/store';
import { getPreference, updatePreference } from 'src/slices/preference';
import useSettings from 'src/hooks/useSettings';
import { BASE_VALS as BaseValues } from 'src/config';
import Welcome from './Welcome';
import { updateProject } from 'src/slices/project';
import type { Theme } from 'src/theme';

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
    minHeight: '55vh'
  },
  title: {
    margin: 0,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.primary.light
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
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
  textbox: {
    backgroundColor: theme.palette.primary.light
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
            disableEscapeKeyDown
            keepMounted
            fullWidth
          >
            <DialogTitle disableTypography className={classes.title}>
              <Typography variant="h6">CART Project Details</Typography>
            </DialogTitle>
            <DialogContent
              dividers
              style={{ backgroundColor: theme.palette.background.paper }}
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
                      Enter your Mission Information below. Your Mission Name
                      and Description will appear in any reports generated by
                      CART. This may be updated at any time by selecting 'Manage
                      Project Details' from the menu.
                    </Typography>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Project Name*</Typography>
                  </Grid>
                  <Grid item md={5} xs={12}>
                    <TextField
                      variant="outlined"
                      error={Boolean(touched.projectName && errors.projectName)}
                      fullWidth
                      size="small"
                      helperText={touched.projectName && errors.projectName}
                      name="projectName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.projectName}
                      className={classes.textbox}
                    />
                  </Grid>
                  <Grid item md={5} />
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Mission Name</Typography>
                  </Grid>
                  <Grid item md={5} xs={12}>
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
                      className={classes.textbox}
                    />
                  </Grid>
                  <Grid item md={5} />
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Mission Description</Typography>
                  </Grid>
                  <Grid item md={10} xs={12}>
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
                      className={classes.textbox}
                    />
                  </Grid>
                </Grid>
                {errors.submit && (
                  <Box mt={3}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Box>
                )}
                <Box p={2} display="flex">
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
                </Box>
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
