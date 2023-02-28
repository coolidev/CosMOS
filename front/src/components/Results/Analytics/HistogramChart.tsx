import { useTheme } from '@material-ui/core';
import type { FC } from 'react';
import Plot from 'react-plotly.js';
import type { Theme } from 'src/theme';

interface HistogramChartProps {
  title: string;
  yAxisTitle: string;
  size: { width: number; height: number };
  networkType: string;
  metricType: string;
  data: { [key: string]: any }[];
};

const HistogramChart: FC<HistogramChartProps> = ({
  title,
  yAxisTitle,
  data,
  size,
  metricType
}) => {
  const theme = useTheme<Theme>();

  return (
    <Plot
      divId = {metricType === 'coverage' ? "CoverageDistributionplotly" : "GapDistributionPlotly"}
      data={data}
      layout={{
        paper_bgcolor: theme.palette.component.main,
        plot_bgcolor: theme.palette.component.main,
        title: {
          text: title,
          font: {
            family: 'Roboto',
            size: 15,
            color: theme.palette.component.opposite
          },
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
          title: yAxisTitle,
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
          title: 'Occurrences',
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

export default HistogramChart;
