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
  useTheme
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import type { Theme } from 'src/theme';

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

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      style = {{zIndex: "1301"}}
    >
      <DialogTitle style={{
            margin: 0,
            padding: '16px',
            backgroundColor:  theme.palette.primary.light
        }}>{title}</DialogTitle>
      <DialogContent style={{ backgroundColor: theme.palette.component.main }}>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.component.main }}>
        <Button onClick={handleClose} color="primary">
          {`OK`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAlert;