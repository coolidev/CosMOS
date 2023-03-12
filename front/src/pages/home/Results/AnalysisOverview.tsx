import { FC, useEffect, useState } from 'react';
import {
  Box,
  makeStyles,
  colors,
  Typography,
  Grid,
  Button,
  IconButton,
} from '@material-ui/core';
import Network from './Network';
import type { State } from 'src/pages/home';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { useDispatch, useSelector } from 'src/store';
import SummaryPanel from './SummaryPanel';
import Carousel from 'react-material-ui-carousel';
import { getValue } from 'src/algorithms/regressions';
import axios from 'src/utils/axios';
import { PerformancePanel, RelayCharacteristics } from 'src/types/evaluation';
import AnalysisSelection from './AnalysisSelection';
import { ArrowBackIosRounded, ArrowForwardIosRounded } from '@material-ui/icons';
import { updateResults } from 'src/slices/results';
import { Circle } from 'react-feather';

interface AnalysisOverviewProps {
  resultTab: string;
  collapsed: boolean;
  state: State;
  bounds: { [key: string]: { min: number; max: number } };
  wizardIndex: number;
  setWizardIndex: any;
  onResultTab: (value: string) => void;
  onState: (name: string, value: any) => void;
  onBounds: (name: string, type: string, value: number) => void;
}

const tabs = [
  { name: 'Network Selection', lbutton: "Run Analysis", rbutton: "Next" },
  { name: 'Analysis Parameters', lbutton: "Back", rbutton: "Next" },
  { name: 'Input Summary', lbutton: "Back", rbutton: "Return" }
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex'
  },
  tabs: {
    backgroundColor: theme.palette.background.main
  },
  divider: {
    backgroundColor: theme.palette.border.main
  },
  tab: {
    '& span': {
      textOrientation: 'mixed',
      writingMode: 'vertical-rl'
    },
    color: theme.palette.text.primary,
    minWidth: 0,
    padding: theme.spacing(1),
    backgroundColor:
      theme.name === THEMES.LIGHT
        ? colors.grey[100]
        : theme.palette.background.paper
  },
  indicator: {
    width: '15px',
    height: '15px',
    marginX: '8px',
    paddingY: '1px',
    fill: theme.palette.border.main,
    color: theme.palette.background.light,
    '&:hover': {
      cursor: 'pointer',
      fill: theme.palette.background.light,
      color: theme.palette.border.main,
    }
  },
  selectedIndicator: {
    width: '15px',
    height: '15px',
    marginX: '8px',
    fill: theme.palette.background.light,
    color: theme.palette.background.light,
    '&:hover': {
      cursor: 'pointer',
      fill: theme.palette.background.light,
      color: theme.palette.border.main
    }
  },
  disabledIndicators: {
    width: '15px',
    height: '15px',
    marginX: '8px',
    paddingY: '1px',
    fill: theme.palette.grey[500],
    color: theme.palette.border.main,
  },
  disabledSelectedIndicators: {
    width: '15px',
    height: '15px',
    marginX: '8px',
    fill: theme.palette.background.light,
    color: theme.palette.border.main,
  },
  selected: {
    backgroundColor:
      theme.name === THEMES.LIGHT
        ? colors.grey[50]
        : theme.palette.background.main
  },
  hide: {
    display: 'none'
  },
  overview: {
    minWidth: '100%'
  },
  button: {
    backgroundColor: `${theme.palette.border.main} !important`,
    color: `#fff !important`,
  },
  disabledButton: {
    backgroundColor: `${theme.palette.border.opposite} !important`,
    color: `#fff !important`,
  },
  buttonCircle: {
    backgroundColor: `${theme.palette.background.light} !important`,
    color: `${theme.palette.text.primary} !important`,
    borderColor: `${theme.palette.border.main} !important`,
    fontSize: '13px',
    borderRadius: '50px'
  },
  selectedButtonCircle: {
    backgroundColor: `${theme.palette.border.main} !important`,
    color: theme.name === THEMES.LIGHT
      ? '#fff'
      : theme.palette.text.primary,
    fontSize: '13px',
    borderRadius: '50px',
    border: "none"
  },
  disabledButtonCircle: {
    backgroundColor: `${theme.palette.background.light} !important`,
    color: `${theme.palette.text.disabled} !important`,
    borderColor: `${theme.palette.text.disabled} !important`,
    fontSize: '13px',
    borderRadius: '50px'
  },
  invertedButton: {
    color: `white`,
    '&:hover': {
      // backgroundColor: `${theme.palette.background.main}`
    },
  },
  disabledInvertedButton: {
    color: `${theme.palette.text.disabled}`,
  },
  icon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit'
  },
  overviewTitle: {
    backgroundColor: theme.palette.border.main,
    borderRadius: '8px 8px 0px 0px',
  },
  overviewContext: {
    border: `2px solid ${theme.palette.border.main}`,
    backgroundColor: theme.palette.background.light,
    height: 'calc(100% - 4rem)',
    overflowY: "auto"
  },
  overviewFooter: {
    backgroundColor: theme.palette.border.main,
    borderRadius: '0px 0px 8px 8px',
    '& > div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }
}));

