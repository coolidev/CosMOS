import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  DialogActions,
  Button,
  Grid,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import { grey } from "@material-ui/core/colors";
import DialogBox from 'src/components/DialogBox';
import SystemDetailsSection from './SystemDetails';
import NewDataSection from './NewData';
import { BASE_URL } from 'src/utils/constants/paths';
import axios from 'src/utils/axios';

interface ProcessModalProps {
  type: string;
  isOpen: boolean;
  onClose(): void;
  onNewSnackbar(snackbar: any): void;
  onRefresh(): void;
  onUpdateSystems(): void;
  onSystem(system: number): void;
}

interface ISource {
  name: string;
  size: number;
  status: string;
}

interface StateValues {
  threshold: string;
  type: string;
  version: number;
  networkAttributeId: number;
  beamType: number;
  modelId: number;
  isNewVersion: string;
  missionType: string;
  script: string;
}

const useStyles = makeStyles((theme) => ({
  authcard: {
    marginTop: "10vh",
    minWidth: "30vw",
    padding: theme.spacing(3),
  },
  link: {
    paddingRight: theme.spacing(2),
    color: "#3385ff",
    textDecoration: "none",
  },
  cartCard: {
    padding: 0,
  },
  cartCardContent: {
    paddingRight: 0,
    paddingLeft: 0,
    overflowX: "hidden",
    height: "85vh",
    backgroundColor: grey[50]
  },
  chartCard: {
    padding: theme.spacing(3),
  },
  searchSelect: {
    textAlignLast: "center",
  },
  tooltip: {
    maxWidth: "500px",
  },
  dialogDeep: {
    minWidth: "43vw !important",
    height: "90vh !important",
    maxWidth: "40vw !important",
    backgroundColor: theme.palette.grey[100],
  },
  dashDialogDeep: {
    height: "93vh !important",
    minWidth: "80vw !important",
    maxWidth: "80vw !important",
    backgroundColor: theme.palette.grey[100],
  },
  dialogModify: {
    minWidth: "40vw !important",
    maxWidth: "40vw !important",
  },
  dialogCloseBtn: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    zIndex: 100,
  },
  contentSection: {
    backgroundColor: grey[500],
    height: "100%",
    maxHeight: "55vh",
    overflow: "auto",
  },
  label: {
    fontSize: 14,
  },
  formControl: {
    margin: theme.spacing(1),
  },
  dialog: {
    minWidth: theme.spacing(250) + 'px !important',
    maxWidth: theme.spacing(250) + 'px !important',
    minHeight: theme.spacing(200) + 'px !important',
    maxHeight: theme.spacing(200) + 'px !important'
  }
}));

const INIT_STATE = {
  threshold: '',
  type: 'stk',
  version: -1,
  networkAttributeId: -1,
  beamType: -1,
  modelId: -1,
  isNewVersion: 'no',
  missionType: 'orbital',
  script: 'ingestion'
};

const ProcessModal: React.FC<ProcessModalProps> = (props) => {
  const [values, setValues] = useState<StateValues>(INIT_STATE);
  const [networkType, setNetworkType] = useState('relay');
  const [system, setSystem] = useState<number>(-1);
  const [groundStation, setGroundStation] = useState(-1);
  const [expanded, setExpanded] = useState('panel1');
  const [uploadedItems, setUploadedItems] = useState<File[]>([]);
  const [listening, setListening] = useState(false);
  const [source, setSource] = useState<Array<any>>([]);
  const [progress, setProgress] = useState<number>(null);
  const [processing, setProcessing] = useState(true);
  const classes: Record<string, string> = useStyles();

  useEffect(() => {
    if (!listening) {
      const events = new EventSource(BASE_URL + '/events');
      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        setSource((nests) => nests.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, source]);

  const handleClick = () => {
    if (networkType === 'dte' && values.script === 'post-processing') {
      axios.post('/run-dte-post-processing', {}).then(_res => {
        props.onUpdateSystems();
        props.onClose();
        setProcessing(false);
      });
    } else {
      setProcessing(true);

      const formData = new FormData();
      formData.append('networkType', networkType);
      formData.append('networkId', system.toString());
      formData.append('groundStationId', groundStation.toString());
      formData.append('networkAttributeId', values.networkAttributeId.toString());
      formData.append('modelId', values.modelId.toString());
      formData.append('prec', values.threshold);
      formData.append('isNewVersion', values.isNewVersion);
      formData.append('missionType', values.missionType);
  
      uploadedItems.forEach((file: File) => {
        formData.append('file', file);
      });

      axios.post('/upload-data-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: data => {
          setProgress(Math.round((100 * data.loaded) / data.total));
        }
      }).then((_res) => {
        props.onUpdateSystems();
        props.onClose();
        setProcessing(false);
      });
    }

    setListening(false);
  };

  const validateParameters = () => {
    if (networkType === 'dte' && values.script === 'post-processing') return false;

    if (networkType === 'relay') {
      if (values.type === 'stk') {
        if (isNaN(parseFloat(values.threshold))) return true;
      }
    }

    if (uploadedItems.length === 0) return true;

    return false;
  };

  return (
    <DialogBox
      title={`Upload or Process Data`}
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      classes={{ paper: classes.dialog }}
    >
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item md={12}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item md={12}>
              <SystemDetailsSection
                expanded={expanded}
                tab={networkType}
                system={system}
                groundStation={groundStation}
                values={values}
                changeValues={(name: string, value: any) => setValues((prevState) => ({ ...prevState, [name]: value }))}
                onChange={(value: string) => setExpanded(value)}
                onChangeTab={(value: string) => setNetworkType(value)}
                onChangeSystem={(value: number) => setSystem(value)}
                onChangeGroundStation={(value: number) => setGroundStation(value)}
              />
            </Grid>
            {(networkType === 'relay' || values.script === 'ingestion') && <Grid item md={12}>
              <NewDataSection
                expanded={expanded}
                values={values}
                uploadedItems={uploadedItems}
                progress={progress}
                processing={processing}
                changeProgress={(value: number | null) => setProgress(value)}
                onChange={(value: string) => setExpanded(value)}
                changeValues={(name: string, value: any) => setValues((prevState) => ({ ...prevState, [name]: value }))}
                onChangeUploadedItems={(file: File) =>
                  setUploadedItems((prevState) => [...prevState, file])
                }
              />
            </Grid>}
          </Grid>
        </Grid>
        <Grid item md={12}>
          <Box
            border={1}
            style={{
              height: '10rem',
              backgroundColor: '#000',
              overflow: 'auto'
            }}
          >
            <Table size="small" aria-label="status table">
              <TableBody>
                {source.map((row: ISource, idx: number) => (
                  <TableRow key={row.name + idx}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ color: '#fff', borderBottom: 0 }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="right" style={{ color: '#fff', borderBottom: 0 }}>
                      {row.size}
                    </TableCell>
                    <TableCell align="right" style={{ color: '#fff', borderBottom: 0 }}>
                      {row.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Grid>
      </Grid>
      <DialogActions>
        <Button onClick={() => props.onClose()} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleClick} 
          color="primary"
          disabled={validateParameters()}
        >
          Process
        </Button>
      </DialogActions>
    </DialogBox>
  );
};

export default ProcessModal;