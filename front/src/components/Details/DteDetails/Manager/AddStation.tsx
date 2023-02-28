import { FC, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Grid,
  Button,
  TextField,
  makeStyles,
  Theme,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Tab,
  Tabs,
  FormControl,
  Typography
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { State } from 'src/components/Details/DteDetails';
import DialogBox from 'src/components/DialogBox';
import Confirm from './Confirm';
import DialogAlert from 'src/components/DialogAlert';
import { useSelector } from 'src/store';

interface AddStationProps {
  id: string;
  state: State;
  onOpen: (event) => void;
  onState: (event) => void;
  initialize: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    width: '25vw'
  },
  btn: {
    margin: theme.spacing(2)
  }
}));

/**
 * Dialog for adding Ground Station
 *
 * @param {*} {
 *   id,
 *   state,
 *   onOpen,
 *   onState,
 *   initialize
 * }
 * @return {*}
 */
const AddStation: FC<AddStationProps> = ({
  id,
  state,
  onOpen,
  onState,
  initialize
}) => {
  const [open, setOpen] = useState(false);
  const [newMode, setNewMode] = useState(false);
  const [selection, setSelection] = useState();
  const [GSList, setGSList] = useState([]);
  const [selectedPlatformType, setSelectedPlatformType] = useState<number>(1);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { email } = useSelector((state) => state.user);

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    state.isStation && handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isStation]);

  const handleAdd = async () => {
    try {
      const params = {
        GSName: state.stationName,
        networkId: id,
        attr: {
          name: state.stationName,
          platformType: selectedPlatformType,
          email: localStorage?.getItem('email') ?? ''
        }
      };
      const response = await axios.post('/createPlatform', params);
      response.data && initialize();
    } catch (err) {
      setErrorMessage(
        'An error has occured while trying to add the platform. If the issue persists, please contact CART support for help.'
      );
      setIsAlertOpen(true);
    }
  };

  const handleChange = () => {
    setNewMode(!newMode);
  };

  const handleConfirm = async () => {
    try {
      const params = {
        platformName: state.stationName,
        networkId: id,
        email: email
      };
      const response = await axios.post('/deletePlatform', params);
      response.data && initialize();
    } catch (err) {
      setErrorMessage(
        'An error has occured while trying to add the platform. If the issue persists, please contact CART support for help.'
      );
      setIsAlertOpen(true);
    }
  };

  const handleExistingAdd = async () => {
    try {
      const params = {
        GSId: selection,
        dteId: id
      };
      const response = await axios.post('/duplicateGroundStation', params);
      response.data && initialize();
      onOpen('station');
    } catch (err) {
      setErrorMessage(
        'An error has occured while trying to get the list of availible platforms. If the issue persists, please contact CART support for help.'
      );
      setIsAlertOpen(true);
    }
  };

  const handleGet = async () => {
    try {
      const params = {
        networkId: id,
        email: localStorage.getItem('email')
      };
      const response = await axios.post('/getOtherGroundStations', params);
      setGSList(response.data);
    } catch (err) {
      setErrorMessage(
        'An error has occured while trying to delete the platform. If the issue persists, please contact CART support for help.'
      );
      setIsAlertOpen(true);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
    onState({ target: { name: 'isStation', value: false } });
  };

  const handleSelectionChange = (event) => {
    const GSId = event.target.value;
    setSelection(GSId);
  };

  const handleDropdownChange = (e) => {
    setSelectedPlatformType(e.target.value);
  };

  return (
    <>
      <div>
        <DialogBox
          title={`Add Platform`}
          isOpen={state.station}
          onClose={() => onOpen('station')}
          className={{ paper: classes.dialog }}
        >
          <Paper className={classes.root}>
            <Tabs
              value={newMode}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab value={false} label="New" />
              <Tab value={true} label="Existing" />
            </Tabs>
          </Paper>
          {!newMode && (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item md={4}>
                <Typography>Platform Name:</Typography>
              </Grid>
              <Grid item md={8}>
                <TextField
                  name="stationName"
                  value={state.stationName}
                  placeholder="Name of Platform"
                  onChange={onState}
                  fullWidth
                />
              </Grid>
              <Grid item md={4}>
                <Typography>Platform Type:</Typography>
              </Grid>
              <Grid item md={8}>
                <FormControl variant="outlined" size="small" fullWidth>
                  <Select
                    name="antenna"
                    variant="outlined"
                    color="primary"
                    value={selectedPlatformType}
                    onChange={handleDropdownChange}
                  >
                    <MenuItem value={1} key={1}>
                      {'Terrestrial Fixed'}
                    </MenuItem>
                    <MenuItem value={2} key={2}>
                      {'LEO/MEO'}
                    </MenuItem>
                    <MenuItem value={3} key={3}>
                      {'GEO'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <Button
                  name="submitSystem"
                  variant="contained"
                  color="primary"
                  onClick={handleAdd}
                  style={{ float: 'right' }}
                  disabled={!state.stationName || state.stationName === ''}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          )}

          {newMode && (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item md={8}>
                <InputLabel id="label">Choose a Ground Station</InputLabel>
                <Select
                  labelId="label"
                  id="select"
                  value={selection}
                  onChange={handleSelectionChange}
                  onOpen={handleGet}
                  fullWidth={true}
                >
                  {GSList.map((row: { id: number; name: string }) => (
                    <MenuItem value={row.id}>{row.name}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item md={4}>
                <Button
                  name="submitSystem"
                  variant="contained"
                  color="primary"
                  onClick={handleExistingAdd}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogBox>
        <Confirm open={open} onOpen={handleOpen} onConfirm={handleConfirm} />
      </div>
      <DialogAlert
        isOpen={isAlertOpen}
        onOpen={() => setIsAlertOpen(!isAlertOpen)}
        title={'Error'}
        message={errorMessage}
      />
    </>
  );
};

export default AddStation;
