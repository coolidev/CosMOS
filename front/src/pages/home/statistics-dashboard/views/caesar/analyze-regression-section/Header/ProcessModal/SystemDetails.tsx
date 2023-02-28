/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  Theme,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Tabs,
  Tab,
} from '@material-ui/core';
import CreateSystemModel from './CreateSystemModal';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from './CustomAccordion';
import {
  getModifySystems,
  getGroundStations,
  getVersionIds
} from '../../../../../API';

interface ISystem {
  SYSTEM_ID: number;
  SYSTEM_NAME: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  formControl: {
    margin: theme.spacing(1)
  },
  font: {
    fontSize: '14px'
  }
}));

const SystemDetails: React.FC<any> = (props) => {
  const [systems, setSystems] = useState<ISystem[]>([]);
  const [groundStations, setGroundStations] = useState<{ id: number, name: string }[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [attributeVersions, setAttributeVersions] = useState({});
  const [models, setModels] = useState({ 'relay': {}, 'dte': {} });
  const classes: Record<string, string> = useStyles();

  useEffect(() => {
    fetchSystem();
    fetchGroundStations();
    fetchVersionIds();
  }, []);

  useEffect(() => {
    if (Object.keys(attributeVersions).includes(props.system.toString())) {
      props.changeValues('networkAttributeId', attributeVersions[props.system]);
    } else {
      props.changeValues('networkAttributeId', -1);
    }
  }, [props.system, props.groundStation, attributeVersions]);

  useEffect(() => {
    if (props.tab === 'relay') {
      if (Object.keys(models['relay']).includes(props.system.toString())) {
        props.changeValues('modelId', models['relay'][props.system].version);
      } else {
        props.changeValues('modelId', -1);
      }
    } else {
      if (Object.keys(models['dte']).includes(props.groundStation.toString())) {
        props.changeValues('modelId', models['dte'][props.groundStation].version);
      } else {
        props.changeValues('modelId', -1);
      }
    }
  }, [props.system, props.groundStation, models, props.tab]);

  const changeSystem = (e: any) => {
    const newSystem = e.target.value as number;
    props.onChangeSystem(newSystem);
    props.changeValues('threshold', NaN);

    if (newSystem === -2) {
      props.changeValues('networkAttributeId', -2);
      props.changeValues('modelId', -2);
    }
  };

  const handleClose = () => {
    setOpen(!open);
    fetchSystem();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    props.changeValues(name, value);
  };

  const fetchSystem = async () => {
    getModifySystems()
      .then((res) => {
        const value = res.data.length > 0 ? res.data[0].SYSTEM_ID : -1;

        setSystems(res.data);
        props.onChangeSystem(value);
      })
      .catch(() => {
        setSystems([]);
      });
  };

  const fetchGroundStations = async () => {
    getGroundStations()
      .then((res) => {
        setGroundStations(res.data);

        const value = res.data.length > 0 ? res.data[0].id : -1;
        props.onChangeGroundStation(value);
      })
      .catch(() => {
        setSystems([]);
      });
  };

  const fetchVersionIds = async () => {
    getVersionIds().then((res) => {
      setAttributeVersions(res.data.attributeIds);
      setModels(res.data.modelIds);
    });
  };

  const handleTab = (event, newValue) => props.onChangeTab(newValue);

  return (
    <>
      <Accordion
        square
        expanded={props.expanded === 'panel1'}
        onChange={() => props.onChange('panel1')}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{'1. System'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Tabs
              value={props.tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleTab}
            >
              <Tab value={'relay'} label="Relay" />
              <Tab value={'dte'} label="DTE" />
            </Tabs>
            {props.tab === 'relay' ? (
              <><Grid item md={8}>
              <Typography className={classes.font}>
                a. Select the data source. 
              </Typography>
            </Grid>
            <Grid item md={4}>
              <FormControl
                variant="outlined"
                size="small"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel>Source</InputLabel>
                <Select
                  name="type"
                  value={props.values.type}
                  label="File Type"
                  defaultValue=""
                  onChange={handleChange}
                >
                  <MenuItem value="stk">STK</MenuItem>
                  <MenuItem value="ns3">NS3</MenuItem>
                </Select>
              </FormControl>
            </Grid><Grid item md={8}>
                <Typography className={classes.font}>
                  b. Select the system. 
                </Typography>
              </Grid>
              <Grid item md={4}>
                <FormControl
                  variant="outlined"
                  size="small"
                  className={classes.formControl}
                  disabled={props.values.type === 'ns3'}
                  fullWidth
                >
                  <InputLabel>System</InputLabel>
                  <Select
                    value={props.system}
                    label="System"
                    defaultValue=""
                    onChange={(e: any) => changeSystem(e)}
                  >
                    <MenuItem value={-1} disabled>{`Choose System`}</MenuItem>
                    {systems.map((item: ISystem) => (
                      <MenuItem
                        value={item.SYSTEM_ID}
                        key={`${item.SYSTEM_NAME}-${item.SYSTEM_ID}`}
                      >
                        {item.SYSTEM_NAME}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                {Object.keys(models['relay']).includes(props.system.toString()) ? 
                  `The uploaded data will be associated with model version 
                    ${models['relay'][props.system].version} that was uploaded on ${models['relay'][props.system].dateUploaded}.
                    If you'd rather use a different model, upload it now.` : 
                  `There is no model associated with this network. Please upload a model file.`}
              </Grid>
              <Grid item md={12}>
                <Typography className={classes.font}>
                  c. Choose the mission type. 
                </Typography>
              </Grid>
              <Grid item md={12}>
                <RadioGroup
                  name="missionType"
                  value={props.values.missionType}
                  onChange={(event) => props.changeValues('missionType', event.target.value)}
                  row
                >
                  <div
                    style={{
                      minWidth: '15vw',
                      maxWidth: '15vw',
                      color: '#000',
                      display: 'inline-block'
                    }}
                  >
                    <FormControlLabel
                      value="orbital"
                      control={<Radio />}
                      label="Orbital"
                    />
                  </div>
                  <div
                    style={{
                      minWidth: '',
                      maxWidth: '',
                      color: '#000',
                      display: 'inline-block'
                    }}
                  >
                    <FormControlLabel
                      value="terrestrial"
                      control={<Radio />}
                      label="Terrestrial"
                    />
                  </div>
                </RadioGroup>
              </Grid>
              <Grid item md={8}>
                <Typography className={classes.font}>
                  d. Enter the power threshold value (prec).
                </Typography>
              </Grid>
              <Grid item md={4}>
                <TextField
                  name="threshold"
                  label="Power Threshold"
                  value={props.values.threshold}
                  variant="outlined"
                  size="small"
                  className={classes.formControl}
                  type="number"
                  onChange={handleChange}
                  disabled={props.values.type === 'ns3'}
                  fullWidth
                  required
                />
              </Grid></>
              ) : <><Grid item md={12}>
                {`Select "Ingestion and Post Processing" to upload new data files and run the post processing 
                  script after the upload is complete. To run the post processing script without uploading any new 
                  data (for example, if you add a new frequency band to an existing ground station), select
                  the "Post Processing" option from the menu.`}
              </Grid><Grid item md={8}>
              <Typography className={classes.font}>
                a. Select the script to execute.
              </Typography>
            </Grid>
            <Grid item md={4}>
              <FormControl
                variant="outlined"
                size="small"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel>Script</InputLabel>
                <Select
                  name="script"
                  value={props.values.script}
                  label="Script"
                  defaultValue=""
                  onChange={handleChange}
                >
                  <MenuItem value={-1} disabled>{`Choose Script`}</MenuItem>
                  <MenuItem
                    value={'ingestion'}
                    key={`ingestion`}
                  >
                    {`Ingestion and Post Processing`}
                  </MenuItem>
                  <MenuItem
                    value={'post-processing'}
                    key={`post-processing`}
                  >
                    {`Post Processing`}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>{props.values.script === 'ingestion' && <><Grid item md={8}>
              <Typography className={classes.font}>
                b. Select the ground station. 
              </Typography>
            </Grid>
            <Grid item md={4}>
              <FormControl
                variant="outlined"
                size="small"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel>Ground Station</InputLabel>
                <Select
                  value={props.groundStation}
                  label="Ground Station"
                  defaultValue=""
                  onChange={(e: any) => props.onChangeGroundStation(e.target.value)}
                >
                  <MenuItem value={-1} disabled>{`Choose Ground Station`}</MenuItem>
                  {groundStations.map((groundStation: { id: number, name: string }) => (
                    <MenuItem
                      value={groundStation.id}
                      key={`${groundStation.name}-${groundStation.id}`}
                    >
                      {groundStation.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={12}>
              {Object.keys(models['dte']).includes(props.groundStation.toString()) ? 
                `The uploaded data will be associated with model version 
                  ${models['dte'][props.groundStation].version} that was uploaded on ${models['dte'][props.groundStation].dateUploaded}.
                  If you'd rather use a different model, upload it now.` : 
                `There is no model associated with this network. Please upload a model file.`}
            </Grid></>}</>}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <CreateSystemModel open={open} onClose={handleClose} />
    </>
  );
};

export default SystemDetails;