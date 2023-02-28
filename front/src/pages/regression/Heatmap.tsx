/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Grid } from '@material-ui/core';
import type { PerformancePanel } from 'src/types/evaluation';
import type { State } from 'src/pages/home';

interface HeatmapProps {
  state: State[];
  data: PerformancePanel[];
  minAltitude: number;
  maxAltitude?: number;
  maxInclination: number;
  metricType: string;
  values: number[];
  isLegend: boolean;
  isSub: boolean;
  size: { width: number, height: number };
  plotOptions: { show_surface: boolean; show_scatter: boolean };
  chartDiv: string;
  reset: boolean;
  forceSize? : boolean;
  title: string;
};

const Heatmap: FC<HeatmapProps> = ({
  state,
  data,
  metricType,
  minAltitude,
  maxInclination,
  plotOptions,
  values,
  isSub,
  chartDiv,
  size,
  reset,
  forceSize,
  title
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
    let minValues, maxValues;

    

    data.forEach((dataset, dataIndex) => {
      if (!dataset) return;

      
      const configSystemName = Object.keys(dataset).includes('systemParams')
        ? dataset.systemParams.systemName : '';
      const modelDataLabel = data.length <= 1
        ? 'Model Data' : `${configSystemName} Model Data`;
      const modelData = dataset.modelData.orbital[metricType]?.points;
      minValues = unpack(modelData, 'value');
      maxValues = unpack(modelData, 'value');

      const min = Math.min(...minValues);
      const max = Math.max(...maxValues);
      configModelPoints.push({
        x: unpack(modelData, 'altitude'),
        y: unpack(modelData, 'inclination'),
        z: unpack(modelData, 'eccentricity'),
        name: modelDataLabel,
        mode: 'markers',
        type: 'scatter3d',
        opacity: 1,
        marker: {
          showscale: true,
          colorbar:{
            title: title,
            titleside: "right",
            thickness: 10
          },
          size: 5,
          cmin: min,
          cmax: max,
          color: unpack(modelData, 'value'),
          colorscale: "Jet"
        },
      });
      try{
        let userAlt = state[dataIndex].parameters.altitude;
        let userIncl = state[dataIndex].parameters.inclination;
        let userEcc = state[dataIndex].parameters.eccentricity;
        let reversed = dataset?.modelData?.orbital?.[metricType]?.points?.reverse();
        let done = reversed.find(e => e.altitude === userAlt && e.inclination === userIncl && e.eccentricity === userEcc);
        if(done){
          configData = configData.concat([
            {
              x: [state[dataIndex].parameters.altitude],
              y: [state[dataIndex].parameters.inclination],
              z: [state[dataIndex].parameters.eccentricity],
              type: 'scatter3d',
              mode: 'markers',
              marker: {
                color: [dataset?.modelData?.orbital?.[metricType]?.points?.reverse().find(e => e.altitude === state[dataIndex].parameters.altitude && e.inclination === state[dataIndex].parameters.inclination && e.eccentricity === state[dataIndex].parameters.eccentricity)?.value?? 0],
                size: 8,
                shape: 'square',
                colorscale: "Jet",
                cmin: min, 
                cmax: max
              },
              name: 'User'
            }
          ])
        }
      } catch (e){
        console.log(e);
      }
       
    });
    
    setAxesRanges({
      x: [Math.max(...maxAltitudes), minAltitude],
      y: [maxInclination, 0],
      z: [0,1]
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
  }, [plotOptions, data, reset, state, values]);

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
              title: 'Eccentricity',
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

export default Heatmap;