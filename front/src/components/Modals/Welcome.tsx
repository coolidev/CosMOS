import { FC, useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Button,
  Select,
  FormControl,
  makeStyles,
  colors,
  useTheme
} from '@material-ui/core';
import { useDispatch, useSelector } from 'src/store';
import useSettings from 'src/hooks/useSettings';
import { getPreference } from 'src/slices/preference';
import { updateProject } from 'src/slices/project';
import NewProject from './NewProject';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';

interface WelcomeProps {
  onConfirm?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    maxWidth: '80vh',
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
    border: `1px solid ${
      theme.name === THEMES.LIGHT ? '#000' : theme.palette.border.main
    }`,
    width: '80%',
    backgroundColor: theme.palette.primary.light,
    '& option': {
      minHeight: 30,
      verticalAlign: 'middle'
    },
    '& .MuiSelect-select[multiple]': {
      height: '30vh'
    }
  }
}));

const Welcome: FC<WelcomeProps> = ({ onConfirm }) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const dispatch = useDispatch();
  const { settings, saveSettings } = useSettings();
  const [open, setOpen] = useState<boolean>(true);
  const [isNewProject, setNewProject] = useState<boolean>(false);
  const [value, setValue] = useState<number>(null);
  const { preference } = useSelector((state) => state.preference);
  const { zoom } = useSelector((state) => state.zoom);

  useEffect(() => {
    dispatch(getPreference());
  }, [dispatch]);

  const handleClose = (e, r): void => {
    if (r === 'backdropClick') return;
    setOpen(false);
    saveSettings({ theme: settings.theme, isLogin: false });
    onConfirm && onConfirm();
  };

  const handleChange = (event): void => setValue(event.currentTarget.value);

  const handleNewProject = (): void => {
    setOpen(false);
    setNewProject(true);
  };

  const handleLoad = (): void => {
    dispatch(updateProject(String(value)));
    saveSettings({ theme: settings.theme, isLogin: false });
    setOpen(false);
    onConfirm && onConfirm();
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialog }}
        style={{
          minWidth: (window.screen.availHeight / zoom) * 0.8,
          minHeight: (window.screen.availHeight / zoom) * 0.6
        }}
        disableEscapeKeyDown
        keepMounted
        fullWidth
      >
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h6">Welcome to CART!</Typography>
        </DialogTitle>
        <DialogContent
          dividers
          style={{ backgroundColor: theme.palette.background.paper }}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="flex-start"
            spacing={3}
            style={{
              marginTop:
                zoom <= 1 ? (window.screen.availHeight / zoom) * 0.02 : 0
            }}
          >
            <Grid item md={6} xs={12}>
              <Typography
                variant="body1"
                style={{
                  marginTop:
                    zoom <= 1 ? (window.screen.availHeight / zoom) * 0.02 : 0
                }}
              >           
                <br />
                To get started, please create or load a project by selecting one
                of the options to the right. This project will store all
                configurations made, and associate them with your mission. Once
                created, these projects may be accessed again at any time by
                selecting them from the list to the right.
              </Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              <Box
                textAlign="center"
                borderLeft={1}
                borderColor={
                  theme.name === THEMES.DARK
                    ? theme.palette.primary.main
                    : colors.grey[500]
                }
              >
                <Box mb={4}>
                  <FormControl className={classes.formControl}>
                    <Select
                      multiple
                      native
                      value={[value]}
                      onChange={handleChange}
                    >
                      {preference.project.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.projectName}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleNewProject}
                  color="primary"
                  style={{ marginRight: 8 }}
                >
                  New Project
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLoad}
                  disabled={!value}
                  color="primary"
                >
                  Load Project
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {isNewProject && <NewProject onConfirm={onConfirm} isWelcome={true} />}
    </div>
  );
};

export default Welcome;
