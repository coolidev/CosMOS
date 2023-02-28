import { FC, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Grid, Button, TextField, makeStyles, Theme, Select, MenuItem, Menu } from '@material-ui/core';
import axios from 'src/utils/axios';
import { State } from 'src/components/Details/DteDetails';
import DialogBox from 'src/components/DialogBox';
import Confirm from './Confirm';
import { useSelector } from 'src/store';

interface AddBandProps {
  id : string;
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
 * Dialog for adding Frequency Band
 *
 * @param {*} { state, onState, onOpen, initialize }
 * @return {*} 
 */
const AddBand: FC<AddBandProps> = ({ 
  id,
  state, 
  onState, 
  onOpen, 
  initialize 
}) => {

  const [open, setOpen] = useState(false);
  const [isTx,setIsTx] = useState<boolean>(false);
  const {email} = useSelector(state => state.user);

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    state.isBand && handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isBand]);

  const handleAdd = async () => {
    try {
      const params = {
        frequencyBandName: state.bandName,
        antennaName: state.antennaName,
        isTx: isTx
      };
      const response = await axios.post('/createFrequencyBand', params);
      response.data && initialize();
      onOpen('band')
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
        email: email,
        networkId : Number(id)
      };
      const response = await axios.post('/deleteFrequencyBand', params);
      response.data && initialize();
    } catch (err) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleOpen = () => {
    setOpen(!open);
    onState({ target: { name: 'isBand', value: false } });
  };

  return (
    <div>
      <DialogBox
        id="band"
        title="Add RF Front-End"
        isOpen={state.band}
        onClose={() => onOpen('band')}
        className={{ paper: classes.dialog }}
      >
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item md={12}>
            <TextField
              name="bandName"
              type="text"
              value={state.bandName}
              placeholder="Name of RF Front-End"
              onChange={onState}
              fullWidth
            />
          </Grid>
          <Grid item md={12}>
              <Select
                labelId="rf_tx_select_label"
                id="rf_tx_select"
                value={isTx ? 1 : 0}
                label="Tx/Rx"
                onChange={(e) => setIsTx(e.target.value === 1)}
              >
                <MenuItem value={0}>Rx</MenuItem>
                <MenuItem value={1}>Tx</MenuItem>
              </Select>
          </Grid>
          {/* <Grid item md={12}>
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

export default AddBand;
