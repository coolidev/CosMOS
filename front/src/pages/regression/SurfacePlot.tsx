/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Grid } from '@material-ui/core';
import { getValue } from 'src/algorithms/regressions';
import type { 
  Metric,
  PerformancePanel
} from 'src/types/evaluation';
import type { State } from 'src/pages/home';
import {
  SCATTER_COLORS,
  LINE_COLORS,
  THEORY_AVG_COLOR
} from 'src/utils/constants/general';

interface SurfacePlotProps {
  state: State[];
  data: PerformancePanel[];
  minAltitude: number;
  maxAltitude?: number;
  maxInclination: number;
  metricType: string;
  regressionTypes: string[];
  values: number[];
  isLegend: boolean;
  isSub: boolean;
  size: { width: number, height: number };
  zAxisLabel: string;
  plotOptions: { show_surface: boolean; show_scatter: boolean };
  chartDiv: string;
  reset: boolean;
  forceSize? : boolean
};

const SurfacePlot: FC<SurfacePlotProps> = ({
  state,
  data,
  metricType,
  regressionTypes,
  minAltitude,
  maxInclination,
  plotOptions,
  values,
  isSub,
  chartDiv,
  size,
  zAxisLabel,
  reset,
  forceSize
}) => {
  const [config, setConfig] = useState([]);
  const [axesRanges, setAxesRanges] = useState({
    x: [0, 0],
    y: [0, 0],
    z: [0, 0]
  });

  const unpack = (rows, key) => {
    return rows.map(function (row) {
      return row[key];
    });
  };

  useEffect(() => {
    let configData: any = [];
    let configSurfaces = [];
    let configModelPoints = [];
    const maxAltitudes = [];
    const minValues = [];
    const maxValues = [];

    data.forEach((dataset, dataIndex) => {
      if (!dataset) return;

      const configSystemName = Object.keys(dataset).includes('systemParams')
        ? dataset.systemParams.systemName : '';
      const modelDataLabel = data.length <= 1
        ? 'Model Data' : `${configSystemName} Model Data`;
      const modelData = dataset.modelData.orbital[metricType]?.points;
      configModelPoints.push({
        x: unpack(modelData, 'altitude'),
        y: unpack(modelData, 'inclination'),
        z: unpack(modelData, 'value'),
        name: modelDataLabel,
        mode: 'markers',
        type: 'scatter3d',
        opacity: 1,
        marker: {
          color: SCATTER_COLORS[dataIndex % SCATTER_COLORS.length],
          size: 2
        }
      });

      // If the regression type for this metric is GLM, generate 
      // the surface. Otherwise, use the surface returned from 
      // the server.
      if(!state[dataIndex].noRegression){ 
        let newSurface: Metric[];
        if (!dataset.predictedData) {
          newSurface = [];
        } else if (regressionTypes[dataIndex] === 'glm') {
          const numSteps = 50;
          const minPlotAltitude = Math.min(minAltitude, state[dataIndex].parameters.altitude);
          const maxPlotAltitude = Math.max(...modelData.map(point => point.altitude));
          newSurface = [];
          for (let i = 0; i < numSteps; i++) {
            const altitude = (maxPlotAltitude - minPlotAltitude) / numSteps * i + minPlotAltitude;

            for (let j = 0; j < numSteps; j++) {
              const inclination =  maxInclination / numSteps * j;
              const value = getValue(
                altitude,
                inclination,
                metricType,
                regressionTypes[dataIndex],
                dataset.predictedData,
                // @ts-ignore
                configSystemName
              );
              if (value !== null && value >= 0) {
                newSurface.push({
                  altitude: altitude,
                  inclination: inclination,
                  value: value
                });
              }
            }
          }
        } else {
          newSurface = dataset.predictedData.surfaces[metricType];
        }
        if(newSurface){
          maxAltitudes.push(Math.max(...unpack(newSurface, 'altitude')));
          minValues.push(Math.min(...unpack(newSurface, 'value'), ...unpack(modelData, 'value')));
          maxValues.push(Math.max(...unpack(newSurface, 'value'), ...unpack(modelData, 'value')));
          const traceLabel = `${configSystemName} Model Surface`;
  
          configSurfaces.push({
            x: unpack(newSurface, 'altitude'),
            y: unpack(newSurface, 'inclination'),
            z: unpack(newSurface, 'value'),
            name: traceLabel,
            opacity: 0.3,
            type: 'mesh3d',
            color: LINE_COLORS[dataIndex % LINE_COLORS.length]
          });
        }
      }

      if(state[dataIndex].networkType === 'dte'){
        if(dataset?.modelData?.orbital?.[metricType]?.points){
          let z = [...dataset?.modelData?.orbital?.[metricType]?.points]
          z.reverse();
          let zpoint = z.find(e => e.altitude === state[dataIndex].parameters.altitude && e.inclination === state[dataIndex].parameters.inclination)?.value;
          configData.push({
            x: [state[dataIndex].parameters.altitude],
            y: [state[dataIndex].parameters.inclination],
            z: [zpoint],
            name: 'User',
            mode: 'markers',
            type: 'scatter3d',
            opacity: 1,
            marker: {
              color: THEORY_AVG_COLOR,
              size: 6
            }
            });
        } 
      }
    });
    
    
    setAxesRanges({
      x: [Math.max(...maxAltitudes), minAltitude],
      y: [maxInclination, 0],
      z: [Math.min(...minValues), Math.max(...maxValues)]
    });

    if (plotOptions.show_surface === true && plotOptions.show_scatter === true) {
      configData = configData.concat(configModelPoints);
      configData = configData.concat(configSurfaces);
    } else if (plotOptions.show_surface === false && plotOptions.show_scatter === true) {
      configData = configData.concat(configModelPoints);
    } else if (plotOptions.show_surface === true && plotOptions.show_scatter === false) {
      configData = configData.concat(configSurfaces);
    } else if (plotOptions.show_surface === false && plotOptions.show_scatter === false) {
      configData = configData.concat([
        {
          x: [],
          y: [],
          z: [],
          type: 'mesh3d'
        },
        {
          x: [],
          y: [],
          z: [],
          mode: 'markers',
          type: 'scatter3d'
        }
      ]);
    }

    setConfig(configData);
  }, [plotOptions, data, reset, state, values, regressionTypes]);

  return (
    <Grid
      item
      md={isSub ? 12 : 10}
      style={{ minHeight: '350px', maxHeight: '500px' }}
    >
      <Plot
        divId={chartDiv}
        data={config}
        layout={{
          autosize: true,
          width: forceSize ? size.width : (isSub ? 500 : 320),
          height: forceSize ? size.height : (isSub ? 400 : 260),
          margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
          },
          scene: {
            aspectratio: {
              x: 0.6,
              y: 0.6,
              z: 0.6
            },
            camera: {
              center: {
                x: 0,
                y: 0,
                z: 0
              },
              eye: {
                x: 0.9,
                y: 0.9,
                z: 0.9
              },
              up: {
                x: 0,
                y: 0,
                z: 1
              }
            },
            xaxis: {
              title: 'Altitude (km)',
              type: 'linear',
              range: axesRanges.x,
              zeroline: false
            },
            yaxis: {
              title: 'Inclination (deg)',
              type: 'linear',
              range: axesRanges.y,
              zeroline: false
            },
            zaxis: {
              title: zAxisLabel,
              type: 'linear',
              range: axesRanges.z,
              zeroline: false
            }
          },
          showlegend: false
        }}
      />
    </Grid>
  );
}

export default SurfacePlot;