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
            >
              <DialogTitle disableTypography className={classes.title}>
                <Typography variant="h6">CART Project Details</Typography>
                <IconButton
                  className={classes.closeButton}
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
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
                        CART. This may be updated at any time by selecting
                        'Manage Project Details' from the menu.
                      </Typography>
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <Typography variant="body1">Project Name*</Typography>
                    </Grid>
                    <Grid item md={5} xs={12}>
                      <TextField
                        variant="outlined"
                        error={Boolean(
                          touched.projectName && errors.projectName
                        )}
                        fullWidth
                        size="small"
                        helperText={touched.projectName && errors.projectName}
                        name="projectName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.projectName}
                        style={{
                          backgroundColor: theme.palette.component.main
                        }}
                      />
                    </Grid>
                    <Grid item md={5} />
                    <Grid item md={2} xs={12}>
                      <Typography variant="body1">Mission Name</Typography>
                    </Grid>
                    <Grid item md={5} xs={12}>
                      <TextField
                        variant="outlined"
                        error={Boolean(
                          touched.missionName && errors.missionName
                        )}
                        fullWidth
                        size="small"
                        helperText={touched.missionName && errors.missionName}
                        name="missionName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.missionName}
                        style={{
                          backgroundColor: theme.palette.component.main
                        }}
                      />
                    </Grid>
                    <Grid item md={5} />
                    <Grid item md={2} xs={12}>
                      <Typography variant="body1">
                        Mission Description
                      </Typography>
                    </Grid>
                    <Grid item md={10} xs={12}>
                      <TextField
                        variant="outlined"
                        error={Boolean(
                          touched.missionDescription &&
                            errors.missionDescription
                        )}
                        fullWidth
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
                        style={{
                          backgroundColor: theme.palette.component.main
                        }}
                      />
                    </Grid>
                  </Grid>
                  {errors.submit && (
                    <Box mt={3}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Box>
                  )}
                  <Box p={2} mt={2} display="flex">
                    <Box>
                      <Button
                        autoFocus
                        variant="contained"
                        color="primary"
                        onClick={handleDeleteView}
                        disabled={!result}
                      >
                        Delete This Project
                      </Button>
                    </Box>
                    <Box flexGrow={1} />
                    <Box mr={2}>
                      <Button
                        autoFocus
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          handleClose();
                          handleReset();
                        }}
                      >
                        Cancel
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
