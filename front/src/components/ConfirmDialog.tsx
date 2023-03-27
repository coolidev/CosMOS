/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, forwardRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Backdrop,
  LinearProgress,
  Slide,
  makeStyles,
  colors,
  Grid,
  Paper,
  useTheme,
  Typography,
  IconButton
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import type { Theme } from 'src/theme';
import { Close as CloseIcon, WarningRounded as WarningIcon } from '@material-ui/icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onOpen: () => void;
  onLoading: () => void;
  onState: (name: string, value: any) => void;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  progressBar: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    borderRadius: 5
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  text: {
    color: colors.grey[100],
    fontWeight: 'bold',
    fontSize: theme.typography.pxToRem(15),
    marginLeft: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    borderRadius: 0
  },
  paperComment: {
    padding: theme.spacing(1),
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: 0
  },
  title: {
    margin: 0,
    padding: theme.spacing(2, 4),
    backgroundColor: theme.palette.primary.main,
    color: "white",
    display: 'flex',
    alignItems: 'center',
  },
  dialogStyle: {
    '& > div > div': {
      border: `2px solid ${theme.palette.border.main}`,
      borderRadius: '8px',
      backgroundColor: theme.palette.background.light
    }
  },
}));

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  isOpen,
  isLoading,
  onOpen,
  onLoading,
  onState
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  const handleClose = (): void => onOpen();

  const handleConfirm = (): void => {
    onOpen();
    onLoading();
    onState('loading', true);
    onState('performanceLoading', true);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        className={classes.dialogStyle}
      >
        <DialogTitle
          disableTypography
          className={classes.title}
        >
          <Typography
            variant="h3"
            component="span"
            style={{ fontWeight: 'normal', color: 'white' }}
          >
            Analysis Required!
          </Typography>
          <div className='ml-auto' />
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon style={{ color: 'white' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ backgroundColor: theme.palette.component.main }}>
          <Grid container className='py-2 text-left'>
            <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center' }}>
              <WarningIcon style={{ color: theme.palette.border.main, width: '100%', height: '6rem' }} />
            </Grid>
            <Grid item xs={10}>
              <DialogContentText style={{ color: theme.palette.text.primary }}>
                This network configuration has not yet been analyzed.
                <br /><br />
                Running an analysis usually takes between 20-30 minutes to complete. Should you continue, we encourage you to
                keep this browser window open throughout the analysis, though it is not required. If you leave this page before completion, you may
                check the status at any time by simply re-running the analysis from this page using the same parameters.
                <br /><br />
                Would you like to begin the analysis now?
              </DialogContentText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ backgroundColor: theme.palette.component.main, padding: theme.spacing(2, 4), gap: theme.spacing(4) }}>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={4} >
            <Paper className={classes.paper}>Running Analysis...</Paper>
            <div className={classes.progressBar}>
              <LinearProgress />
            </div>
            <Paper className={classes.paperComment}>Please be patient while we run the analysis for your selected network configuration. This process usually takes between 20-30 minutes to complete.</Paper>
          </Grid>
        </Grid>
      </Backdrop>
    </>
  );
};

export default ConfirmDialog;
