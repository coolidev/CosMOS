import { FC, useState } from 'react';
import clsx from 'clsx';
import {
  Icon,
  IconButton,
  Box,
  makeStyles,
  Tooltip,
  useTheme,
  Grid
} from '@material-ui/core';
import { PDFViewerGuide } from '../pdf-view-panel';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { useSelector } from 'src/store';
import { PANEL_RATIO, SIDE_MENU } from 'src/utils/basic';

interface SideBarProps {
  currentTab: string;
  onCurrentTab: (value: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    justifyContent: 'center',
    overflow: 'hidden',
    width: `${PANEL_RATIO[SIDE_MENU].width}%`,
    height: '100%',
    margin: 0,
    textAlign: 'center'
  },
  rootBox: {
    height: '100%',
    margin: 0,
    textAlign: 'center'
  },
  selected: {
    backgroundColor: theme.palette.background.main
  },
  button: {
    border: 1,
    borderRadius: 8,
    margin: theme.spacing(1.5, 1.5)
  },
  info: {
    marginBottom: theme.spacing(2)
  }
}));

const SideBar: FC<SideBarProps> = ({ currentTab, onCurrentTab }) => {
  const classes = useStyles();
  const { zoom } = useSelector((state) => state.zoom);
  const theme = useTheme<Theme>();

  const handleChangeTab = (event): void =>
    onCurrentTab(currentTab === event.currentTarget.name ? '' : event.currentTarget.name);

  const [guideView, setGuideView] = useState<boolean>(false);

  return (
    <Grid
      className={classes.root}
    >
      <Box
        mx={1.5}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        className={classes.rootBox}
        paddingBottom='20px'
      >
        <Box
          mt={3}
          className={clsx(
            currentTab === 'mission' &&
            classes.selected
          )}
        >
          <Tooltip id="missionButton" title="Mission">
            <IconButton
              name="mission"
              size="small"
              className={classes.button}
              onClick={handleChangeTab}
            >
              <Icon
                style={{
                  width: (window.screen.availHeight / zoom) * 0.0384,
                  height:
                  (window.screen.availHeight / zoom) * 0.0384 * (29 / 26),
                  textAlign: 'center',
                  overflow: 'visible'
                }}
              >
                <img
                  alt="mission"
                  style={{ height: '90%' }}
                  src={
                  currentTab === 'mission'
                    ? (theme.name === THEMES.LIGHT?'/static/icons/light/mission-selected.svg':'/static/icons/mission-selected.svg')
                    : (theme.name === THEMES.LIGHT?'/static/icons/light/mission.svg':'/static/icons/mission.svg')
                  }
                />
              </Icon>
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          className={clsx(
            currentTab === 'saves' &&
            classes.selected
          )}
        >
          <Tooltip id="historyButton" title="Project History">
            <IconButton
              name="saves"
              size="small"
              className={classes.button}
              onClick={handleChangeTab}
            >
              <Icon
                style={{
                  width: (window.screen.availHeight / zoom) * 0.0384,
                  height:
                  (window.screen.availHeight / zoom) * 0.0384 * (29 / 26),
                  textAlign: 'center',
                  overflow: 'visible'
                }}
              >
                <img
                  alt="saves"
                  style={{ height: '90%' }}
                  src={
                    currentTab === 'saves'
                      ? (theme.name === THEMES.LIGHT?'/static/icons/light/saves-selected.svg':'/static/icons/saves-selected.svg')
                      : (theme.name === THEMES.LIGHT?'/static/icons/light/saves.svg':'/static/icons/saves.svg')
                  }
                />
              </Icon>
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          className={clsx(
            currentTab === 'report' &&
            classes.selected
          )}
        >
          <Tooltip id="reportsButton" title="Reports">
            <IconButton
              name="report"
              size="small"
              className={classes.button}
              onClick={handleChangeTab}
            >
              <Icon
                style={{
                  width: (window.screen.availHeight / zoom) * 0.0384,
                  height:
                  (window.screen.availHeight / zoom) * 0.0384 * (29 / 25),
                  textAlign: 'center',
                  overflow: 'visible'
                }}
              >
                <img
                  alt="report"
                  style={{ height: '90%' }}
                  src={
                    currentTab === 'report'
                    ? (theme.name === THEMES.LIGHT?'/static/icons/light/report-selected.svg':'/static/icons/report-selected.svg')
                    : (theme.name === THEMES.LIGHT?'/static/icons/light/report.svg':'/static/icons/report.svg')
                  }
                />
              </Icon>
            </IconButton>
          </Tooltip>
        </Box>
        <Box flexGrow={1} />
        <Tooltip id="guideButton" title="Users Guide">
          <IconButton
            onClick={() => setGuideView(true)}
            className={classes.info}
          >
            <Icon
              style={{
                width: (window.screen.availHeight / zoom) * 0.0384,
                height: (window.screen.availHeight / zoom) * 0.0384,
                textAlign: 'center',
                overflow: 'visible'
              }}
            >
              <img
                alt="info"
                src="/static/icons/info.svg"
                style={{
                  height: (window.screen.availHeight / zoom) * 0.03
                }}
              />
            </Icon>
          </IconButton>
        </Tooltip>
      </Box>
      <PDFViewerGuide isOpen={guideView} onClose={() => setGuideView(false)} />
    </Grid>
  );
};

export default SideBar;
