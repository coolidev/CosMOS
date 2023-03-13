import {FC, useContext, useEffect} from 'react';
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
import { INPUT_PANEL, MINIMUM, NORMAL, PANEL_RATIO, RESULT_PANEL, SIDE_MENU, TAB_MENU } from 'src/utils/basic';
import { PanelContext } from 'src/providers/panel';

interface ResultsProps {
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
  resultRoot: {
    overflow: 'auto',
    width: `${PANEL_RATIO[RESULT_PANEL].width}%`,
    height: '100%',
  },
  tabs: {
    backgroundColor: theme.palette.background.main,
    width: `${PANEL_RATIO[TAB_MENU].width}%`,
    height: '100%',
    '& > div > div': {
      height: '100%'
    }
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
  const { input_panel, result_panel, handlePanel } = useContext(PanelContext)
  const classes = useStyles();
  const { zoom } = useSelector((state) => state.zoom);
  const theme = useTheme<Theme>();

  const handleChange = (event, newValue) => onResultTab(resultTab !== newValue ? newValue : '');

  useEffect(() => {
    if (resultTab !== '') {
      handlePanel(RESULT_PANEL, NORMAL);
    } else {
      handlePanel(RESULT_PANEL, MINIMUM);
    }
  }, [resultTab, handlePanel])

  return (
    <>
      <Box
        // className={clsx(classes.selected, collapsed && classes.hide)}
        className={classes.resultRoot}
        style={{
          backgroundColor: theme.palette.background.main,
          width: `${resultTab === 'compare' ? (100 - (PANEL_RATIO[SIDE_MENU].width + PANEL_RATIO[TAB_MENU].width + (input_panel === MINIMUM ? PANEL_RATIO[INPUT_PANEL].minimized_width : PANEL_RATIO[INPUT_PANEL].width))) : (result_panel === MINIMUM ? PANEL_RATIO[RESULT_PANEL].minimized_width : PANEL_RATIO[RESULT_PANEL].width)}%`
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
              height: '25%'
            }}
            // disabled={tab.name !== 'network' && !state.isDataLoaded}
          />
        ))}
      </Tabs>
    </>
  );
};

export default Results;