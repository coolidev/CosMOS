/* eslint-disable react-hooks/exhaustive-deps */
import { useState, FC, useEffect, MouseEvent } from 'react';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';
import {
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Tooltip,
  IconButton,
  colors,
  makeStyles,
  Theme,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DeleteSweepOutlinedIcon from '@material-ui/icons/DeleteSweepOutlined';
import ShopTwoOutlinedIcon from '@material-ui/icons/ShopTwoOutlined';
import axios from 'src/utils/axios';
import { deleteRecord, deleteAll, migrate } from '../../../../API';
import ProcessModal from './ProcessModal';
import ConfirmModal from './ConfirmModal';
import RegressionModal from './RegressionModal';
import { blue } from '@material-ui/core/colors';
import LoadingOverlay from 'src/components/LoadingOverlay';
import { useSelector } from 'src/store';
import type {
  ModelData,
  PredictedData
} from 'src/types/evaluation';
import type {
  Params,
  SystemsAndVersions
} from 'src/types/dashboard';
import DialogAlert from 'src/components/DialogAlert';

interface HeaderSectionProps {
  params: Params;
  data: { 
    modelData: ModelData;
    predictedData: PredictedData;
  };
  systemsAndVersions: SystemsAndVersions;
  onRefresh: () => void;
  onUpdateSystems: () => void;
  onClick: (event) => void;
  onNewSnackbar: (snackbar) => void;
  onChange: (name: string, value) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: colors.grey[300],
    minHeight: '6vh'
  },
  formControl: {
    margin: theme.spacing(1)
  },
  systemForm: {
    width: '8vw'
  },
  versionForm: {
    width: '4vw',
    marginLeft: theme.spacing(1)
  },
  space: {
    marginLeft: theme.spacing(2)
  },
  uploadBtn: {
    backgroundColor: colors.blue[500],
    color: '#fff',
    padding: '0.3rem',
    borderRadius: 6
  }
}));

