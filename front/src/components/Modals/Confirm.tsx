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
  useTheme
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import { useDispatch } from 'src/store';
import { updateProject } from 'src/slices/project';
import type { Theme } from 'src/theme';

interface ConfirmProps {
  open: boolean;
  onOpen: () => void;
  onConfirm: () => void;
  hidePrompt?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    maxWidth: '768px'
  },
  title: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.light
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(4),
    top: theme.spacing(2),
    padding: 0,
    color: theme.palette.grey[500]
  },
  infoIcon: {
    fontSize: theme.spacing(12)
  }
}));

const Confirm: FC<ConfirmProps> = ({ open, onOpen, onConfirm, hidePrompt }) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const dispatch = useDispatch();
  const hide = hidePrompt?hidePrompt:false;

  const handleClose = (): void => onOpen();

  const handleConfirm = (): void => {
    dispatch(updateProject(null));
    onOpen();
    onConfirm();
  };

  return (
    <div className={classes.root}>
      <Dialog open={open} onEnter={hide?handleConfirm:null} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="body1">Alert</Typography>
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ backgroundColor: theme.palette.component.main }}>
          <Grid container justifyContent="center">
            <Grid item md={2}>
              <InfoIcon className={classes.infoIcon} />
            </Grid>
            <Grid item md={8}>
              <Typography variant="body1">
                Are you sure you wish to close this project? Any unsaved changes
                will be lost.
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ backgroundColor: theme.palette.component.main }}>
          <Button
            variant="outlined"
            onClick={handleConfirm}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Confirm;
