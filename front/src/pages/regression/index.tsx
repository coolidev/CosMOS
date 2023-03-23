import { FC, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Tooltip,
  Typography
} from '@material-ui/core';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import type {
  PerformancePanel
} from 'src/types/evaluation';
import { QUALITY_INDICATORS } from 'src/utils/constants/regressions';
import type { State } from 'src/pages/home';
import SubChartPanel from './PlotDialog';
import TwoViewSection from './LinePlot';
import ThreeViewSection from './SurfacePlot';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { HelpCircle } from 'react-feather';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'src/store';
import Heatmap from './Heatmap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface RegressionProps {
  state: State[];
  data: PerformancePanel[];
  metricType: string;
  system: number;
  version: number;
  networkType: string;
  minAltitude: number;
  maxAltitude?: any;
  maxInclination: number;
  values: number[];
  chartDiv?: string;
  isClickable: boolean;
  showRegression: boolean;
  onState: (name: string, value) => void;
}

const initialPlotOptions = {
  show_surface: true,
  show_scatter: true
};

const useStyles = makeStyles((theme: Theme) => ({
  low: {
    color: '#FF0000',
    textAlign: 'right'
  },
  medium: {
    color: '#E5A001',
    textAlign: 'right'
  },
  high: {
    color: '#00A500',
    textAlign: 'right'
  },
  none: {
    color: '#808080',
    textAlign: 'right'
  }
}));

const Regression: FC<RegressionProps> = ({
  state,
  data,
  metricType,
  system,
  version,
  networkType,
  minAltitude,
  maxAltitude,
  maxInclination,
  values,
  chartDiv,
  isClickable,
  showRegression,
  onState
}) => {
  const [plotOptions, setPlotOptions] = useState(initialPlotOptions);
  const [subOpen, setSubOpen] = useState(false);
  const [reset, setReset] = useState(false);
  const [viewMethod, setViewMethod] = useState(state.length === 1 && state[0].noRegression ? '4d_view' : '2d_view');
  const history = useHistory();
  const zAxisLabel = data[0].modelData.orbital[metricType].label;
  const { zoom } = useSelector((state) => state.zoom);

  useEffect(() => {
    setPlotOptions((prevState) => ({
      ...prevState,
      show_surface: showRegression
    }))
  }, [showRegression]);

  const handleSubChartSubmit = (e) => setSubOpen(!subOpen);

  const handleSubChartOpen = () => setSubOpen(!subOpen);

  const handleViewChange = (event) => setViewMethod(event.currentTarget.name);

  const resetPlot = () => setReset(!reset);

  const handleCheck = (e) => {
    const { name, checked } = e.currentTarget;
    setPlotOptions((prevState) => ({ ...prevState, [name]: checked }));
  };

  const classes = useStyles();

  const handleClick = (event: any) => {
    if (
      event &&
      (metricType === 'coverage' || metricType === 'coverageMinutes') &&
      state.length === 1
    ) {
      const params = {
        missionType: 'orbital',
        altitude: event.points[0].x,
        inclination: state[0].parameters.inclination,
        longitude: 30,
        latitude: 30,
        system: system,
        version: version,
        networkType: networkType,
        value: event.points[0].y,
        metric: metricType,
        isPlot: true
      };
      history.push({
        pathname: '/statistics-dashboard',
        state: { from: 'plot', params: params }
      });
    }
  };

  let qualityClass = classes.none;
  let qualityState = state.length === 1 ? QUALITY_INDICATORS[state[0].qualityIndicators[metricType]] : '';
  switch (qualityState) {
    case 'Low':
      qualityClass = classes.low;
      break;
    case 'Medium':
      qualityClass = classes.medium;
      break;
    case 'High':
      qualityClass = classes.high;
      break;
  }

  return (
    <Grid container justifyContent="center" alignItems="center" className="mb-4">
      <Grid item md={9} />
      {state.length === 1 && <Grid item md={1}>
        <Typography component="p">
          <Tooltip id='quality' title={`Regression Quality: ${QUALITY_INDICATORS[state[0].qualityIndicators[metricType]]}`}>
            <div className={qualityClass}>{(qualityState === 'High') ? <CheckCircleIcon className={qualityClass} /> : (qualityState === 'Medium' ? <FontAwesomeIcon icon={faMinusCircle as IconProp} className={qualityClass} size={'lg'} /> : (qualityState === 'Low' ? <CancelIcon className={qualityClass} /> : <HelpCircle className={qualityClass} />))}</div>
          </Tooltip>
        </Typography>
      </Grid>}
      <Grid item md={1}>
        <IconButton
          id={data[0].modelData.orbital[metricType].type}
          onClick={(e) => handleSubChartSubmit(e)}
          aria-label="settings"
        >
          <ExitToAppRoundedIcon color='primary' />
        </IconButton>
      </Grid>
      <Grid item md={1} />
      {viewMethod === '4d_view' && (
        <Heatmap
          state={state}
          data={data}
          minAltitude={minAltitude}
          maxInclination={maxInclination}
          metricType={metricType}
          values={values}
          isLegend={false}
          isSub={false}
          size={{
            width: (window.screen.availHeight / zoom) * 0.3,
            height: (window.screen.availHeight / zoom) * 0.25
          }}
          plotOptions={plotOptions}
          chartDiv={chartDiv}
          reset={false}
          title={zAxisLabel}
        />
      )}
      {viewMethod === '3d_view' && (
        <ThreeViewSection
          state={state}
          data={data}
          metricType={metricType}
          regressionTypes={state.map(s => s.regressionTypes[metricType])}
          minAltitude={minAltitude}
          maxAltitude={maxAltitude}
          maxInclination={maxInclination}
          values={values}
          reset={reset}
          isLegend={false}
          isSub={false}
          zAxisLabel={zAxisLabel}
          plotOptions={plotOptions}
          chartDiv={chartDiv}
          size={{
            width: (window.screen.availHeight / zoom) * 0.3,
            height: (window.screen.availHeight / zoom) * 0.25
          }}
        />
      )}
      {viewMethod === '2d_view' && (
        <TwoViewSection
          state={state}
          data={data}
          regressionTypes={state.map(s => s.regressionTypes[metricType])}
          minAltitude={minAltitude}
          maxAltitude={maxAltitude}
          metricType={metricType}
          values={values}
          isLegend={false}
          isSub={false}
          size={{
            width: (window.screen.availHeight / zoom) * 0.3,
            height: (window.screen.availHeight / zoom) * 0.25
          }}
          yAxisLabel={zAxisLabel}
          plotOptions={plotOptions}
          onClick={handleClick}
          chartDiv={chartDiv}
          isClickable={isClickable}
        />
      )}
      <SubChartPanel
        state={state}
        data={data}
        metricType={metricType}
        minAltitude={minAltitude}
        maxAltitude={maxAltitude}
        maxInclination={maxInclination}
        reset={reset}
        onReset={resetPlot}
        values={values}
        open={subOpen}
        size={{
          width: (window.screen.availHeight / zoom) * 0.3,
          height: (window.screen.availHeight / zoom) * 0.25
        }}
        zAxisLabel={zAxisLabel}
        viewMethod={viewMethod}
        onChartClose={handleSubChartOpen}
        onViewChange={handleViewChange}
        plotOptions={plotOptions}
        label={data[0].modelData.orbital[metricType].label}
        onCheck={handleCheck}
        onClick={handleClick}
        isClickable={isClickable}
        chartDiv={chartDiv}
        showRegressionDisabled={!showRegression}
        onState={onState}
      />
    </Grid>
  );
};

export default Regression;
