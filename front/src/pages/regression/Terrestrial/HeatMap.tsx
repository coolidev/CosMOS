import { useTheme } from '@material-ui/core';
import type { FC } from 'react';
import Plot from 'react-plotly.js';
import type { TerrestrialData } from 'src/types/evaluation';
import type { Theme } from 'src/theme';

interface HeatMapProps {
  metricType: string;
  isSubSection: boolean;
  isEarth: boolean;
  mode: string;
  size: { width: number; height: number };
  source: TerrestrialData;
  onClick: (e: any) => void;
  isClickable: boolean;
}

const gapMetrics = ['average_gap', 'max_gap', 'mean_response_time'];

const HeatMap: FC<HeatMapProps> = ({
  metricType,
  isSubSection,
  isEarth,
  mode,
  size,
  onClick,
  source,
  isClickable
}) => {
  const theme = useTheme<Theme>();
  const coloraxis = {
    cmin: 0,
    cmax: !gapMetrics.includes(metricType) ? 100 : 1440,
    colorscale: 'Jet',
    reversescale: !gapMetrics.includes(metricType)
  };
  const width = isSubSection ? size.width : 400;
  const height = isSubSection ? size.height : 300;

  return (
    <>
      {!isEarth ? (
        <Plot
          data={
            [
              {
                x:
                  mode === 'heatmap'
                    ? source?.heatmap.x
                    : source?.interpolatedHeatmap.x,
                y:
                  mode === 'heatmap'
                    ? source?.heatmap.y
                    : source?.interpolatedHeatmap.y,
                z:
                  mode === 'heatmap'
                    ? source?.heatmap.z
                    : source?.interpolatedHeatmap.z,
                type: 'heatmap',
                coloraxis: 'coloraxis'
              }
            ] as any
          }
          layout={
            {
              paper_bgcolor: theme.palette.component.main,
              plot_bgcolor: theme.palette.component.main,
              autosize: true,
              margin: {
                l: 60,
                r: 15,
                b: 35,
                t: 15
              },
              title: false,
              width: width,
              height: height,
              xaxis: {
                title: 'Longitude (deg)',
                zeroline: false,
                range: [-180, 180],
                tickmode: 'linear',
                tick0: -180,
                dtick: 60,
                color: theme.palette.component.opposite
              },
              yaxis: {
                title: 'Latitude (deg)',
                zeroline: false,
                range: [-90, 90],
                tickmode: 'linear',
                tick0: -90,
                dtick: 30,
                color: theme.palette.component.opposite
              },
              coloraxis: coloraxis
            } as any
          }
          onClick={isClickable ? (e) => onClick(e) : null}
        />
      ) : (
        <Plot
          data={
            [
              {
                lat:
                  mode === 'heatmap'
                    ? source?.heatmap.y
                    : source?.interpolatedHeatmap.y,
                lon:
                  mode === 'heatmap'
                    ? source?.heatmap.x
                    : source?.interpolatedHeatmap.x,
                z:
                  mode === 'heatmap'
                    ? source?.heatmap.z
                    : source?.interpolatedHeatmap.z,
                type: 'densitymapbox',
                opacity: 0.5,
                coloraxis: 'coloraxis'
              }
            ] as any
          }
          layout={
            {
              autosize: true,
              margin: {
                l: 60,
                r: 15,
                b: 35,
                t: 15
              },
              title: false,
              width: width,
              height: height,
              mapbox: {
                center: { lon: 60, lat: 30 },
                style: 'outdoors',
                zoom: 2
              },
              coloraxis: coloraxis
            } as any
          }
          config={{
            mapboxAccessToken:
              'pk.eyJ1IjoicmxhZm9udGFpbmUiLCJhIjoiY2tpMG82ZjNiMHZ3NjJxcDV1cjAzaTJ4eCJ9.VJSnQNJxiJK-jixU6KaFYQ'
          }}
          onClick={isClickable ? (e) => onClick(e) : null}
        />
      )}
    </>
  );
};

export default HeatMap;
