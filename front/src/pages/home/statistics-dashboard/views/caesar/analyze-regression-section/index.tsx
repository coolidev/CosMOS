/* eslint-disable no-sequences */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect, useRef } from 'react';
import { useSnackbar } from 'notistack';
import {
  makeStyles,
  Grid,
  Typography,
  Card,
  CardContent,
  Slide,
  Dialog,
  DialogContent,
  CssBaseline,
  DialogTitle as MuiDialogTitle,
  IconButton,
  useTheme
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { grey } from "@material-ui/core/colors";
import { Close as CloseIcon } from '@material-ui/icons';
import Heatmap from 'src/pages/regression/Terrestrial/HeatMap';
import LinePlot from 'src/pages/regression/LinePlot';
import SurfacePlot from 'src/pages/regression/SurfacePlot';
import MultiCharts from './MultiCharts';
import Header from './Header';
import OptionAddon from '../../../components/Button/OptionAddon';
import { getItems } from '../../../API';
import type { 
  ModelData,
  PredictedData,
  TerrestrialData
} from 'src/types/evaluation';
import { 
  Params,
  SystemsAndVersions,
  AnalyticsPlotsData
} from 'src/types/dashboard';
import type { Theme } from 'src/theme';

const useStyles = makeStyles((theme) => ({
  cartCardContent: {
    paddingRight: 0,
    paddingLeft: 0,
    overflowX: "hidden",
    height: "85vh",
    backgroundColor: grey[50]
  },
  dialogCloseBtn: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    zIndex: 100,
  }
}));

const showEngineerPanel = true;

const INIT_CHECK_STATUS = {
  show_surface: true,
  show_scatter: true
};

