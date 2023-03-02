import {
  Box,
  Button,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  ListItem,
  ListItemText,
  makeStyles,
  Radio,
  Typography,
  useTheme
} from '@material-ui/core';
import { FC, Fragment, useEffect, useState } from 'react';
import { ResultsState } from 'src/slices/results';
import { useDispatch, useSelector } from 'src/store';
import { Project } from 'src/types/preference';
import axios from 'src/utils/axios';
import { PLOT_LIST } from 'src/utils/constants/reporting';
import { ICollapsed, State } from '../home';
import { generateReport, reportImages } from './generate';
import { convertPlotlyToURI } from './utils/convertImage';
import { getPreference } from 'src/slices/preference';
import LoadingOverlay from 'src/components/LoadingOverlay';

//Add an import below for each new report. Each report should have a template file in the /reports/templates folder using the Report interface below.
//Be sure to also push the new report to the reportTemplate array at the start of the Reports class below.
import { report as comparisonReport } from './templates/networkComparisonReport';
import { report as linkBudgetReport } from './templates/linkBudget';
import type { Theme } from 'src/theme';

export interface Report {
  name: string;
  description: string;
  fileType: string;
  needsVisualizer: boolean;
  requiresResults: boolean;
  analyticsView: string;
  html: string;
}

export interface AttrValue {
  id: number;
  name: string;
}

export interface LibraryValue {
  [key: string]: {
    name: string;
    value: string;
  };
}

interface ReportProps {
  project: Project;
  state: State;
  networkPanelStatus: ICollapsed;
  resultPanelCollapsed: boolean;
}

export interface reportInfo {
  codingOptions: AttrValue[];
  modulationOptions: AttrValue[];
  freqBandOptions: AttrValue[];
  gsOptions: AttrValue[];
  antennaOptions: AttrValue[];
  libraryOptions: { [key: number]: LibraryValue };
}

const initialReport = {
  name: '',
  description: null,
  fileType: '',
  needsVisualizer: true,
  requiresResults: true,
  analyticsView: '',
  html: ''
};

const dialogMessages = {
  visualizer:
    'This report requires a snapshot of the Visualizer panel which is currently out of view. Please bring it back into view to generate this report.',
  coverage:
    'This report requires snapshots of RF Coverage plots which are currently not loaded in the Analytics tab. Please switch your view to RF coverage and try again.',
  mac: 'Your report has been successfully generated. Please note that some images may not appear when viewing your report in Microsoft Word for Mac due to incompatibilities with embedded images. This will be resolved in a future release of CART. To view the images in the document, please load the report in a cloud-based document viewer such as SharePoint.'
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  box: {
    backgroundColor: theme.palette.background.light,
    border: `2px solid ${theme.palette.border.main}`,
    overflowY: 'scroll',
    borderRadius: 0
  },
  description: {
    backgroundColor: colors.grey[400],
    marginTop: theme.spacing(6),
    height: '15vh',
    overflowY: 'auto',
    textAlign: 'left',
    lineHeight: 1
  },
  selectionName: {
    textAlign: 'center',
    fontSize: '16px',
    lineHeight: 1,
    fontWeight: 'bold'
  },
  descriptionText: {
    textAlign: 'left',
    fontSize: '14px',
    lineHeight: 1
  },
  hr: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  title: {
    fontStyle: 'italic'
  },
  divider: {
    backgroundColor: theme.palette.border.main
  },
  radio: {
    color: theme.palette.border.main
  },
  button: {
    border: 'none !important',
    borderRadius: '0 0 8px 8px',
    color: `#FFFFFF !important`,
    backgroundColor: '#E34747'
  },
  buttonDisabled: {
    border: 'none !important',
    borderRadius: '0 0 8px 8px',
    color: `#FFFFFF !important`,
    backgroundColor: '#E34747'
  }
}));

