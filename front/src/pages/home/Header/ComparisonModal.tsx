/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import {
  makeStyles,
  Theme,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Grid,
  TextField
} from '@material-ui/core';
import { SelectedNetwork } from 'src/types/preference';


interface HelpModalProps {
  open: boolean;
  onOpen: () => void;
  markForComparison: (name: string) => void;
  selectedItems: SelectedNetwork[];
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minWidth: theme.spacing(100) + 'px !important',
    minHeight: theme.spacing(60) + 'px !important',
    maxWidth: theme.spacing(100) + 'px !important',
    maxHeight: theme.spacing(60) + 'px !important',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem'
  },
  tab: {
    color: '#fff',
    '&:hover': {
      color: '#aaa'
    },
    width: theme.spacing(40),
    position: 'absolute',
    verticalAlign: 'middle',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    bottom: '5%',
    left: theme.spacing(30)
  }
}));

const HelpModal: FC<HelpModalProps> = ({ 
  open, 
  onOpen,
  markForComparison,
  selectedItems
}) => {
  const [name, setName] = useState('');

  const classes = useStyles();

  useEffect(() => {
    let newName = '';
    selectedItems.forEach(item => {
      newName += `${item.name}, `
    });
    newName = newName.slice(0, -2);

    setName(newName);
  }, [open]);

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onOpen}
      classes={{ paper: classes.root }}
    >
      <DialogTitle>Comparison Name</DialogTitle>
      <DialogContent>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item md={12}>
            <TextField
              name="name"
              value={name}
              placeholder="Name"
              onChange={(event) => setName(event.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onOpen} color="primary">
          Cancel
        </Button>
        <Button onClick={() => { markForComparison(name); onOpen(); }} color="primary" autoFocus>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpModal;
