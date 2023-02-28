import { useTheme } from '@material-ui/core';
import { FC, useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import type { Theme } from 'src/theme';
import type { AnalyticsPlotsData } from 'src/types/dashboard';

interface LineChartProps {
  source: AnalyticsPlotsData;
  metricType: string;
  size: { width: number; height: number };
  networkType: string;
}

const LineChart: FC<LineChartProps> = ({
  source,
  metricType,
  size,
  networkType
}) => {
  const theme = useTheme<Theme>();
  const [timeUnit, setTimeUnit] = useState<String>('');

  useEffect(() => {
    if (networkType === 'relay') {
      setTimeUnit('sec');
    } else {
      setTimeUnit('min');
    }
  }, [networkType]);

  return (
    <Plot
      divId={metricType === 'coverage' ? "CoverageRunningAverageplotly" : "GapRunningAverageplotly"}
      data={[
        {
          x: source?.xTraces,
          y: source?.yTraces,
          name:
            metricType === 'coverage'
              ? 'Contact Event Duration'
              : 'Gap Event Duration',
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' }
        },
        {
          x: source?.xTraces,
          y: source?.avgTraces,
          name: 'Running Average',
          type: 'scatter',
          marker: { color: 'blue' }
        }
      ]}
      layout={{
        paper_bgcolor: theme.palette.component.main,
        plot_bgcolor: theme.palette.component.main,
        title: {
          text: `<b>${source ? source?.title : ''}</b>`,
          font: {
            family: 'Roboto',
            size: 15,
            color: theme.palette.component.opposite
          }
        },
        width: size.width,
        height: size.height,
        showlegend: true,
        legend: {
          orientation: 'h',
          xanchor: 'center',
          font: {
            family: 'sans-serif',
            size: 12,
            color: theme.palette.component.opposite
          }
        },
        margin: {
          l: 60,
          b: 0,
          r: 30,
          t: 30,
          pad: 5
        },
        xaxis: {
          title:
            metricType === 'coverage'
              ? 'Coverage Event Number'
              : 'Gap Event Number',
          titlefont: {
            size: 12,
            color: theme.palette.component.opposite
          },
          showgrid: true,
          zerolinecolor: '#969696',
          zerolinewidth: 1,
          color: theme.palette.component.opposite
        },
        yaxis: {
          title:
            metricType === 'coverage'
              ? `Coverage Duration (${timeUnit})`
              : `Gap Duration (${timeUnit})`,
          titlefont: {
            size: 12,
            color: theme.palette.component.opposite
          },
          showgrid: true,
          zerolinecolor: '#969696',
          zerolinewidth: 1,
          color: theme.palette.component.opposite
        }
      }}
      config={{ displayModeBar: false }}
    />
  );
};

export default LineChart;
