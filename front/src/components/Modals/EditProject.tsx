import { FC, useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Grid,
  Box,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Button,
  IconButton,
  TextField,
  FormHelperText,
  makeStyles,
  useTheme
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch, useSelector } from 'src/store';
import { getProject } from 'src/slices/project';
import { getPreference, updatePreference } from 'src/slices/preference';
import useSettings from 'src/hooks/useSettings';
import type { Project } from 'src/types/preference';
import ConfirmDelete from './ConfirmDelete';
import type { Theme } from 'src/theme';

interface EditProjectProps {
  open?: boolean;
  onOpen?: () => void;
  onModal?: (value?: boolean) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    maxWidth: '768px',
    minHeight: '55vh'
  },
  dialogStyle: {
    '& > div > div': {
      border: `2px solid ${theme.palette.border.main}`,
      borderRadius: '8px',
      backgroundColor: theme.palette.background.light
    }
  },
  title: {
    margin: 0,
    padding: theme.spacing(2, 4),
    backgroundColor: theme.palette.primary.main,
    color: "white",
    display: 'flex',
    alignItems: 'center'
  },
  closeButton: {
    color: theme.palette.background.light
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

const EditProject: FC<EditProjectProps> = ({ open, onOpen, onModal }) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const dispatch = useDispatch();
  const { settings, saveSettings } = useSettings();
  const { preference } = useSelector((state) => state.preference);
  const { project } = useSelector((state) => state.project);
  const [result, setResult] = useState<Project | null>(null);
  const [projectNameList, setProjectNameList] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getPreference());
    dispatch(getProject());
  }, [dispatch]);

  useEffect(() => {
    const data = preference.project.find((item) => item.id === project);
    setResult(data);
    try {
      let nameList = preference.project
        .map((item) => item.projectName)
        .filter((item) => item !== data.projectName);
      setProjectNameList(nameList);
    } catch {
      setProjectNameList([]);
    }
  }, [project, preference]);

  const handleDelete = (): void => {
    const data = preference.project.filter((item) => item.id !== project);
    dispatch(updatePreference({ project: data }));
    handleClose();
    onModal(true);
  };

  const handleClose = (): void => onOpen();

  const handleDeleteView = (): void => setDeleteConfirm(!deleteConfirm);

  return (
    <>
      {deleteConfirm ? (
        <ConfirmDelete
          open={deleteConfirm}
          onOpen={handleDeleteView}
          onConfirm={handleDelete}
        />
      ) : (
        <Formik
          enableReinitialize
          initialValues={{
            projectName: result?.projectName || '',
            missionName: result?.missionName || '',
            missionDescription: result?.missionDescription || '',
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
              const data = preference.project.map((item) => {
                if (item.id === result.id) {
                  item = { id: result.id, ...values, saves: result.saves };
                }
                return item;
              });
              dispatch(updatePreference({ project: data }));
              setStatus({ success: true });
              setSubmitting(false);
              resetForm();
              onOpen();
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
              open={open}
              onClose={handleClose}
              classes={{ paper: classes.dialog }}
              disableEscapeKeyDown
              keepMounted
              fullWidth
              className={classes.dialogStyle}
            >
              <DialogTitle disableTypography className={classes.title}>
                <Typography variant="h6">CoSMOS Project Details</Typography>
                <div className='ml-auto' />
                <IconButton
                  className={classes.closeButton}
                  onClick={handleClose}
                  size="small"
                >
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
                      <Typography variant="body1" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                      Enter your mission information below. Your mission name and description will appear in any reports generated by CoSMOS. This may be updated at any time by selecting ‘Manage Project Details’ from the menu.
                      </Typography>
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <Typography variant="body1" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>Project Name*</Typography>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <TextField
                        variant="outlined"
                        error={Boolean(
                          touched.projectName && errors.projectName
                        )}
                        fullWidth
                        className={classes.textBox}
                        size="small"
                        helperText={touched.projectName && errors.projectName}
                        name="projectName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.projectName}
                      />
                    </Grid>
                    <Grid item md={6} />
                    <Grid item md={2} xs={12}>
                      <Typography variant="body1" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>Mission Name</Typography>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <TextField
                        variant="outlined"
                        error={Boolean(
                          touched.missionName && errors.missionName
                        )}
                        fullWidth
                        className={classes.textBox}
                        size="small"
                        helperText={touched.missionName && errors.missionName}
                        name="missionName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.missionName}
                      />
                    </Grid>
                    <Grid item md={6} />
                    <Grid item xs={12}>
                      <Typography variant="body1" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                        Mission Description
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        error={Boolean(
                          touched.missionDescription &&
                            errors.missionDescription
                        )}
                        fullWidth
                        className={classes.textBox}
                        multiline
                        rows="12"
                        size="small"
                        helperText={
                          touched.missionDescription &&
                          errors.missionDescription
                        }
                        name="missionDescription"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.missionDescription}
                      />
                    </Grid>
                  </Grid>
                  {errors.submit && (
                    <Box mt={3}>
                      <FormHelperText error>{errors.submit.toString()}</FormHelperText>
                    </Box>
                  )}
                  <Box p={2} mt={2} display="flex">
                    <Box flexGrow={1} />
                    <Box mr={2}>
                      <Button
                        autoFocus
                        variant="contained"
                        color="primary"
                        onClick={handleDeleteView}
                        disabled={!result}
                      >
                        Delete Project
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        autoFocus
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !result}
                        color="primary"
                      >
                        Update
                      </Button>
                    </Box>
                  </Box>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </Formik>
      )}
    </>
  );
};

export default EditProject;
