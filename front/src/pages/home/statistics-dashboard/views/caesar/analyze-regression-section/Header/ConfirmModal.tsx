import React, { useState, useEffect, FC } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  useTheme
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import type { Theme } from 'src/theme';

interface ConfirmModalProps {
  open: boolean;
  name: string;
  onClose(): void;
  onChangeAgree(): void;
}

const statement = [
  { name: 'delete', value: 'Are you sure to delete selected records?' },
  { name: 'deleteAll', value: 'Are you sure to delete all records for selected system?' },
  { name: 'migrate', value: 'Are you sure to transfer all records to production database?' }
];

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const ConfirmModal: FC<ConfirmModalProps> = ({
  open,
  name,
  onClose,
  onChangeAgree
}) => {
  const theme = useTheme<Theme>();
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (name) {
      const des = statement.find((el) => el.name === name);
      setValue(des.value);
    }
  }, [name]);

  const handleClick = () => {
    onChangeAgree();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle style={{
            margin: 0,
            padding: '16px',
            backgroundColor: theme.palette.primary.light
        }}>Confirm</DialogTitle>
      <DialogContent style={{ backgroundColor: theme.palette.component.main }}>
        <DialogContentText>{value}</DialogContentText>
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.component.main }}>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClick} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;