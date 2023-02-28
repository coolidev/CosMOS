/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Grid, useTheme } from '@material-ui/core';
import { getValue } from 'src/algorithms/regressions';
import type { PerformancePanel, Metric } from 'src/types/evaluation';
import type { State } from 'src/pages/home';
import {
  SCATTER_COLORS,
  LINE_COLORS
} from 'src/utils/constants/general';
import { REGRESSION_TYPES } from 'src/utils/constants/regressions';
import type { Theme } from 'src/theme';

interface LinePlotProps {
  state: State[];
  data: PerformancePanel[];
  metricData?: Metric[];
  minAltitude: number;
  maxAltitude?: number;
  metricType: string;
  regressionTypes: string[];
  values: number[];
  isLegend: boolean;
  isSub: boolean;
  size: { width: number; height: number };
  yAxisLabel: string;
  plotOptions: { show_surface: boolean; show_scatter: boolean };
  onClick: (event: any) => void;
  chartDiv: string;
  isClickable: boolean;
}

const LinePlot: FC<LinePlotProps> = ({
  state,
  data,
  metricData,
  metricType,
  regressionTypes,
  minAltitude,
  maxAltitude,
  plotOptions,
  values,
  isSub,
  chartDiv,
  size,
  yAxisLabel,
  isClickable,
  onClick
}) => {
  const theme = useTheme<Theme>();
  const [config, setConfig] = useState([]);

  const unpack = (rows, key) => {
    return rows.map(function (row) {
      return row[key];
    });
  };

  useEffect(() => {
    let configData = [];
    let configSurfaces = [];
    let configModelPoints = [];

    data.forEach((dataset, dataIndex) => {
      if (!dataset) return;

      const inclination = state[dataIndex].parameters.inclination;
      let newModelPoints;
      try{
        newModelPoints = metricData ? 
        metricData.filter(row => row.inclination === inclination)
        : dataset.modelData.orbital[metricType].points.filter(
          row => row.inclination === inclination
        );
      } catch {

      }
      
      const configSystemName = Object.keys(dataset).includes('systemParams')
        ? dataset.systemParams.systemName : '';
      const modelDataLabel = data.length <= 1
        ? 'Model Data' : `${configSystemName} Model Data`;

      configModelPoints.push({
        x: unpack(newModelPoints, 'altitude'),
        y: unpack(newModelPoints, 'value'),
        name: modelDataLabel,
        mode: 'markers',
        type: 'scatter',
        line: {
          color: SCATTER_COLORS[dataIndex % SCATTER_COLORS.length]
        }
      });
  
      let surfaces: Metric[][] = [];
      if (dataset.predictedData) {
        let datasetRegressionTypes = [];
        if (state.length > 1) {
          datasetRegressionTypes.push(regressionTypes[dataIndex]);
        } else {
          datasetRegressionTypes = regressionTypes;
        }

        datasetRegressionTypes.forEach((regressionType) => {
          let newSurface: Metric[] = [];
  
          const numSteps = 50;
          const minPlotAltitude = Math.min(minAltitude, state[dataIndex].parameters.altitude);
          const maxPlotAltitude = newModelPoints.length > 0 ? Math.max(
              ...newModelPoints.map((point) => point.altitude)
            ) : maxAltitude;
          for (let i = 0; i < numSteps; i++) {
            const altitude =
              ((maxPlotAltitude - minPlotAltitude) / numSteps) * i +
              minPlotAltitude;
            const value = getValue(
              altitude,
              inclination,
              metricType,
              regressionType,
              dataset.predictedData,
              // @ts-ignore
              configSystemName
            );
            if (value !== null && value >= 0) {
              newSurface.push({
                altitude: altitude,
                value: value
              });
            }
          }
  
          surfaces.push(newSurface);
        });
      }
    
      const REGRESSION_TYPE_COLORS = ['rgb(252, 154, 7)', 'rgb(50, 154, 7)'];

      configSurfaces = configSurfaces.concat(surfaces.map((surface, index) => {
        const lineColor = data.length <= 1 
          ? REGRESSION_TYPE_COLORS[index % REGRESSION_TYPE_COLORS.length]
          : LINE_COLORS[dataIndex % LINE_COLORS.length];
        const traceLabel = data.length <= 1
          ? `${REGRESSION_TYPES[regressionTypes[index]]}`
          : `${configSystemName} - ${REGRESSION_TYPES[regressionTypes[index]]}`;

        return {
          x: unpack(surface, 'altitude'),
          y: unpack(surface, 'value'),
          name: traceLabel,
          mode: 'lines',
          line: {
            color: lineColor
          }
        };
      }));
      let actualYValue
        actualYValue = metricData ? 
        metricData.filter(row => row.inclination === inclination && row.altitude === state[dataIndex].parameters.altitude)
        : dataset.modelData.orbital[metricType]?.points.filter(
          row => row.inclination === inclination && row.altitude === state[dataIndex].parameters.altitude
        );
        
      configData.push({
        x: [state[dataIndex].parameters.altitude],
        y: [actualYValue[0] && (state[dataIndex].pointSync || state[dataIndex].parametric || state[dataIndex].mathematical)? actualYValue[0].value: values[dataIndex] ],
        name: 'User',
        mode: 'markers',
        type: 'scatter',
        marker: {
          color: [actualYValue[0] && (state[dataIndex].pointSync || state[dataIndex].parametric)? 'green': 'red'],
          size: 10
        }
      });
    });

    if (
      plotOptions.show_surface === true &&
      plotOptions.show_scatter === true
    ) {
      configData = configData.concat(configModelPoints);
      configData = configData.concat(configSurfaces);
    } else if (
      plotOptions.show_surface === false &&
      plotOptions.show_scatter === true
    ) {
      configData = configData.concat(configModelPoints);
    } else if (
      plotOptions.show_surface === true &&
      plotOptions.show_scatter === false
    ) {
      configData = configData.concat(configSurfaces);
    } else if (
      plotOptions.show_surface === false &&
      plotOptions.show_scatter === false
    ) {
      configData = configData.concat([
        {
          x: [],
          y: [],
          mode: 'lines'
        },
        {
          x: [],
          y: [],
          mode: 'markers',
          type: 'scatter'
        }
      ]);
    }

    setConfig(configData);
  }, [
    plotOptions,
    data,
    state,
    values,
    regressionTypes
  ]);

  return (
    <Grid item md={isSub ? 12 : 10}>
      <Plot
        divId={chartDiv}
        data={config}
        layout={{
          paper_bgcolor: theme.palette.component.main,
          plot_bgcolor: theme.palette.component.main,
          autosize: true,
          showlegend: false,
          width: isSub ? 500 : size.width,
          height: isSub ? 400 : size.height,
          margin: {
            l: 60,
            r: 15,
            b: 35,
            t: 15
          },
          xaxis: {
            title: state.length === 1 ? `Altitude (km), Inclination=${state[0].parameters.inclination} deg` : 'Altitude (km)',
            type: 'linear',
            zeroline: false,
            color: theme.palette.component.opposite
          },
          yaxis: {
            title: yAxisLabel,
            type: 'linear',
            zeroline: false,
            color: theme.palette.component.opposite
          },
          title: false as any
        }}
        onClick={isClickable ? (e) => onClick(e) : null}
      />
    </Grid>
  );
};

export default LinePlot;
