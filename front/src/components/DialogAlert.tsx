/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, forwardRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
  useTheme,
  makeStyles,
  Typography,
  IconButton,
  Grid
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import type { Theme } from 'src/theme';
import { Cancel as CancelIcon, Close as CloseIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => ({
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
}))

interface DialogAlertProps {
  isOpen: boolean;
  onOpen: () => void;
  title: string;
  message: string;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogAlert: FC<DialogAlertProps> = ({
  isOpen,
  onOpen,
  title,
  message
}) => {
  const theme = useTheme<Theme>();
  const handleClose = (): void => onOpen();
  const classes = useStyles()

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      style={{ zIndex: "1301" }}
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
          {title}
        </Typography>
        <div className='ml-auto' />
        <IconButton size="small" onClick={() => handleClose()}>
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ backgroundColor: theme.palette.component.main }}>
        <Grid container className='py-2 px-2 text-left'>
          <Grid item md={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CancelIcon style={{ color: theme.palette.border.main, width: '5rem', height: '5rem' }} />
          </Grid>
          <Grid item md={9}>{message}</Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.component.main }}>
        <Button onClick={handleClose} color="primary" variant="contained">
          {`OK`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAlert;