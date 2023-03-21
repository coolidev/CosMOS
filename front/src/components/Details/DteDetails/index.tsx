/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, FC } from 'react';
import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
  IconButton,
  CssBaseline,
  Tabs,
  Tab,
  Box,
  makeStyles,
  useTheme,
  Switch,
  Grid,
  styled,
  FormControlLabel
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Close as CloseIcon } from '@material-ui/icons';
import axios from 'src/utils/axios';
import { Detail, Master } from 'src/types/details';
import EngineerModal from '../EngineerModal';
import Manager from './Manager';
import type { Theme } from 'src/theme';
import LinksBuilder from './LinksBuilder';
import LinksList from './LinksList';
import NetworkOverview from './NetworkOverview';

interface DteDetailsProps {
  id: number;
  onClose: () => void;
  platformType: number;
  refresh: () => void;
}

export interface Source {
  id: number;
  detail: Detail;
  isAdmin: boolean;
  isEditable: boolean;
}

//Why do we have another variable type for state when we already have the state?
//What is this
//It needs to change
export interface State {
  reload: boolean;
  station: boolean;
  stationName: string;
  antenna: boolean;
  modDemod: boolean;
  modDemodName: string;
  antennaName: string;
  band: boolean;
  bandName: string;
  isStation: boolean;
  isAntenna: boolean;
  isBand: boolean;
  isModDemod: boolean;
}

export const initialState: State = {
  reload: true,
  station: false,
  antenna: false,
  band: false,
  modDemod: false,
  stationName: '',
  antennaName: '',
  bandName: '',
  modDemodName: '',
  isStation: false,
  isAntenna: false,
  isBand: false,
  isModDemod: false
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  container: {
    paddingTop: theme.spacing(0.5)
  },
  card: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.light
  },
  backBtn: {
    width: '100px',
    height: '36px'
  },
  close: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.background.light,
    zIndex: 100
  },
  dialogBox: {
    '& > div > div': {
      border: `2px solid ${theme.palette.border.main}`,
      borderRadius: '8px'
    }
  }
}));

const AdvancedSwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 22,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 18,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(28px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(28px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#E34747',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '2px 2px 4px 0 rgb(0 0 0 / 10%)',
    width: 18,
    height: 18,
    borderRadius: '50%',
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 12,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

/**
 * DTE Network Details Panel
 *
 * @param {*} { id, onClose }
 * @return {*} 
 */
const DteDetails: FC<DteDetailsProps> = ({ id, onClose, platformType, refresh }) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  const email = localStorage.getItem('email');
  const [title, setTitle] = useState<string>('');
  const [source, setSource] = useState<Source>();
  const [networkSource, setNetworkSource] = useState<any>();
  const [state, setState] = useState<State>(initialState);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const apiCall = platformType == 1 ? '/requestDTEDetails' : '/requestRelayDetails';
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);

  const fetchData = async () => {
    const params = { id, email, platformType: platformType };
    const response = await axios.post<{
      master: Master[];
      detail: Detail;
      csvData: any;
      admin: { admin: boolean };
      isEditable: boolean;
    }>(apiCall, params);

    if (response.data) {
      const title = response.data.detail.system_name;
      const isAdmin = response.data.admin.admin;
      const isEditable = response.data.isEditable;
      setSource({ id, detail: response.data.detail, isAdmin, isEditable });
      setTitle(title);
    }
  };

  const fetchNetworkData = async () => {
    const params = { networkId: id }
    const response = await axios.post('/getNetworkOverview', params);
    if (response.data) {

      setNetworkSource(response.data);
    }
  }

  useEffect(() => {
    fetchData();
    fetchNetworkData();
  }, [state.reload]);


  const handleChange = (event, value) => setCurrentTab(value);

  const handleState = (name: string, value: string | boolean) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const initialize = () => setState({ ...initialState, reload: !state.reload });

  return (
    <Dialog
      open={Boolean(id)}
      TransitionComponent={Transition}
      maxWidth="lg"
      onClose={onClose}
      fullWidth
      className={classes.dialogBox}
    >
      <CssBaseline />
      <DialogTitle
        style={{
          margin: 0,
          padding: '9px 16px',
          backgroundColor: theme.palette.border.main,
          color: "white"
        }}
      >
        <Typography component="strong" variant="h4">
          {title}
        </Typography>
        <IconButton className={classes.close} onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers={true}
        style={{ backgroundColor: theme.palette.background.light }}
      >
        <Grid
          container
          spacing={1}
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item>
            <Tabs
              value={currentTab}
              indicatorColor="primary"
              // textColor="primary"
              onChange={handleChange}
              aria-label="network detail tabs"
            >
              <Tab value={0} label="Overview" style={{ fontSize: '16px' }} />
              <Tab value={1} label="Topology" style={{ fontSize: '16px' }} />
              {source?.isEditable && advancedMode && <Tab value={2} label="Connection Builder" style={{ fontSize: '16px' }} />}
              <Tab value={3} label="Connection List" style={{ fontSize: '16px' }} />
              <Tab value={4} label="Engineering Models" style={{ fontSize: '16px' }} />
            </Tabs>
          </Grid>
          {source?.isEditable && (
            <>
              <div className='ml-auto' />
              <Grid item style={{ minHeight: '52px', padding: '2px', display: 'flex' }} alignItems="center">
                <FormControlLabel
                  name='direction'
                  checked={advancedMode}
                  onChange={() => setAdvancedMode(!advancedMode)}
                  control={<AdvancedSwitch edge="start" />}
                  labelPlacement="start"
                  label={<Typography variant='body1' className='px-3' style={{ fontSize: '16px' }}>Advanced Mode</Typography>}
                  style={{ fontSize: '16px' }}
                />
              </Grid>
            </>
          )}
        </Grid>
        <Box className={classes.container}>
          <CssBaseline />
          <Card className={classes.card}>
            <CardContent>
              {currentTab === 0 && networkSource && source && (
                <NetworkOverview
                  dataSource={networkSource.source}
                  isAdmin={source?.isEditable}
                  networkId={id}
                  image={networkSource.image}
                  details={networkSource.details}
                  name={networkSource.name}
                  refresh={() => {
                    onClose();
                    refresh();
                  }}
                />
              )}
              {currentTab === 1 && source && (
                <Manager
                  dataSource={source}
                  state={state}
                  onState={handleState}
                  initialize={initialize}
                  isEditable={source?.isEditable}
                  isAdvanced={advancedMode}
                  refresh={() => fetchData()}
                />
              )}
              {currentTab === 2 && <LinksBuilder networkId={id} />}
              {currentTab === 3 && (
                <LinksList networkId={id} isEditable={source?.isEditable} />
              )}
              {currentTab === 4 && (
                <EngineerModal
                  networkId={id}
                  networkName={title}
                  isEditable={source?.isEditable}
                />
              )}
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DteDetails;
