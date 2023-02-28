import { useTheme } from '@material-ui/core';
import type { FC } from 'react';
import Plot from 'react-plotly.js';
import type { Theme } from 'src/theme';

interface BoxChartProps {
  title: string;
  yAxisTitle: string;
  size: { width: number; height: number };
  networkType: string;
  metricType: string;
  data: { [key: string]: any }[];
}

const BoxChart: FC<BoxChartProps> = ({
  title,
  yAxisTitle,
  size,
  metricType,
  data
}) => {
  const theme = useTheme<Theme>();

  return (
    <Plot
      divId={metricType === 'coverage' ? "CoverageStatisticsplotly": "GapStatisticsplotly"}
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
          }
        },
        width: size.width,
        height: size.height,
        margin: {
          l: 60,
          b: 0,
          r: 30,
          t: 30,
          pad: 5
        },
        yaxis: {
          title: yAxisTitle,
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

export default BoxChart;