const AnalysisOverview: FC<AnalysisOverviewProps> = ({
  state,
  bounds,
  resultTab,
  collapsed,
  wizardIndex,
  setWizardIndex,
  onResultTab,
  onState,
  onBounds,
}) => {
  const classes = useStyles();
  const { zoom } = useSelector((state) => state.zoom);

  const [analysisType, setAnalysisType] = useState<string>('no-point');
  const [pointExists, setPointExists] = useState<boolean>(false);
  const [metricType, setMetricType] = useState<string>();
  const [data, setData] = useState<PerformancePanel>(null);
  const [analysisDone, setAnalysisDone] = useState<boolean>(false);
  const [tpd, setTpd] = useState<{ theoryCoverage: number, regressionCoverage: number } | null>(null);
  const [dontChangePanel, setDontChangePanel] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [refreshAnalysis, setRefreshAnalysis] = useState<boolean>(false);
  const [prevWizardId, setPrevWizardId] = useState<number>(wizardIndex);

  useEffect(() => {
    if (state.networkType) {
      if (state.networkType === 'relay') {
        setMetricType('coverage');
      } else {
        setMetricType('coverageMinutes');
      }
    }
  }, [state.networkType])

  useEffect(() => {
    setWizardIndex(0);
    setDontChangePanel(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultTab])

  useEffect(() => {
    if (state.selectedItems.length !== 1) {
      setTpd(null);
    }
  }, [state.selectedItems])

  useEffect(() => {
    const getTPD = (async () => {
      if (data !== null) {
        const calcDist = (alt, incl) => { return Math.sqrt(Math.pow(state.parameters.altitude - alt, 2) + Math.pow(state.parameters.inclination - incl, 2)) };
        let newTheoryPoint;
        if (state.selectedItems.length === 1 && state.networkType === 'dte') {
          newTheoryPoint = await axios.post('/requestCoverageEstimation', {
            altitude: state.parameters.altitude,
            inclination: state.parameters.inclination,
            fieldOfView: 89,
            frequencyBandId: state.selectedItems[0].frequencyBandId,
            groundStationId: state.selectedItems[0].id,
            eccentricity: state.parameters.eccentricity
          })
        }
        let theoryCoverage = null;
        if (newTheoryPoint) {
          theoryCoverage = newTheoryPoint.data.result;
          //This code is supposed to update the theory point on the graph so that the user point has a place to go to, but it doesnt right now
          //This is a known problem, and we should try to solve it in the future.

          let deletedItems = 0;
          data.modelData.orbital.coverageMinutes.points.forEach((point, index, array) => {
            if (point.theoryPoint) {
              array.splice(index, 1);
              deletedItems++;
            }
          });
          if (deletedItems === 0) {
            data.modelData.orbital.coverageMinutes.points.pop();
          }
          data.modelData.orbital.coverageMinutes.points.push({
            altitude: state.parameters.altitude,
            inclination: state.parameters.inclination,
            eccentricity: state.parameters.eccentricity,
            value: newTheoryPoint.data.result * 1440,
            theoryPoint: true
          });
        }
        let regressionCoverage = null;
        let closestPoint = { dist: calcDist(-10000, -10000), value: 0 };
        closestPoint = data?.predictedData.surfaces[metricType]?.reduce((reduceClosest, currentPoint) => {
          let currentDist = calcDist(currentPoint.altitude, currentPoint.inclination);
          if (currentDist < reduceClosest.dist) {
            return { dist: currentDist, value: currentPoint.value }
          } else {
            return reduceClosest;
          }
        }, closestPoint);
        if (closestPoint && closestPoint.dist !== calcDist(-10000, -10000)) {
          regressionCoverage = closestPoint.value / (60 * 24);
        }
        setTpd(theoryCoverage === null ? null : { theoryCoverage, regressionCoverage });
      }
    });
    getTPD();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, state.parameters]);

  useEffect(() => {
    if (state.parameters.eccentricity === 0 && !(state.pointSync)) {
      onState('noRegression', false);
    } else {
      onState('noRegression', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.eccentricity, state.pointSync])

  useEffect(() => {
    if (wizardIndex === 1 && !state.isDataLoaded && prevWizardId === 0) {
      setAnalysisType('no-point');
      setRefreshAnalysis(true);
    }
    if ((resultTab !== 'network' || collapsed) && !dontChangePanel) {
      onResultTab('network');
    }
    if (!dontChangePanel) {
      setDontChangePanel(false);
    }
    setPrevWizardId(wizardIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardIndex])
  const next = ((now, before) => {
    setWizardIndex(now);
  })
  const prev = ((now, before) => {
    setWizardIndex(now);
  })

  useEffect(() => {
    if (data && data.modelData.orbital[metricType]) {
      if (data.modelData.orbital[metricType].points.find((element) =>
        (element.altitude === state.parameters.altitude && element.inclination === state.parameters.inclination && element.eccentricity === state.parameters.eccentricity))
      ) {
        setPointExists(true);
      } else {
        setPointExists(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parameters.altitude, state.parameters.inclination, state.parameters.eccentricity])

  const handleClear = () => {
    // Clear results returned from last API call.
    dispatch(updateResults());

    onState('radioButtonSelectionId', 0);
    onState('selectedItems', []);
    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
    onState('isLastAnalysis', false);
    onState('isDataLoaded', false);
    onState('noRegression', false);
  };

  return resultTab === 'network' && !collapsed ? (
    <Grid container justifyContent="center" style={{ padding: '0.5rem 1rem', height: '100%' }}>
      <Grid container className={classes.overviewTitle}>
        <Grid item md={12} style={{ padding: '4px 1rem' }}>
          <Typography
            variant="h3"
            component="h3"
            style={{
              fontWeight: 'normal',
              color: 'white'
            }}
          >
            {tabs[wizardIndex].name}
          </Typography>
        </Grid>
      </Grid>
      <Grid container className={classes.overviewContext}>
        <Carousel
          autoPlay={false}
          animation="slide"
          className={
            resultTab === 'network' && !collapsed
              ? classes.overview
              : classes.hide
          }
          fullHeightHover={false}
          navButtonsAlwaysInvisible={true}
          swipe={false}
          indicators={false}
          index={wizardIndex}
          next={next}
          prev={prev}
        >
          <Network
            state={state}
            onState={onState}
            onBounds={onBounds}
            visible={true}
            handleClear={handleClear}
          />
          <AnalysisSelection
            onOpen={async () => {
              let response;
              setAnalysisDone(false);
              setData(null);
              try {
                response = await axios.post<PerformancePanel>(
                  '/requestRFCoverage',
                  {
                    configuration: state
                  }
                );
              } catch {
                setAnalysisDone(true);
                setPointExists(false);
                return;
              }
              if (response.status === 200) {
                setData(response.data);
                setAnalysisDone(true);
                if (
                  response.data.modelData.orbital[metricType].points.find(
                    (element) =>
                      element.altitude === state.parameters.altitude &&
                      element.inclination === state.parameters.inclination &&
                      element.eccentricity === state.parameters.eccentricity
                  )
                ) {
                  setPointExists(true);
                } else {
                  setPointExists(false);
                }
              } else {
                setData(null);
                setAnalysisDone(true);
                setPointExists(false);
              }
            }}
            analysisType={analysisType}
            setAnalysisType={setAnalysisType}
            state={state}
            data={data}
            maxAltitude={bounds.altitude.max}
            values={getValue(
              state.parameters.altitude,
              state.parameters.inclination,
              metricType,
              state.regressionTypes[metricType],
              data?.predictedData,
              (data?.systemParams as RelayCharacteristics)?.systemName
            )}
            metricType={metricType}
            containsPoint={pointExists}
            analysisDone={analysisDone}
            onState={onState}
            theoryPointData={tpd}
            wizardIndex={wizardIndex}
            setData={setData}
            setAnalysisDone={setAnalysisDone}
            refresh={refreshAnalysis}
            setRefresh={(val: boolean) => setRefreshAnalysis(val)}
          />
          <SummaryPanel visible={true} state={state} onState={onState} analysisType={analysisType} />
        </Carousel>
      </Grid>
      <Grid container className={classes.overviewFooter}>
        <Grid item md={2}>
          {tabs[wizardIndex].name !== 'Network Selection' ? <IconButton
            onClick={() =>
              prev(wizardIndex !== 0 ? wizardIndex - 1 : 2, wizardIndex)
            }
            className={classes.invertedButton}
            size="small"
          >
            <ArrowBackIosRounded />
          </IconButton>: <></>}
        </Grid>
        <Grid item md={8}>
          <Grid item md={12}>
            <Box display="flex" alignItems={"center"} justifyContent={"center"}>
              <Circle style={{ margin: '5px' }} className={state.selectedItems.length === 0 ? classes.disabledSelectedIndicators : tabs[wizardIndex].name === 'Network Selection' ? classes.selectedIndicator : classes.indicator} onClick={() => state.selectedItems.length !== 0 ? setWizardIndex(0) : null} />
              <Circle style={{ margin: '5px' }} className={state.selectedItems.length === 0 ? classes.disabledIndicators : tabs[wizardIndex].name === 'Analysis Parameters' ? classes.selectedIndicator : classes.indicator} onClick={() => state.selectedItems.length !== 0 ? setWizardIndex(1) : null} />
              <Circle style={{ margin: '5px' }} className={state.selectedItems.length === 0 ? classes.disabledIndicators : tabs[wizardIndex].name === 'Input Summary' ? classes.selectedIndicator : classes.indicator} onClick={() => state.selectedItems.length !== 0 ? setWizardIndex(2) : null} />
            </Box>
          </Grid>
        </Grid>
        <Grid item md={2}>
          {tabs[wizardIndex].name !== 'Input Summary' ? (
            state.selectedItems.length !== 0 && <IconButton
              onClick={() =>
                next(wizardIndex !== 2 ? wizardIndex + 1 : 0, wizardIndex)
              }
              className={classes.invertedButton}
              // disabled={state.selectedItems.length === 0}
              size="small"
            >
              <ArrowForwardIosRounded />
            </IconButton>
          ) : (<></>
          )}
        </Grid>
      </Grid>
    </Grid>
  ): null;
};

export default AnalysisOverview;
