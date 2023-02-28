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

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle style={{
            margin: 0,
            padding: '16px',
            backgroundColor:  theme.palette.primary.light
        }}>{message.title}</DialogTitle>
      <DialogContent style={{ backgroundColor: theme.palette.component.main }}>
        <DialogContentText>
          {message.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.component.main }}>
        <Button onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectionAlert;