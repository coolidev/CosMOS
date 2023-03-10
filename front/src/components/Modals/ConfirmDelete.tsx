import { FC } from 'react';
import {
  Grid,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Button,
  IconButton,
  makeStyles,
  DialogActions,
  useTheme,
  Icon
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'src/store';
import { updateProject } from 'src/slices/project';
import type { Theme } from 'src/theme';

interface ConfirmProps {
  open: boolean;
  onOpen: () => void;
  onConfirm: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    maxWidth: '768px'
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
  infoIcon: {
    fontSize: theme.spacing(12)
  }
}));

const ConfirmDelete: FC<ConfirmProps> = ({ open, onOpen, onConfirm }) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const dispatch = useDispatch();

  const handleClose = (): void => onOpen();

  const handleConfirm = (): void => {
    dispatch(updateProject(null));
    onOpen();
    onConfirm();
  };

  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth className={classes.dialogStyle}>
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h4">Alert</Typography>
          <div className='ml-auto' />
          <IconButton className={classes.closeButton} onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ backgroundColor: theme.palette.component.main, padding: '2rem 1.5rem' }}>
          <Grid container justifyContent="center">
            <Grid item md={2}>
              {/* <InfoIcon className={classes.infoIcon} /> */}
              <Icon style={{ background: theme.palette.border.main, fontSize: '56px', display: 'flex', alignItems: "center", borderRadius: '50%' }} fontSize="large">
                <svg width="56px" height="56px" viewBox="0 0 700 700" fill={theme.palette.background.light}>
                  <g>
                    <path d="m350 583.75c-28.996 0-52.5-23.504-52.5-52.5s23.504-52.5 52.5-52.5 52.5 23.504 52.5 52.5-23.504 52.5-52.5 52.5z" fill-rule="evenodd" />
                    <path d="m350 76.246c-38.629 0-70.004 31.375-70.004 70.004 0 23.668 15.457 192.43 36.75 258.99 4.7773 14.953 10.512 25.527 15.688 30.734 5.6367 5.6719 11.781 7.7695 17.566 7.7695s11.93-2.1016 17.566-7.7695c5.1758-5.207 10.91-15.781 15.688-30.734 21.293-66.559 36.75-235.32 36.75-258.99 0-38.629-31.375-70.004-70.004-70.004z" fill-rule="evenodd" />
                  </g>
                </svg>
              </Icon>
            </Grid>
            <Grid item md={9}>
              <Typography variant="body1">
                Are you sure you wish to close this project?
                Any unsaved changes will be lost.
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ backgroundColor: theme.palette.component.main }}>
          <Button variant="contained" onClick={handleClose} color="primary" className='mr-2'>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmDelete;
