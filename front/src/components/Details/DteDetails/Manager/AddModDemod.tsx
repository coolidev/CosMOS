import { FC, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Grid, Button, TextField, makeStyles, Theme } from '@material-ui/core';
import axios from 'src/utils/axios';
import { State } from 'src/components/Details/DteDetails';
import DialogBox from 'src/components/DialogBox';
import Confirm from './Confirm';
import { useSelector } from 'src/store';

interface AddModDemodProps {
  id:string;
  state: State;
  onOpen: (event) => void;
  onState: (event) => void;
  initialize: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    width: '25vw'
  }
}));

/**
 * Dialog for adding ModDemod
 *
 * @param {*} {
 *   state,
 *   onState,
 *   onOpen,
 *   initialize
 * }
 * @return {*} 
 */
const AddModDemod: FC<AddModDemodProps> = ({
  id,
  state,
  onState,
  onOpen,
  initialize
}) => {
  const [open, setOpen] = useState(false);
  const {email} = useSelector(state => state.user);

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    state.isModDemod && handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isModDemod]);

  const handleAdd = async () => {
    try {
      const params = {
        frequencyBandName: state.bandName,
        antennaName: state.antennaName,
        modDemodName: state.modDemodName
      };
      const response = await axios.post('/createModDemod', params);
      response.data && initialize();
      onOpen('modDemod');
    } catch (err) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleConfirm = async () => {
    try {
      const params = {
        frequencyBandName: state.bandName,
        antennaName: state.antennaName,
        modDemodName: state.modDemodName,
        email: email,
        networkId: Number(id)
      };
      const response = await axios.post('/deleteModDemod', params);
      response.data && initialize();
    } catch (err) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleOpen = () => {
    setOpen(!open);
    onState({ target: { name: 'isModDemod', value: false } });
  };

  return (
    <div>
      <DialogBox
        id="modDemod"
        title="Add Mod / Demod"
        isOpen={state.modDemod}
        onClose={() => onOpen('modDemod')}
        className={{ paper: classes.dialog }}
      >
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item md={12}>
            <TextField
              name="modDemodName"
              type="text"
              value={state.modDemodName}
              placeholder="Name of Mod / Demod"
              onChange={onState}
              fullWidth
            />
          </Grid>
          {/* <Grid item md={12}>
            <TextField
              name="bandName"
              type="text"
              value={state.bandName}
              placeholder="Name of RF Front-End"
              onChange={onState}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              name="antennaName"
              type="text"
              value={state.antennaName}
              placeholder="Associated Antenna"
              onChange={onState}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              name="stationName"
              type="text"
              value={state.stationName}
              placeholder="Associated Platform"
              onChange={onState}
              disabled
              fullWidth
            />
          </Grid> */}
          <Grid item md={12}>
            <Button
              name="submitSystem"
              variant="contained"
              color="primary"
              onClick={handleAdd}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </DialogBox>
      <Confirm open={open} onOpen={handleOpen} onConfirm={handleConfirm} />
    </div>
  );
};

export default AddModDemod;