const HeaderSection: FC<HeaderSectionProps> = ({
  params,
  data,
  systemsAndVersions,
  onRefresh,
  onUpdateSystems,
  onClick,
  onNewSnackbar,
  onChange
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isRegOpen, setIsRegOpen] = useState<boolean>(false);
  const [isModal, setModal] = useState<boolean>(false);
  const [isAgree, setAgree] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [feature, setFeature] = useState<string | null>(null);
  const [generatingModel, setGeneratingModel] = useState<boolean>(false);
  const [completedGeneration, setCompletedGeneration] = useState<boolean>(null);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { closeSnackbar } = useSnackbar();
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const { socket } = useSelector(state => state.webSocket);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    socket.addEventListener('message', event => {
      const eventMessage = event.data;
  
      if (eventMessage.includes('Progress:')) {
        setProgress(parseInt(eventMessage.slice(eventMessage.indexOf(':') + 1)));
      } else {
        setStatus(eventMessage);
      }
    });
  }, [socket]);

  let persistSnackbar = null
  useEffect(() => {
    if (feature === 'delete') {
      handleDelete();
    } else if (feature === 'deleteAll') {
      handleAlldelete();
    } else if (feature === 'migrate') {
      persistSnackbar = enqueueSnackbar("Transferring...", {
        persist: true,
        variant: 'info'
      });
      onUpdateSystems();
      handleMigrate();
    }
    setFeature(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAgree]);

  useEffect(() => {
    setDisabled(params.database === 'production');
  }, [params.database]);

  const handleOpen = () => setOpen(!isOpen);

  const handleAgree = () => setAgree(!isAgree);

  const handleModal = () => setModal(!isModal);

  const handleRegOpen = () => setIsRegOpen(!isRegOpen);

  const handleClick = (event: MouseEvent) => {
    const name = event.currentTarget.getAttribute('name');
    setFeature(name);
    setModal(!isModal);
  };

  const handleDelete = async (): Promise<void> => {
    const axiosParams = (params.missionType === 'orbital')
    ?{
      type: params.missionType,
      system: params.system,
      version: params.version,
      model: 0,
      alt: params.altitude,
      inc: params.inclination,
      fileIds: params.fileId,
      networkType: params.networkType
    }
    :{
      type: params.missionType,
      system: params.system,
      version: params.version,
      model: 0,
      latitude: params.latitude,
      longitude: params.longitude,
      fileIds: params.fileId,
      networkType: params.networkType
    };

    deleteRecord(axiosParams).then(() => {
      let snackbar = enqueueSnackbar('Selected record deleted successfully!', {
        persist: false,
        variant: 'success'
      });
      onNewSnackbar(snackbar);
      onUpdateSystems();
    }).catch(() => {
      let snackbar = enqueueSnackbar('Failed to remove record', {
        persist: false,
        variant: 'error'
      });
      onNewSnackbar(snackbar);
    });
  };

  const handleModelGen = async (): Promise<void> => {
    setProgress(0);
    if(params.networkType === 'relay'){
      const axiosParams = {
        networkId: params.system,
        modelVersion: params.version
      };
      setGeneratingModel(true);
      axios.post('/generate-Models', axiosParams).then(() => {
        setGeneratingModel(false);
        setCompletedGeneration(true);
      }).catch(e => {
        setGeneratingModel(false);
        setErrorMessage(e.error);
        setIsAlertOpen(true);
      });
    } else if (params.networkType === 'dte') {
      const axiosParams = {
        groundStationId: params.groundStation,
        frequencyBandId: params.frequencyBand,
        modelVersion: params.version 
      };
      setGeneratingModel(true);
      axios.post('/generate-Models', axiosParams).then(() => {
        setGeneratingModel(false);
        setCompletedGeneration(true);
      }).catch(e => {
        setGeneratingModel(false);
        setErrorMessage(e.error);
        setIsAlertOpen(true);
      });
    }
  }

  useEffect(() => {
    if(!generatingModel && completedGeneration){
      alert('Model Generation Complete!');
      setCompletedGeneration(false);
    }
  }, [generatingModel]);

  const handleAlldelete = async (): Promise<void> => {
    const axiosParams = {
      type: params.missionType,
      system: params.system,
      version: params.version,
      model: 0,
      networkType: params.networkType,
      groundStation: params.groundStation
    };

    deleteAll(axiosParams).then(() => {
     let snackbar = enqueueSnackbar('All records deleted successfully for selected system!', {
      persist: false,  
      variant: 'success'
      });
      onNewSnackbar(snackbar);
      onUpdateSystems();
    }).catch(() => {
      let snackbar = enqueueSnackbar('Failed to remove all records', {
        persist: false,
        variant: 'error'
      });
      onNewSnackbar(snackbar);
    });
  };

  const handleMigrate = async (): Promise<void> => {
    const axiosParams = {
      type: params.missionType,
      system: params.system,
      version: params.version,
      model: 0,
      users: data.modelData.orbital[params.metricType].points,
      networkType: params.networkType,
      groundStation: params.groundStation
    };

    migrate(axiosParams).then(() => {
      let snackbar = enqueueSnackbar('Transfer Successful!', {
        variant: 'success'
      });
      onNewSnackbar(snackbar);
      closeSnackbar(persistSnackbar);
      onUpdateSystems();
    }).catch(() => {
      let snackbar = enqueueSnackbar('Failed to transfer', {
        variant: 'error'
      });
      onNewSnackbar(snackbar);
      closeSnackbar(persistSnackbar);
    });
  };

  return (
    <>
      <LoadingOverlay
        isLoading={generatingModel}
        status={status}
        progress={progress}
      />
      <Grid item md={12}>
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
          className={classes.root}
        >
          <Grid item md={2} className={classes.space}>
            <Grid container justifyContent="center" alignItems="center" spacing={2}>
              <Grid item md={3}>
                <IconButton onClick={handleOpen}>
                  <CloudUploadIcon fontSize="large" className={classes.uploadBtn} />
                </IconButton>
              </Grid>
              <Grid item md={9}>
                <FormControl
                  variant="outlined"
                  size="small"
                  className={classes.formControl}
                  fullWidth
                >
                  <InputLabel id="database-select-label">{`DataBase`}</InputLabel>
                  <Select
                    labelId="database-select-label"
                    id="database-select-outlined"
                    value={params.database}
                    onChange={(e) => onChange('database', e.target.value)}
                    defaultValue=""
                    label="DataBase"
                  >
                    <MenuItem key="staging" value="staging">
                      Staging
                    </MenuItem>
                    <MenuItem key="production" value="production">
                      Production
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={1}>
            <Grid container justifyContent="center" alignItems="center">
              <Grid item md={4}>
                <Tooltip
                  title="Delete selected record"
                  disableHoverListener={disabled}
                  arrow
                >
                  <IconButton name="delete" disabled={disabled} onClick={handleClick}>
                    <DeleteOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item md={4}>
                <Tooltip
                  title="Delete all records for selected system"
                  disableHoverListener={disabled}
                  arrow
                >
                  <IconButton name="deleteAll" disabled={disabled} onClick={handleClick}>
                    <DeleteSweepOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item md={4}>
                <Tooltip
                  title="Transfer all records to Production"
                  disableHoverListener={disabled}
                  arrow
                >
                  <IconButton name="migrate" disabled={disabled} onClick={handleClick}>
                    <ShopTwoOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={params.networkType === 'relay' ? 3 : 5}>
            <FormControl
              variant="outlined"
              size="small"
              className={clsx(classes.formControl, classes.systemForm)}
            >
              <InputLabel id="header-select-system-label">System</InputLabel>
              <Select
                labelId="header-select-system-label"
                id="header-select-system"
                value={params.system}
                onChange={(e) => onChange('system', e.target.value)}
                defaultValue=""
                label="System"
              >
                <MenuItem value="" disabled>
                  <em>{`None`}</em>
                </MenuItem>
                {Object.keys(systemsAndVersions.systems[params.missionType]).map((item: any) => (
                  <MenuItem key={item} value={item}>
                    {systemsAndVersions.systems[params.missionType][item].name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {params.networkType === 'dte' && Object.keys(systemsAndVersions.stationsAndBands).includes(params.system.toString()) ? 
            <><FormControl
              variant="outlined"
              size="small"
              className={clsx(classes.formControl, classes.systemForm)}
            >
              <InputLabel id="header-select-ground-station-label">Ground Station</InputLabel>
              <Select
                labelId="header-select-ground-station-label"
                id="header-select-ground-station"
                value={params.groundStation}
                onChange={(e) => onChange('groundStation', e.target.value)}
                defaultValue=""
                label="Ground Station"
              >
                <MenuItem value="" disabled>
                  <em>{`None`}</em>
                </MenuItem>
                {Object.keys(systemsAndVersions.stationsAndBands[params.system].groundStations).map((item: any) => (
                  <MenuItem key={item} value={item}>
                    {systemsAndVersions.stationsAndBands[params.system].groundStations[item]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              size="small"
              className={clsx(classes.formControl, classes.systemForm)}
            >
              <InputLabel id="header-select-band-label">Frequency Band</InputLabel>
              <Select
                labelId="header-select-band-label"
                id="header-select-band"
                value={params.frequencyBand}
                onChange={(e) => onChange('frequencyBand', e.target.value)}
                defaultValue=""
                label="Frequency Band"
              >
                <MenuItem value="" disabled>
                  <em>{`None`}</em>
                </MenuItem>
                {Object.keys(systemsAndVersions.stationsAndBands[params.system].frequencyBands).includes(params.groundStation) ? Object.keys(systemsAndVersions.stationsAndBands[params.system].frequencyBands[params.groundStation]).map((item: any) => (
                  <MenuItem key={item} value={item}>
                    {systemsAndVersions.stationsAndBands[params.system].frequencyBands[params.groundStation][item]}
                  </MenuItem>
                )) : null}
              </Select>
            </FormControl></> : null}
            <FormControl
              variant="outlined"
              size="small"
              className={clsx(classes.formControl, classes.versionForm)}
            >
              <InputLabel id="header-select-version-label">{`Version`}</InputLabel>
              <Select
                labelId="header-select-version-label"
                id="header-select-version"
                value={params.version}
                onChange={(e) => onChange('version', e.target.value)}
                defaultValue=""
                label="Version"
              >
                <MenuItem value="" disabled>
                  <em>{`None`}</em>
                </MenuItem>
                {systemsAndVersions.versions[params.missionType][params.system].map((item: any) => (
                  <MenuItem key={`version_${item}`} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={2} className={classes.space}>
          <FormControl
              variant="outlined"
              size="small"
              className={clsx(classes.formControl, classes.systemForm)}
            >
              <InputLabel id="header-select-metric-label">Metric Type</InputLabel>
              <Select
                labelId="header-select-metric-label"
                id="header-select-metric"
                value={params.metricType}
                onChange={(e) => onClick(e)}
                defaultValue=""
                label="Metric Type"
              >
                <MenuItem value="" disabled>
                  <em>{`None`}</em>
                </MenuItem>
                {data && Object.keys(data.modelData.orbital).map(metricType => (
                  <MenuItem key={metricType} value={metricType}>
                    {data.modelData.orbital[metricType].label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {Object.keys(systemsAndVersions.systems[params.missionType]).includes(params.system.toString()) && params.networkType === 'relay' && <><Grid item md={2} className={classes.space}>
            <RadioGroup
              name="missionType"
              value={params.missionType}
              onChange={(e) => onChange('missionType', e.target.value)}
              row
            >
              <div
                style={{
                  minWidth: "7vw",
                  maxWidth: "20vw",
                  color: "#000",
                  display: "inline-block"
                }}
              >
                <FormControlLabel
                  value="orbital"
                  control={<Radio />}
                  label="Orbital"
                />
                <FormControlLabel
                  value="terrestrial"
                  control={<Radio />}
                  label="Terrestrial"
                />
              </div>
            </RadioGroup>
          </Grid></>}
          <Button
              name="generateModels"
              variant={"contained"}
              size="small"
              style={{ backgroundColor: blue[700], color: '#fff' }}
              onClick={handleModelGen}
            >
              Generate Models
          </Button>
          {/* <Button
              name="tune_regressions"
              variant={"contained"}
              size="small"
              style={{ backgroundColor: blue[700], color: '#fff' }}
              onClick={handleRegOpen}
            >
              Upload Regressions 
            </Button> */}
        </Grid>
      </Grid>
      <ProcessModal 
        isOpen={isOpen} 
        onClose={handleOpen} 
        onNewSnackbar={onNewSnackbar} 
        onRefresh={() => onRefresh()}
        onUpdateSystems={() => onUpdateSystems()}
        onSystem={(value: number) => (onChange('system', value))}
        type={params.missionType}
      />
      <ConfirmModal
        open={isModal}
        name={feature}
        onClose={handleModal}
        onChangeAgree={handleAgree}
      />
      <RegressionModal 
        isOpen={isRegOpen}
        system={params.system}
        attribute_version={params.version}
        data_version={1}
        model={0} 
        onClose={handleRegOpen} 
        onNewSnackbar={onNewSnackbar} 
      />
      {isAlertOpen && (
        <DialogAlert 
          isOpen={isAlertOpen}
          onOpen={() => setIsAlertOpen(!isAlertOpen)}
          title={'Error'}
          message={errorMessage}
        />
      )}
    </>
  );
};

export default HeaderSection;