const Reports: FC<ReportProps> = ({
  project,
  state,
  networkPanelStatus,
  resultPanelCollapsed
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  // Push new reports to the reports object here
  /*************************************************/
  const reports: Report[] = [];
  // reports.push(technicalReport);
  reports.push(comparisonReport);
  reports.push(linkBudgetReport);
  /**************************************************/

  const [imageList, setImageList] = useState<reportImages[]>([]); //List of all available images to be used in reports
  const [currentReport, setCurrentReport] = useState(initialReport); //used for specifying the report being requested by the user
  const {
    performancePanel,
    analyticsPanel,
    linkBudget,
    comparePanel,
    modCodOptions,
    frequencyBandOptions,
    antennaOptions,
    analyticsView
  } = useSelector((state) => state.results);

  const [results, setResults] = useState<ResultsState>({
    performancePanel: performancePanel,
    analyticsPanel: analyticsPanel,
    linkBudget: linkBudget,
    comparePanel: comparePanel,
    modCodOptions: modCodOptions,
    frequencyBandOptions: frequencyBandOptions,
    antennaOptions: antennaOptions,
    analyticsView: analyticsView
  });

  const [reportSelection, setReportSelection] = useState<Report>(
    reports[0]
      ? reports[0]
      : {
          name: '',
          html: '',
          requiresResults: true,
          needsVisualizer: true,
          description: null,
          fileType: 'DOCX',
          analyticsView: ''
        }
  );

  const [codingRef, setCodingRef] = useState<AttrValue[]>(null);
  const [modulationRef, setModulationRef] = useState<AttrValue[]>(null);
  const [freqBandRef, setFreqBandRef] = useState<AttrValue[]>(null);
  const [gsRef, setgsRef] = useState<AttrValue[]>(null);
  const [antennaRef, setAntennaRef] = useState<AttrValue[]>(null);
  const [libraryRef, setLibraryRef] = useState<{ [key: number]: LibraryValue }>(
    null
  );
  const [visHiddenDiag, setVisHiddenDiag] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Generating Report...'
  );
  // const [successDiag, setSuccessDiag] = useState<boolean>(false);
  const [visualizerListener, setVisualizerListener] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPreference());
  }, [dispatch]);

  useEffect(() => {
    setResults({
      performancePanel: performancePanel,
      analyticsPanel: analyticsPanel,
      linkBudget: linkBudget,
      comparePanel: comparePanel,
      modCodOptions: modCodOptions,
      frequencyBandOptions: frequencyBandOptions,
      antennaOptions: antennaOptions,
      analyticsView: analyticsView
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performancePanel, analyticsPanel, linkBudget, comparePanel]);

  const resetLoadingBar = () => {
    setLoading(false);
    setProgress(0);
    setStatusMessage('Generating Report...');
  };

  useEffect(() => {
    if (visualizerListener) {
      setTimeout(function () {
        if (visualizerListener) {
          let visualizerCache = {
            varName: 'VISUALIZER',
            html: `<p>[Visualizer Image Not Available]</p>`
          };
          setImageList((currList) => [...currList, visualizerCache]);
        }
      }, 5000);
    }
  }, [visualizerListener]);

  //Retrieve a snapshot from the visualizer and add to the image list
  const generateVisualizerSnapshot = () => {
    const frame = document.getElementById('visualizerFrame') as any;
    try {
      if (frame) {
        frame.contentWindow.postMessage({ requestSnapshot: true }, '*');
        window.addEventListener('message', captureVisualizer);
        setVisualizerListener(true);
      } else {
        let visualizerCache = {
          varName: 'VISUALIZER',
          html: `<p>[Visualizer Image Not Available]</p>`
        };
        setImageList((currList) => [...currList, visualizerCache]);
      }
    } catch {
      let visualizerCache = {
        varName: 'VISUALIZER',
        html: `<p>[Visualizer Image Not Available]</p>`
      };
      setImageList((currList) => [...currList, visualizerCache]);
    }
  };

  async function captureVisualizer(event) {
    if (event.data.snapshot) {
      const width = 600;
      const height =
        (width / event.data.snapshot.width) * event.data.snapshot.height;
      let visualizerCache = {
        varName: 'VISUALIZER',
        html: `<img src="${event.data.snapshot.dataURL}" alt="" width="${width}" height="${height}">`
      };
      setImageList((currList) => [...currList, visualizerCache]);
      window.removeEventListener('message', captureVisualizer);
      setVisualizerListener(false);
    }
  }

  //function used for pulling the state of all charts
  async function generateImages() {
    setImageList([]);
    let imageCache: reportImages;
    Object.keys(PLOT_LIST).forEach((imageKey) => {
      imageCache = null;
      let size =
        imageKey.includes('RFCoverage') ||
        imageKey.includes('CoverageStatistics') ||
        imageKey.includes('CoverageDistribution') ||
        imageKey.includes('CoverageRunningAverage')
          ? 450
          : 450;

      convertPlotlyToURI(imageKey + 'plotly', size).then((result) => {
        imageCache = {
          varName: PLOT_LIST[imageKey].replaceAll('$', ''),
          html: result
        };
        setImageList((currList) => [...currList, imageCache]);
      });
    });
  }

  const getCodingOptions = async () => {
    setCodingRef(null);
    const response = await axios.get<AttrValue[]>('/getAttributeValues', {
      params: { sub_key: 'forward_link_coding' }
    });
    response.data && setCodingRef(response.data);
  };

  const getModulationOptions = async () => {
    setModulationRef(null);
    const response = await axios.get<AttrValue[]>('/getAttributeValues', {
      params: { sub_key: 'forward_link_modulation' }
    });
    response.data && setModulationRef(response.data);
  };

  const getFreqBandOptions = async () => {
    setFreqBandRef(null);
    const response = await axios.get<AttrValue[]>('/getAttributeValues', {
      params: { sub_key: 'frequency_bands' }
    });
    response.data && setFreqBandRef(response.data);
  };

  const getGroundStationOptions = async () => {
    setgsRef(null);
    const response = await axios.get<AttrValue[]>(
      '/requestGroundStationDashboard',
      {}
    );
    response.data && setgsRef(response.data);
  };

  const getAntennaOptions = async () => {
    setAntennaRef(null);
    if (state.networkType === 'dte') {
      let stationList: AttrValue[] = [];
      Promise.all(
        state.selectedItems.map(async (station) => {
          const params = {
            groundStationId: station.id,
            frequencyBandId: station.frequencyBandId
          };
          const response = await axios.post<AttrValue[]>(
            '/getAvailableAntennas',
            params
          );
          response.data && (stationList = stationList.concat(response.data));
        })
      ).then(() => {
        stationList = stationList.filter((c, index) => {
          return stationList.indexOf(c) === index;
        });
        setAntennaRef(stationList);
      });
    } else {
      setAntennaRef([]);
    }
  };

  const getLibraryOptions = async () => {
    setLibraryRef(null);
    if (false) {
      state.selectedItems.map(async (network) => {
        const params = { networkId: network.id };
        const response = await axios.post<{ [key: number]: LibraryValue }>(
          '/getNetworkAttributes',
          params
        );
        response.data && setLibraryRef(response.data);
      });
    } else if (state.networkType === 'dte' || state.networkType === 'relay') {
      const list: { [key: number]: LibraryValue } = {};
      Promise.all(
        state.selectedItems.map(async (station) => {
          if (station.antennaId <= 0 || !station.antennaId) {
            list[station.id] = {
              station_name_model_number: {
                name: 'Station Name',
                value: ''
              },
              antenna_frequency: {
                name: 'Supported Frequencies (Literal)',
                value: '[Optimized]'
              },
              antenna_polarization: {
                name: 'Polarization',
                value: '[Optimized]'
              }
            };
          } else {
            let frequencyBandId = 0;
            if (station.frequencyBandId === 0) {
              // Fetch the frequency band options associated with the currently
              // selected ground station.
              const response = await axios.get<any>(
                '/getFrequencyBandOptions',
                {
                  params: {
                    id: state.radioButtonSelectionId,
                    networkType: state.networkType
                  }
                }
              );
              const data = response.data;

              // If no frequency band is currently selected for this item,
              if (
                !state.selectedItems.find((item) => item.id === station.id)
                  ?.frequencyBandId
              ) {
                if (data.frequencyBandOptions[0]) {
                  frequencyBandId = data.frequencyBandOptions[0].id;
                } else {
                  return;
                }
              } else {
                frequencyBandId = state.selectedItems.find(
                  (item) => item.id === station.id
                )?.frequencyBandId;
              }
            } else {
              frequencyBandId = station.frequencyBandId;
            }
            const params = {
              stationId: station.id,
              antennaId: station.antennaId,
              frequencyBandId: frequencyBandId
            };
            const response = await axios.post<{ [key: number]: LibraryValue }>(
              '/getAntennaAttributes',
              params
            );
            if (response.data) {
              list[station.id] = response.data['result'] as LibraryValue;
            }
          }
        })
      ).then(() => {
        setLibraryRef(list);
      });
    } else {
      setLibraryRef({});
    }
  };

  //User triggers report generation - let's start by taking a snapshot of all charts and storing to imageList
  useEffect(() => {
    if (currentReport.name !== '') {
      generateImages();
      generateVisualizerSnapshot();
      getCodingOptions();
      getModulationOptions();
      getFreqBandOptions();
      getGroundStationOptions();
      getAntennaOptions();
      getLibraryOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReport]);

  //Once the image list is fully generated (including both the plot list and the visualizer), lets go ahead and generate our document
  useEffect(() => {
    //Increment progress bar
    let newPct = 0;
    newPct += (imageList.length / (Object.keys(PLOT_LIST).length + 1)) * 50;
    setStatusMessage('Generating Report...');
    if (codingRef) {
      newPct += 8;
    }
    if (modulationRef) {
      newPct += 8;
    }
    if (freqBandRef) {
      newPct += 8;
    }
    if (gsRef) {
      newPct += 8;
    }
    if (antennaRef) {
      newPct += 8;
    }
    if (libraryRef) {
      newPct += 10;
    }
    setProgress(newPct);

    if (
      imageList.length >= Object.keys(PLOT_LIST).length + 1 &&
      currentReport.name !== '' &&
      codingRef &&
      modulationRef &&
      freqBandRef &&
      gsRef &&
      antennaRef &&
      libraryRef
    ) {
      setStatusMessage('Downloading Document...');
      let reportData: reportInfo = {
        codingOptions: codingRef,
        modulationOptions: modulationRef,
        freqBandOptions: freqBandRef,
        gsOptions: gsRef,
        antennaOptions: antennaRef,
        libraryOptions: libraryRef
      };
      generateReport(
        currentReport,
        currentReport.requiresResults,
        currentReport.fileType,
        imageList,
        project,
        state,
        results,
        reportData
      );
      setProgress(100);
      setLoading(false);

      resetLoadingBar();
      //setSuccessDiag(true);
      if (
        window.navigator.appVersion.indexOf('Mac') !== -1 
        // currentReport === technicalReport
      ) {
        setVisHiddenDiag(true);
        setDialogMessage(dialogMessages.mac);
        resetLoadingBar();
      }

      setCurrentReport(initialReport);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    imageList,
    codingRef,
    modulationRef,
    freqBandRef,
    gsRef,
    antennaRef,
    libraryRef
  ]);

  const updateSelection = (event): void => {
    let myReport = reports.find((x: Report) => x.name === event.target.name);
    setReportSelection(
      myReport
        ? myReport
        : {
            name: '',
            html: '',
            requiresResults: true,
            needsVisualizer: true,
            description: null,
            fileType: 'DOCX',
            analyticsView: ''
          }
    );
  };

  const generate = (): void => {
    setLoading(true);
    dispatch(getPreference());
    if (
      ((state.resultTab === 'compare' && !resultPanelCollapsed) ||
        networkPanelStatus === 'up') &&
      reportSelection.needsVisualizer
    ) {
      setVisHiddenDiag(true);
      setDialogMessage(dialogMessages.visualizer);
      resetLoadingBar();
      return;
    }
    if (
      analyticsView !== 'coverage' &&
      reportSelection.analyticsView === 'coverage'
    ) {
      setVisHiddenDiag(true);
      setDialogMessage(dialogMessages.coverage);
      resetLoadingBar();
      return;
    }
    setImageList([]);
    setCurrentReport(reportSelection);
  };

  const closeDialog = (): void => {
    setVisHiddenDiag(false);
  };

  return (
    <>
      <div className={classes.root}>
        {loading && (
          <LoadingOverlay
            isLoading={loading}
            status={statusMessage}
            progress={progress}
          />
        )}
        <Dialog open={visHiddenDiag} keepMounted>
          <DialogTitle
            style={{
              margin: 0,
              padding: '16px',
              backgroundColor: theme.palette.primary.light
            }}
          >
            Alert!
          </DialogTitle>
          <DialogContent
            style={{ backgroundColor: theme.palette.component.main }}
          >
            <DialogContentText>{dialogMessage}</DialogContentText>
          </DialogContent>
          <DialogActions
            style={{ backgroundColor: theme.palette.component.main }}
          >
            <Button onClick={closeDialog} color="primary">
              {`OK`}
            </Button>
          </DialogActions>
        </Dialog>
        <Box
          className={classes.box}
          style={{
            height: '65vh', //(window.screen.availHeight / zoom) * 0.65
            overflowY: 'auto'
          }}
        >
          {reports.map((report: Report, i) => (
            <Fragment key={i}>
              <ListItem
                style={{
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem'
                }}
              >
                <Radio
                  name={report.name}
                  checked={reportSelection.name === report.name}
                  onChange={updateSelection}
                  className={classes.radio}
                />
                <ListItemText
                  primary={
                    <Typography variant="h6" component="h6" color="textPrimary">
                      {report.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body1"
                      component="p"
                      color="textPrimary"
                    >
                      File Format: DOCX
                    </Typography>
                  }
                />
                <Box flexGrow={1} />
              </ListItem>
              <Divider className={classes.divider} />
            </Fragment>
          ))}
        </Box>
        {/* <Card className={classes.description}>
        <CardContent>
          <Typography className={classes.selectionName}>
            {reportSelection.name}
          </Typography>
          <Divider className={classes.hr} />
          <Typography className={classes.descriptionText}>
            {reportSelection.description ?? 'Use the \'Generate Report\' button below to generate and download this report.'}
          </Typography>
        </CardContent>
      </Card> */}
        <Box mb={2}>
          <Button
            variant={'outlined'}
            disabled={
              (reportSelection.name === '' || !state.isDataLoaded) &&
              reportSelection.requiresResults
            }
            className={
              (reportSelection.name === '' || !state.isDataLoaded) &&
              reportSelection.requiresResults
                ? classes.buttonDisabled
                : classes.button
            }
            onClick={generate}
            fullWidth
          >
            Generate Report
          </Button>
        </Box>
      </div>
    </>
  );
};

export default Reports;
