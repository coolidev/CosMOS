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
  Box,
  Typography,
  IconButton,
  makeStyles,
  Grid
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import type { Theme } from 'src/theme';
import { Close as CloseIcon, WarningRounded as WarningIcon } from '@material-ui/icons';

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

interface SelectionAlertProps {
  isOpen: boolean;
  onOpen: () => void;
  message: { title: string, message: string };
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SelectionAlert: FC<SelectionAlertProps> = ({
  isOpen,
  onOpen,
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
          {message.title}
        </Typography>
        <div className='ml-auto' />
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ backgroundColor: theme.palette.component.main }}>
        <Grid container className='py-2 px-2 text-left'>
          <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WarningIcon style={{ color: theme.palette.border.main, width: '100%', height: '8rem' }} />
          </Grid>
          <Grid item xs={9}>
            <DialogContentText>
              {message.message}
            </DialogContentText>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.component.main, padding: theme.spacing(2, 4) }}>
        <Button onClick={handleClose} color="primary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectionAlert;
