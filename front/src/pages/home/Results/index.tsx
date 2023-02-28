import {FC} from 'react';
import clsx from 'clsx';
import {
  Box,
  Tabs,
  Tab,
  makeStyles,
  colors,
  Typography,
  useTheme
} from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import Analytics from './Analytics';
import Performance from './Performance';
import type { State } from 'src/pages/home';
import Comparison from './Comparison';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { useSelector } from 'src/store';
import AnalysisOverview from './AnalysisOverview';

interface ResultsProps {
  width: number;
  resultTab: string;
  collapsed: boolean;
  state: State;
  bounds: { [key: string]: { min: number; max: number } };
  wizardIndex: number;
  setWizardIndex: any;
  onResultTab: (value: string) => void;
  onState: (name: string, value: any) => void;
  onBounds: (name: string, type: string, value: number) => void;
  onError: (message: string, warning: boolean, title?: string) => void;
}

const tabs = [
  { name: 'network', label: 'Analysis Overview' },
  { name: 'analytics', label: 'Analytics' },
  { name: 'performance', label: 'Performance' },
  { name: 'compare', label: 'Compare' }
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex'
  },
  tabs: {
    backgroundColor: theme.palette.background.main
  },
  tab: {
    '& span': {
      textOrientation: 'mixed',
      writingMode: 'vertical-rl'
    },
    color: theme.palette.text.primary,
    minWidth: 0,
    padding: theme.spacing(1),
    backgroundColor:
      theme.name === THEMES.LIGHT
        ? colors.grey[100]
        : theme.palette.background.paper
  },
  indicator: {
    backgroundColor: 'transparent'
  },
  selected: {
    backgroundColor:
      theme.name === THEMES.LIGHT
        ? colors.grey[50]
        : theme.palette.background.main
  },
  hide: {
    display: 'none'
  },
  overview: {

  }
}));

const Results: FC<ResultsProps> = ({
  width,
  state,
  bounds,
  resultTab,
  collapsed,
  wizardIndex,
  setWizardIndex,
  onResultTab,
  onState,
  onBounds,
  onError,
}) => {
  const classes = useStyles();
  const { zoom } = useSelector((state) => state.zoom);
  const theme = useTheme<Theme>();

  const handleChange = (event, newValue) => onResultTab(newValue);

  return (
    <div className={classes.root} style={{ height: '100%'}}>
      <Box
        className={clsx(classes.selected, collapsed && classes.hide)}
        style={{
          width: width - (window.screen.availHeight / zoom) * 0.03,
          overflowX: 'hidden',
          overflowY: 'hidden'
        }}
      >
        <AnalysisOverview
          resultTab= {resultTab}
          collapsed= {collapsed}
          state = {state}
          bounds = {bounds}
          wizardIndex= {wizardIndex}
          setWizardIndex= {setWizardIndex}
          onResultTab= {onResultTab}
          onState= {onState}
          onBounds= {onBounds}
        />
        
        <Analytics
          state={state}
          parentWidth={width - (window.screen.availHeight / zoom) * 0.03}
          onState={onState}
          visible={resultTab === 'analytics' && !collapsed}
        />
        <Performance
          state={state}
          bounds={bounds}
          onState={onState}
          visible={resultTab === 'performance' && !collapsed}
          onBounds={onBounds}
          onError={onError}
        />
        <Comparison
          state={state}
          onState={onState}
          visible={resultTab === 'compare' && !collapsed}
        />
      </Box>
      <Tabs
        orientation="vertical"
        value={resultTab}
        onChange={handleChange}
        className={classes.tabs}
        style={{ width: (window.screen.availHeight / zoom) * 0.03 }}
        TabIndicatorProps={{ className: classes.indicator }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.name}
            label={
              <Box display="flex" alignItems="center" justifyContent="center">
                {resultTab === tab.name && !collapsed ? (
                  <FiberManualRecordIcon
                    color="primary"
                    style={{ fontSize: '0.8rem' }}
                  />
                ) : (
                  <FiberManualRecordOutlinedIcon
                    color="primary"
                    style={{ fontSize: '0.8rem' }}
                  />
                )}
                <Box flexGrow={1} mb={2} />
                <Typography
                  variant="body1"
                  style={
                    resultTab === tab.name
                      ? {
                          fontWeight: 600,
                          color: theme.name === THEMES.LIGHT ? '#000' : '#FFF'
                        }
                      : { fontWeight: 600 }
                  }
                >
                  {tab.label}
                </Typography>
              </Box>
            }
            value={tab.name}
            className={classes.tab}
            style={{
              height: (window.screen.availHeight / zoom) * 0.215
            }}
            // disabled={tab.name !== 'network' && !state.isDataLoaded}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default Results;