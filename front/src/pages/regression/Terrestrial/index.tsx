import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, IconButton } from '@material-ui/core';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import SubChartPanel from './Popup';
import Heatmap from './HeatMap';
import type { TerrestrialData } from 'src/types/evaluation';

interface TerrestrialProps {
  system: number;
  type: string;
  label: string;
  source: TerrestrialData;
  isClickable: boolean;
}

const Terrestrial: FC<TerrestrialProps> = ({ 
  system, 
  type, 
  label, 
  source,
  isClickable
}) => {
  const [reset, setReset] = useState<boolean>(true);
  const [isEarth, setIsEarth] = useState<boolean>(true);
  const [mode, setMode] = useState('interpolated');
  const [subOpen, setSubOpen] = useState(false);
  const history = useHistory();

  const handleSubChartOpen = () => {
    setSubOpen(!subOpen);
  };

  const handleViewChange = (event) => {
    const { name } = event.currentTarget;
    setMode(name);
  };

  const resetPlot = () => {
    setReset(!reset);
  };

  const toggleEarthView = () => {
    setIsEarth(!isEarth);
  };

  const handleClick = (event: any) => {
    if (event && type === 'coverage') {
      const longitude = Object.keys(event.points[0]).includes('x')
        ? event.points[0].x
        : event.points[0].lon;
      const latitude = Object.keys(event.points[0]).includes('y')
        ? event.points[0].y
        : event.points[0].lat;
      const params = {
        missionType: 'terrestrial',
        longitude: longitude,
        latitude: latitude,
        altitude: 300,
        inclination: 30,
        system: system,
        version: 1,
        networkType: 'relay',
        metric: type,
        isPlot: true
      };
      history.push({
        pathname: '/statistics-dashboard',
        state: { from: 'plot', params: params }
      });
    }
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems="center" className="mb-4">
        <Grid item md={10} />
        <Grid item md={1}>
          <IconButton
            id={type}
            onClick={handleSubChartOpen}
            aria-label="settings"
          >
            <ExitToAppRoundedIcon />
          </IconButton>
        </Grid>
        <Grid item md={1} />

        <Heatmap
          metricType={type}
          isSubSection={false}
          isEarth={isEarth}
          mode={mode}
          size={{
            width: 300,
            height: 300
          }}
          source={source}
          onClick={handleClick}
          isClickable={isClickable}
        />
      </Grid>
      <SubChartPanel
        metricType={type}
        label={label}
        source={source}
        isEarth={isEarth}
        toggleEarthView={toggleEarthView}
        mode={mode}
        open={subOpen}
        onChartClose={handleSubChartOpen}
        onViewChange={handleViewChange}
        onReset={resetPlot}
        onClick={handleClick}
        isClickable={isClickable}
      />
    </>
  );
};

export default Terrestrial;
