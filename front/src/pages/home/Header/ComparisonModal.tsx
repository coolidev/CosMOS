/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import {
  makeStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
  IconButton
} from '@material-ui/core';
import { SelectedNetwork } from 'src/types/preference';
import { Theme } from 'src/theme';
import { Close as CloseIcon } from '@material-ui/icons';


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
  textBox: {
    color: theme.palette.text.primary,
    '& input': {
      fontSize: '1.25rem',
      borderBottom: `1px solid ${theme.palette.border.main}`
    },
    '& > div:before': {
      // transform: 'scaleX(0.5)'
      borderBottom: `1px solid ${theme.palette.border.main}`
    }
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
          Comparison Name
        </Typography>
        <div className='ml-auto' />
        <IconButton size="small" onClick={() => onOpen()}>
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item md={12} className="py-4">
            <TextField
              name="name"
              value={name}
              placeholder="Comparison Name Here"
              onChange={(event) => setName(event.target.value)}
              fullWidth
              className={classes.textBox}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onOpen} color="primary">
          Cancel
        </Button>
        <Button variant="contained" onClick={() => { markForComparison(name); onOpen(); }} color="primary" autoFocus>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpModal;
