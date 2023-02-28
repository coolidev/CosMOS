import { FC } from 'react';
import LineChartSection from 'src/components/Results/Analytics/LineChart';
import HistogramChartSection from 'src/components/Results/Analytics/HistogramChart';
import BoxChartSection from 'src/components/Results/Analytics/BoxChart';
import type { AnalyticsPlotsData } from 'src/types/dashboard';

interface SelectedChartProps {
  id: number;
  size: { width: number; height: number };
  data: AnalyticsPlotsData;
  metricType: string;
  networkType: string;
};

const SelectedChart: FC<SelectedChartProps> = ({
  id,
  size,
  data,
  metricType,
  networkType
}) => {
  return (
    <>
      {id === 1 && (
        <LineChartSection
          source={data}
          metricType={metricType}
          size={size}
          networkType={networkType}
        />
      )}
      {id === 2 && (
        <HistogramChartSection
          title={''}
          yAxisTitle={`Duration (${networkType === 'relay' ? 'sec' : 'min'})`}
          data={[
            {
            x: data.xTraces,
            name: 'Duration',
            type: 'histogram'
            }
          ]}
          metricType={metricType}
          size={size}
          networkType={networkType}
        />
      )}
      {id === 3 && (
        <BoxChartSection
          title={''}
          yAxisTitle={`Duration (${networkType === 'relay' ? 'sec' : 'min'})`}
          data={[
            {
            y: data.xTraces,
            boxpoints: 'all',
            name: '',
            type: 'box'
            }
          ]}
          metricType={metricType}
          size={size}
          networkType={networkType}
        />
      )}
    </>
  );
};

export default SelectedChart;