const viewStyle = {
  paddingLeft: '2rem',
  paddingRight: '0.8rem'
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface PlotSectionProps {
  params: Params;
  regressionTypeOptions: { [key: string]: { [key: string]: string } };
  regressionTypes: { [key: string]: string };
  onRegressionType: (regressionType: string) => void;
  regressionQuality: { [key: string]: string };
  onRegressionQuality: (regressionQuality: string) => void;
  data: {
    modelData: ModelData;
    predictedData: PredictedData;
  };
  terrestrial: TerrestrialData;
  zAxisLabel: string;
  systemsAndVersions: SystemsAndVersions;
  incs: number[];
  onRefresh: () => void;
  onUpdateSystems: () => void;
  onChange: (name: string, value) => void;
  saveDefaults: () => void;
};

const PlotSection: FC<PlotSectionProps> = ({
  params,
  regressionTypeOptions,
  regressionTypes,
  onRegressionType,
  regressionQuality,
  onRegressionQuality,
  systemsAndVersions,
  data,
  terrestrial,
  zAxisLabel,
  incs,
  onRefresh,
  onUpdateSystems,
  onChange,
  saveDefaults
}) => {
  const theme = useTheme<Theme>();
  const [viewMethod, setViewMethod] = useState('2d_view');
  const [checked, setChecked] = useState(INIT_CHECK_STATUS);
  const [traces, setTraces] = useState<{ [key: string]: AnalyticsPlotsData }>({});
  const [reset, setReset] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isChart, setIsChart] = useState(false);
  const [snackbars, setSnackbars] = useState([]);
  const [isEarth, setIsEarth] = useState(true);
  const [mode, setMode] = useState('interpolated');
  const classes = useStyles();
  const chartEl = useRef<any>(null);
  const { closeSnackbar } = useSnackbar();
  
  useEffect(() => {
    snackbars.forEach((snackbar: number | string) => {
      closeSnackbar(snackbar);
    });
    setSnackbars([]);

    if (
      params.metricType !== 'coverage' && 
      params.metricType !== 'coverageMinutes' && 
      params.metricType !== 'gap'
    ) return;

    if (params.fileId.length > 0 && params.system >= 0) {
      getItems({
        networkType: params.networkType,
        type: params.missionType,
        dataType: params.metricType,
        frequencyBand: params.frequencyBand,
        fileId: params.fileId,
        system_id: params.system,
        version: params.version,
        system_attribute_version_id: params.version,
        model_id: 1,
        user_altitude: params.altitude,
        user_inclination: params.inclination,
        user_latitude: params.latitude,
        user_longitude: params.longitude
      })
        .then((res) => {
          Object.keys(res.data).forEach((el: string) => {
            let ctype: string = res.data[el]['type'];
            let gaps: number[] = []; // better name(?): events 
            let durations: number[] = [];
            let avgs: number[] = [];

            // Detect chart type and set Traces
            if (ctype === 'line') {
              res.data[el]['data'].forEach((item: number[], idx: number) => {
                gaps.push(idx + 1);
                durations.push(item[0]);
                avgs.push(item[1]);
              });

              setTraces((prevState: any) => ({
                ...prevState,
                [el]: {
                  xTraces: gaps, // events 
                  yTraces: durations,
                  avgTraces: avgs,
                  type: ctype,
                  title: res.data[el]['title']
                }
              }));
            } else if (ctype === 'histogram') {
              setTraces((prevState: any) => ({
                ...prevState,
                [el]: {
                  xTraces: res.data[el]['data'],
                  type: ctype,
                  title: res.data[el]['title']
                }
              }));
            }
          });
        })
        .catch(() => {
          setTraces({});
        });
    }
  }, [params.fileId, params.metricType]);

  useEffect(() => {
    if (chartEl) {
      let size = window.getComputedStyle(chartEl.current);
      setSize({ width: parseFloat(size.width) * 0.35, height: parseFloat(size.height) * 0.35 });
    }
  }, [chartEl, traces]);

  const handleCheck = (event: any) => {
    const { name, checked } = event.currentTarget;
    setChecked((prevState) => ({ ...prevState, [name]: checked }));
  };

  // Handles switching between different metric types. 
  const handleMetricType = (event: any) => {
    event.preventDefault();
    const { value } = event.target;
    
    onChange('metricType', value);
  };

  // Set new altitude and inclination (or latitude and longitude) when 
  // the user clicks a point on the plot. 
  const handleClick = (event: any) => {
    if (event) {
      if (params.missionType === 'orbital') {
        onChange('altitude', event.points[0].x);
        onChange('value', event.points[0].y);
      } else if (params.missionType === 'terrestrial') {
        onChange('longitude', event.points[0].x);
        onChange('latitude', event.points[0].y);
      }
    }
  };

  const handleViewChange = (event) => {
    const { name } = event.currentTarget;
    setMode(name);
  }

  const resetPlot = () => {
    setReset(!reset);
  }

  const toggleEarthView = () => {
    setIsEarth(!isEarth);
  }

  return (
    <>
      <CardContent
        ref={chartEl}
        className={classes.cartCardContent}
        style={{ overflow: 'hidden' }}
      >
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          {showEngineerPanel ? 
          <Header
            params={params}
            data={data}
            systemsAndVersions={systemsAndVersions}
            onRefresh={() => onRefresh()}
            onUpdateSystems={onUpdateSystems}
            onClick={handleMetricType}
            onNewSnackbar={(snackbar: any) => setSnackbars([...snackbars, snackbar])}
            onChange={onChange}
          /> : null}
          {!data ?
          <Grid item md={6} style={viewStyle}>
            <Card style={{ height: `calc(${size.height} * 0.45)` }}>
              <CardContent> 
              <Grid container justifyContent="center" align-items="center" spacing={2} >
              <Typography
                      style={{
                        fontSize: 15,
                        fontWeight: 'normal'
                      }}
                    >
                    <br></br><br></br><br></br><br></br>
                    The version you have selected does not contain any data.
                </Typography>
                <Typography
                  style={{
                    fontSize: 15,
                    fontWeight: 'normal'
                  }}
                >
                Please make another selection using the options above to continue.
                </Typography>
              </Grid>
              </CardContent>
              </Card>
          </Grid>
          : <Grid item md={6} style={viewStyle}>
            <Card style={{ height: `calc(${size.height} * 0.45)` }}>
              <CardContent>
                <Grid container justifyContent="center" spacing={2}>
                  <Grid
                    item
                    md={12}
                    style={{ textAlign: 'center', position: 'relative' }}
                  >
                    <Typography
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold'
                      }}
                    >
                      {params.metricType === 'coverage'
                        ? `RF Coverage (${params.networkType === 'dte'?'minutes/day':'%'})`
                        : `No Coverage (${params.networkType === 'dte'?'minutes/day':'%'})`}
                      {params.missionType === 'orbital' ? ` vs. User Altitude (km)` : ''}
                    </Typography>
                    <OptionAddon
                      params={params}
                      regressionTypeOptions={regressionTypeOptions[params.metricType]}
                      regressionType={regressionTypes[params.metricType] ?? 'none'}
                      onRegressionType={onRegressionType}
                      regressionQuality={regressionQuality[params.metricType] ?? '0'}
                      onRegressionQuality={onRegressionQuality}
                      isEarth={isEarth}
                      toggleEarthView={toggleEarthView}
                      mode={mode}
                      onViewChange={handleViewChange}
                      onReset={resetPlot}
                      source={data.modelData.orbital[params.metricType].points}
                      checked={checked}
                      viewMethod={viewMethod}
                      incs={incs}
                      isDash={true}
                      onChecked={handleCheck}
                      onChart={() => setIsChart(true)}
                      resetPlot={() => setReset(!reset)}
                      onInc={(value: any) => onChange('inclination', value)}
                      onViewMethod={(e: any) => setViewMethod(e.currentTarget.name)}
                      saveDefaults={saveDefaults}
                    />
                  </Grid>
                  {viewMethod === '3d_view' ? (
                    <Grid item md={12}>
                      <SurfacePlot
                        // @ts-ignore
                        state={[{
                          parameters: {
                            altitude: params.altitude,
                            inclination: params.inclination,
                            latitude: 0,
                            longitude: 0,
                            isOrbital: true,
                            orbitState: 0,
                            raan: params.raan,
                            eccentricity: params.eccentricity,
                            argumentOfPerigee: params.argumentOfPerigee,
                            trueAnomaly: params.trueAnomaly,
                            gain: 0,
                            transmitterPower: 0,
                            eirp: 0,
                            ltan: '12:00',
                            sunSyncUseAlt: true
                          }
                        }]}
                        systemName={params.systemName}
                        // @ts-ignore
                        data={[data]}
                        //metricData={data.modelData.orbital[params.metricType].points}
                        //predictedData={data.predictedData}
                        minAltitude={0}
                        maxInclination={90}
                        metricType={params.metricType}
                        regressionTypes={[regressionTypes[params.metricType] ?? 'gam']}
                        values={['coverage', 'coverageMinutes', 'gap'].includes(params.metricType) ? [params.value] : [NaN]}
                        isLegend={false}
                        isSub={true}
                        zAxisLabel={zAxisLabel}
                        plotOptions={checked}
                        size={size}
                        chartDiv={''}
                        reset={reset}
                      />
                    </Grid>
                  ) : (
                    <Grid item md={12}>
                      {params.missionType === 'orbital' ? <LinePlot
                        // @ts-ignore
                        state={[{
                          parameters: {
                            altitude: params.altitude,
                            inclination: params.inclination,
                            latitude: 0,
                            longitude: 0,
                            isOrbital: true,
                            orbitState: 0,
                            raan: params.raan,
                            eccentricity: params.eccentricity,
                            argumentOfPerigee: params.argumentOfPerigee,
                            trueAnomaly: params.trueAnomaly,
                            gain: 0,
                            transmitterPower: 0,
                            eirp: 0,
                            ltan: '12:00',
                            sunSyncUseAlt: true
                          }
                        }]}
                        systemName={params.systemName}
                        // @ts-ignore
                        data={[data]}
                        minAltitude={0}
                        metricType={params.metricType}
                        regressionTypes={[regressionTypes[params.metricType] ?? 'gam']}
                        values={['coverage', 'coverageMinutes', 'gap'].includes(params.metricType) ? [params.value] : [NaN]}
                        isLegend={false}
                        isSub={false}
                        yAxisLabel={zAxisLabel}
                        size={size}
                        plotOptions={checked}
                        onClick={handleClick}
                        chartDiv={''}
                        isClickable={true}
                      /> : null}
                      {params.missionType === 'terrestrial' && terrestrial !== null && Object.keys(terrestrial).length > 0 ? <Heatmap 
                        metricType={params.metricType}
                        isSubSection={false}
                        isEarth={isEarth}
                        mode={mode}
                        size={{
                          width: 0,
                          height: 0
                        }}
                        source={terrestrial}
                        onClick={handleClick}
                        isClickable={true}
                      /> : null}
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>}
          
          {params.fileId.length === 0 && <Grid item md={6} />}

          {Object.keys(traces).length > 0 && 
            ['coverage', 'coverageMinutes', 'gap'].includes(params.metricType) && (
              <MultiCharts
                traces={traces}
                metricType={params.metricType}
                size={size}
                networkType={params.networkType}
              />
            )
          }
        </Grid>
      </CardContent>
      {isChart && (
        <Dialog
          open={isChart}
          TransitionComponent={Transition}
          onClose={() => setIsChart(true)}
          PaperProps={{
            style: {
              height: size.height * 0.42,
              maxWidth: size.width * 0.6,
              minWidth: size.width * 0.6
            }
          }}
        >
          <CssBaseline />
          <MuiDialogTitle
            style={{
              margin: 0,
              padding: '16px',
              backgroundColor: theme.palette.primary.light
            }}
          >
            <Typography component="strong" variant="h6">
              {params.metricType === 'coverage'
                ? `RF Coverage (%)`
                : `No Coverage (%)`}
              {params.missionType === 'orbital' ? ` vs. User Altitude (km)` : ''}
            </Typography>
            <IconButton
              aria-label="Close"
              className={classes.dialogCloseBtn}
              onClick={() => setIsChart(false)}
            >
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>
          <hr />
          <DialogContent>
            {params.missionType === 'orbital' ? viewMethod === '3d_view' ? (
              <Grid item md={12}>
                <SurfacePlot
                  // @ts-ignore
                  state={[{
                    parameters: {
                      altitude: params.altitude,
                      inclination: params.inclination,
                      latitude: 0,
                      longitude: 0,
                      isOrbital: true,
                      orbitState: 0,
                      raan: params.raan,
                      eccentricity: params.eccentricity,
                      argumentOfPerigee: params.argumentOfPerigee,
                      trueAnomaly: params.trueAnomaly,
                      gain: 0,
                      transmitterPower: 0,
                      eirp: 0,
                      ltan: '12:00',
                      sunSyncUseAlt: true
                    }
                  }]}
                  // @ts-ignore
                  data={[data]}
                  minAltitude={0}
                  maxInclination={90}
                  metricType={params.metricType}
                  regressionTypes={[regressionTypes[params.metricType] ?? 'gam']}
                  values={['coverage', 'coverageMinutes', 'gap'].includes(params.metricType) ? [params.value] : [NaN]}
                  isLegend={false}
                  isSub={true}
                  size={size}
                  zAxisLabel={zAxisLabel}
                  plotOptions={checked}
                  chartDiv={''}
                  reset={reset}
                />
              </Grid>
            ) : (
              <Grid item md={12}>
                <LinePlot
                  // @ts-ignore
                  state={[{
                    parameters: {
                      altitude: params.altitude,
                      inclination: params.inclination,
                      latitude: 0,
                      longitude: 0,
                      isOrbital: true,
                      orbitState: 0,
                      raan: params.raan,
                      eccentricity: params.eccentricity,
                      argumentOfPerigee: params.argumentOfPerigee,
                      trueAnomaly: params.trueAnomaly,
                      gain: 0,
                      transmitterPower: 0,
                      eirp: 0,
                      ltan: '12:00',
                      sunSyncUseAlt: true
                    }
                  }]}
                  systemName={params.systemName}
                  // @ts-ignore
                  data={[data]}
                  //metricData={data.modelData.orbital[params.metricType].points}
                  //predictedData={data.predictedData}
                  minAltitude={0}
                  metricType={params.metricType}
                  regressionTypes={[regressionTypes[params.metricType] ?? 'gam']}
                  values={['coverage', 'coverageMinutes', 'gap'].includes(params.metricType) ? [params.value] : [NaN]}
                  isLegend={false}
                  isSub={true}
                  size={size}
                  yAxisLabel={zAxisLabel}
                  plotOptions={checked}
                  onClick={handleClick}
                  chartDiv={''}
                  isClickable={true}
                />
              </Grid>
            ) : 
              <Heatmap 
                metricType={params.metricType}
                isSubSection={true}
                isEarth={isEarth}
                mode={mode}
                size={{
                  width: 0,
                  height: 0
                }}
                source={terrestrial}
                onClick={handleClick}
                isClickable={true}
              />
            }
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PlotSection;