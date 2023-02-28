import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Theme,
  Typography
} from '@material-ui/core';
import { FC, useState } from 'react';
import { Close as CloseIcon } from '@material-ui/icons';
import axios from 'src/utils/axios';
import DialogAlert from 'src/components/DialogAlert';

interface AddNetworkAttrProps {
  isOpen: boolean;
  onClose: any;
  networkId: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  close: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    zIndex: 100
  }
}));

const AddNetworkAttr: FC<AddNetworkAttrProps> = ({
  isOpen,
  onClose,
  networkId
}) => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [references, setReferences] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const classes = useStyles();

  const handleChange = (e) => {
    if (e.target === 'name') {
      setName(e.value);
    } else if (e.target === 'value') {
      setValue(e.value);
    } else if (e.target === 'explanation') {
      setExplanation(e.value);
    } else if (e.target === 'references') {
      setReferences(e.value);
    }
  };

  const onSave = async () => {
    try {
      const params = {
        networkId: networkId,
        name: name,
        value: value,
        explanation: explanation,
        references: references
      };
      const response = await axios.post('/addNetworkAttribute', params);
      onClose({
        id: response.data.id,
        name: name,
        value: value,
        explanation: explanation,
        references: references
      });
    } catch (err) {
      setErrorMessage(
        'Something went wrong when adding the new attribute. If the issue persists, please contact CART support'
      );
      setError(true);
    }
  };
  return (
    <>
      <Dialog
        maxWidth={'sm'}
        fullWidth
        open={isOpen}
        keepMounted
        onClose={onClose}
      >
        <DialogTitle>
          Create New Network Attribute
          <IconButton className={classes.close} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <Typography>Attribute Name:</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="name"
                value={name}
                onBlur={handleChange}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    handleChange(ev);
                  }
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Typography>Attribute Value:</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="value"
                value={value}
                onBlur={handleChange}
                onChange={(e) => setValue(e.target.value)}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    handleChange(ev);
                  }
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Typography>Notes:</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="explanation"
                value={explanation}
                onBlur={handleChange}
                onChange={(e) => setExplanation(e.target.value)}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    handleChange(ev);
                  }
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Typography>References:</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="references"
                value={references}
                onBlur={handleChange}
                onChange={(e) => setReferences(e.target.value)}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    handleChange(ev);
                  }
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <Button onClick={onClose} color="primary" variant="outlined">
                Cancel
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button onClick={onSave} color="primary" variant="contained">
                Add Selected
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <DialogAlert
        isOpen={error}
        onOpen={() => setError(!error)}
        title={'Error'}
        message={errorMessage}
      />
    </>
  );
};

export default AddNetworkAttr;
