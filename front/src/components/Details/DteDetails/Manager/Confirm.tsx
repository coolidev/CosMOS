import { FC } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  useTheme
} from '@material-ui/core';
import type { Theme } from 'src/theme';

interface ConfirmProps {
  open: boolean;
  onOpen: () => void;
  onConfirm: () => void;
}

/**
 * Confirmation Dialog for removing DTE object
 *
 * @param {*} { open, onOpen, onConfirm }
 * @return {*} 
 */
const Confirm: FC<ConfirmProps> = ({ 
  open, 
  onOpen, 
  onConfirm 
}) => {

  const theme = useTheme<Theme>();

  const handleClose = () => onOpen();

  const handleConfirm = () => {
    onOpen();
    onConfirm();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{
            margin: 0,
            padding: '16px',
            backgroundColor: theme.palette.primary.light
        }}>Confirm</DialogTitle>
      <DialogContent style={{ backgroundColor: theme.palette.component.main }} >
        <DialogContentText>
          Do you wish to remove this?
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.component.main }}>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Confirm;
