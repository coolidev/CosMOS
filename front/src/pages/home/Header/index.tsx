import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  makeStyles,
  SvgIcon,
  IconButton,
  Tooltip,
  Badge,
  Icon,
  useTheme,
  CircularProgress
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { useAuth, useSMS } from 'src/hooks/useAuth';
import { LogoLight, LogoDark } from 'src/components/Logo';
import SaveIcon from '@material-ui/icons/Save';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import AccountCircle from '@material-ui/icons/AccountCircleOutlined';
import ExitToApp from '@material-ui/icons/ExitToAppOutlined';
import Timeline from '@material-ui/icons/Timeline';
import { Menu as MenuIcon } from 'react-feather';
import { useDispatch, useSelector } from 'src/store';
import { getPreference, updatePreference } from 'src/slices/preference';
import { getProject, updateProject } from 'src/slices/project';
import HelpModal from './HelpModal';
import ComparisonModal from './ComparisonModal';
import type { Project, ISave } from 'src/types/preference';
import type { State } from 'src/pages/home';
import { convertStateToSave } from 'src/pages/home';
import { version } from 'src/releaseVersion';
import ManageAccounts from '../ManageAccounts';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import Settings from './Settings';
import { PlayCircleFilled } from '@material-ui/icons';
import {
  ComparisonResult,
  updateComparisonIds,
  updatePinnedResults
} from 'src/slices/pinnedResults';
import { getOrbitalModelValue, getValue } from 'src/algorithms/regressions';
import {
  GroundStationCharacteristics,
  RelayCharacteristics
} from 'src/types/evaluation';
import {
  AntennaInputs,
  computeDipoleSize,
  computeHelicalSize,
  computeParabolicDiameter,
  computeParabolicMass,
  computePatchSize,
  computeSteerableSize
} from 'src/algorithms/antennas';
import { getGNSSAvailability } from 'src/algorithms/nav';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface HeaderProps {
  state: State;
  cache: ISave;
  onOpen: () => void;
  onCache: (data: ISave) => void;
  onState: (name: string, value: any) => void;
  resultTab: string;
  handleResultTab: any;
  collapsed: boolean;
  setCollapsed: any;
  setWizardIndex: any;
  hideLoading: any;
  setHideLoading: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(3, 3, 3, 3),
    paddingTop: '8vh'
  },
  toolbar: {
    minHeight: '7.2vh',
    backgroundColor: theme.palette.background.header
  },
  link: {
    textDecoration: 'none',
    '&:hover': {
      color: '#FFF'
    }
  },
  divider: {
    backgroundColor: theme.palette.border.main
  },
  title: {
    position: 'relative',
    paddingTop: '0.2rem',
    paddingBottom: '0.2rem',
    paddingRight: theme.spacing(2)
  },
  subTitle: {
    fontStyle: 'italic'
  },
  tab: {
    color: '#FFF',
    '&:hover': {
      color: '#AAA'
    }
  },
  refresh: {
    color: '#4066BA',
    '&:hover': {
      color: '#EEE'
    }
  },
  refreshDisabled: {
    color: '#000',
    opacity: 0.3
  },
  item: {
    color: theme.palette.text.primary
  },
  inputRoot: {
    color: theme.palette.text.primary,
    background: theme.palette.background.light,
    border: `1px solid ${theme.palette.border.main}`,
    borderRadius: theme.spacing(2)
  },
  inputInput: {
    padding: theme.spacing(2),
    width: '18vw',
    textAlign: 'center'
  },
  sync: {
    background: theme.palette.background.dark,
    marginLeft: theme.spacing(2)
  },
  versionFormat: {
    textAlign: 'center',
    paddingBottom: '0.5rem',
    color: 'grey',
    margin: 'auto'
  }
}));

const Header: FC<HeaderProps> = ({
  state,
  cache,
  onOpen,
  onCache,
  onState,
  resultTab,
  handleResultTab,
  collapsed,
  setCollapsed,
  setWizardIndex,
  hideLoading,
  setHideLoading
}) => {
  const classes = useStyles();

  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isModal, setModal] = useState(false);
  const [isEngineer, setEngineer] = useState(false);
  const [manageAcctVisible, setManageAcctVisible] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [headerText, setHeaderText] = useState<string>('');

  const { setAuthTokens } = useAuth();
  const { setSMSTokens } = useSMS();

  const dispatch = useDispatch();
  const { preference } = useSelector((state) => state.preference);
  const { project } = useSelector((state) => state.project);
  const { performancePanel } = useSelector((state) => state.results);
  const { pinnedResults, comparisonIds } = useSelector(
    (state) => state.pinnedResults
  );

  const theme = useTheme<Theme>();

  useEffect(() => {
    dispatch(getPreference());
    dispatch(getProject());
  }, [dispatch]);

  useEffect(() => {
    setUser(localStorage.getItem('name'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem('name')]);

  useEffect(() => {
    const value = preference.project.find((item) => item.id === project);
    value && setProjectName(value.projectName);
    //count the number of saves that are marked as 'isCompared' and match the necessary criteria (Relay/Orbit, Relay/Terrestrial, DTE)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preference, project, state.parameters.isOrbital]);

  useEffect(() => {
    if (projectName && project) {
      if (state.isLastSave && !state.isMarkedForComparison) {
        setHeaderText(projectName + ' - Saved Successfully');
      } else if (!state.isMarkedForComparison) {
        setHeaderText(projectName + '* - Unsaved Changes');
      }
    } else {
      setHeaderText('Please Load a Mission to Continue');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isLastSave, state.isMarkedForComparison, projectName]);

  useEffect(() => {
    // Query the database for the current user's privileges.
    const fetchData = async () => {
      const params = { email: localStorage.getItem('email') };
      const response = await axios.post('/getEngineerStatus', params);

      // Returns 1 if the user has engineer privileges,
      // and 0 if the user does not have engineer privileges.
      if (response.data) {
        localStorage.setItem('isEngineer', response.data);
        setEngineer(response.data);
      } else if (localStorage.getItem('isEngineer') == null) {
        localStorage.setItem('isEngineer', 'false');
        setEngineer(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // When the cache ID changes, this means a new save
    // should be created.
    let temp = JSON.parse(JSON.stringify(preference));

    // Check if every item in the saves array has a different ID
    // than the current ID of the cache object.
    const selected = temp.project.find((item) => item.id === project);
    const findCache =
      selected && selected.saves.every((item: ISave) => item.id !== cache.id);

    // If the ID of the cache object does not exist in the saves
    // array, add the current cache object to the saves array
    // of the loaded project.
    if (findCache) {
      // Construct the new save entry using the current
      // state of the application.
      const newSave = convertStateToSave(cache, state);

      selected.saves = [...selected.saves, newSave];
      const data = [
        ...temp.project.filter((item: Project) => item.id !== project),
        selected
      ];

      // Update the database.
      dispatch(updatePreference({ project: data }));

      const savesExceptIsCompared =
        selected.saves && selected.saves.filter((save) => !save.isCompared);
      const mostRecentSave =
        savesExceptIsCompared &&
        savesExceptIsCompared.length > 0 &&
        savesExceptIsCompared[savesExceptIsCompared.length - 1];
      if (mostRecentSave.id !== state.save) {
        onState('save', mostRecentSave.id ?? '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache.id]);

  useEffect(() => {
    const fetchComparisons = async () => {
      if (state.fetchComparisons) {
        let response = await axios.post('/pinnedResults', {
          email: localStorage.getItem('email'),
          projectId: String(localStorage.getItem('project')),
          withData: false
        });
        dispatch(updateComparisonIds(response.data));
        response = await axios.post('/getResultsForAnalyses', {
          resultIds: response.data
        });
        dispatch(updatePinnedResults(response.data.results));
        onState('fetchComparisons', false);
      }
    };
    fetchComparisons();
  }, [state.fetchComparisons]);

  const logout = () => {
    setAuthTokens('');
    setSMSTokens('');
    dispatch(updateProject(null));
    localStorage.clear();
  };

  const handleModal = (): void => setModal(!isModal);

  const handleRequestAnalysis = async (): Promise<void> => {
    resultTab !== 'network' && handleResultTab('network');
    collapsed && setCollapsed(false);
    setWizardIndex(1);
  };

  const handleMenu = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  // When the Save button is triggered, add an
  // entry to the project's saves.
  const handleSave = (): void => {
    onCache({
      ...cache,
      id: uuidv4(),
      isCompared: false,
      dateTime: parseInt(moment().format('X'))
    });
  };

  const getResultsFromPerfromancePanel = (key: string) => {
    let value;
    let name =
      state.networkType === 'relay'
        ? (performancePanel.systemParams as RelayCharacteristics).systemName
        : (performancePanel.systemParams as GroundStationCharacteristics)
            .systemName;
    if (state.pointSync || state.parametric) {
      let data = performancePanel.modelData;
      value = getOrbitalModelValue(
        state.parameters.altitude,
        state.parameters.inclination,
        key,
        data,
        name.toString()
      );
    } else {
      let data = performancePanel.predictedData;
      value = getValue(
        state.parameters.altitude,
        state.parameters.inclination,
        key,
        state.regressionTypes[key],
        data,
        name
      );
    }
    return value;
  };

  const USER_BURDEN_FUNCS = {
    parabolicDiameter: computeParabolicDiameter,
    parabolicMass: computeParabolicMass,
    steerableSize: computeSteerableSize,
    helicalHeight: computeHelicalSize,
    patchSize: computePatchSize,
    dipoleSize: computeDipoleSize
  };

  const getAntennaResults = (key: string) => {
    let wavelength_m = (
      performancePanel.systemParams as
        | RelayCharacteristics
        | GroundStationCharacteristics
    )?.lambda;
    //This is kinda altered from the code that I took it from, so if there is a problem with user-defined networks this would be the place to look first
    //I'm not really sure why the part from the user defined networks is written like it is so im just omitting it for the time being.

    const antennaInputs: AntennaInputs = {
      wavelength: wavelength_m,
      eirp: state.results.eirp_dBW,
      powerAmplifier: state.constraints.powerAmplifier,
      antennaSize: null
    };
    let value = USER_BURDEN_FUNCS[key](antennaInputs);
    return value;
  };
  // Adds an entry to the project's saves when a
  // configuration is marked for comparison.
  const markForComparison = async (name: string) => {
    setHeaderText(`Marked for Comparison`);
    onState('isMarkedForComparison', true);

    const KEYS = {
      coverage: state.networkType === 'relay' ? 'coverage' : 'coverageMinutes',
      mean_contacts:
        state.networkType === 'relay' ? 'mean_contacts' : 'contactsPerDay',
      mean_coverage_duration:
        state.networkType === 'relay'
          ? 'mean_coverage_duration'
          : 'averageCoverageDuration',
      average_gap:
        state.networkType === 'relay' ? 'average_gap' : 'averageGapDuration',
      max_gap: state.networkType === 'relay' ? 'max_gap' : 'maxGapDuration',
      mean_response_time:
        state.networkType === 'relay'
          ? 'mean_response_time'
          : 'meanResponseTime',
      availability:
        state.networkType === 'relay' ? 'availability' : 'availability_gap'
    };

    let newComparison: ComparisonResult = {
      name: name,
      parameters: {
        altitude: state.parameters.isOrbital ? state.parameters.altitude : null,
        inclination: state.parameters.isOrbital
          ? state.parameters.inclination
          : null,
        eccentricity: state.parameters.isOrbital
          ? state.parameters.eccentricity
          : null,
        frequencyBand: state.commsSpecs.freqBand,
        modulation: state.commsSpecs.commsPayloadSpecs.modulation, //might be stored somewhere different, if buggy check this
        coding: state.commsSpecs.commsPayloadSpecs.coding, //might be stored somewhere different, if buggy check this
        standardsCompliance: state.commsSpecs.standardsCompliance, //might be stored somewhere different, if buggy check this
        latitude: !state.parameters.isOrbital
          ? state.parameters.latitude
          : null,
        longitude: !state.parameters.isOrbital
          ? state.parameters.longitude
          : null
      },
      performance: {
        rfCoverage: getResultsFromPerfromancePanel(KEYS.coverage),
        meanContacts: getResultsFromPerfromancePanel(KEYS.mean_contacts),
        meanContactDuration: getResultsFromPerfromancePanel(
          KEYS.mean_coverage_duration
        ),
        averageGap: getResultsFromPerfromancePanel(KEYS.average_gap),
        maxGap: getResultsFromPerfromancePanel(KEYS.max_gap),
        meanResponseTime: getResultsFromPerfromancePanel(
          KEYS.mean_response_time
        ),
        effectiveCommsTime: !isNaN(
          getResultsFromPerfromancePanel(KEYS.availability)
        )
          ? getResultsFromPerfromancePanel(KEYS.availability)
          : 0, //This one cant seem to get a value, so for the time being it will be null. This is a known gap
        dataRate: state.results.dataRate_kbps / 1000,
        throughput: state.results.maxThroughput_Gb_Day / 8
      },
      antennaOptions: {
        eirp: !state.commsSpecs.commsPayloadSpecs.minEIRPFlag
          ? state.commsSpecs.commsPayloadSpecs.eirp
          : state.results.eirp_dBW,
        parabolicAntennaDiameter: getAntennaResults('parabolicDiameter'),
        parabolicAntennaMass: getAntennaResults('parabolicMass'),
        electronicAntennaSize: getAntennaResults('steerableSize'),
        helicalAntennaHeight: getAntennaResults('helicalHeight'),
        patchAntennaSize: getAntennaResults('patchSize'),
        dipoleAntennaSize: getAntennaResults('dipoleSize')
      },
      navAndTracking: {
        trackingAccuracy:
          state.networkType === 'relay'
            ? (
                performancePanel.systemParams as RelayCharacteristics
              )?.trackingAccuracy.toString()
            : 'N/A',
        gnssAvailability: getGNSSAvailability(state.parameters.altitude)
      }
    };
    const newCompArray = pinnedResults.slice();
    const response = await axios.post('/saveAnalysisResults', {
      name: newComparison.name,
      parameters: newComparison.parameters,
      performance: newComparison.performance,
      antennaOptions: newComparison.antennaOptions,
      navAndTracking: newComparison.navAndTracking,
      email: localStorage.getItem('email'),
      projectId: String(localStorage.getItem('project'))
    });
    newComparison.id = response.data.resultsId;
    let newComparisonIds = comparisonIds.slice();
    newComparisonIds.push(response.data.resultsId);
    dispatch(updateComparisonIds(newComparisonIds));
    newCompArray.push(newComparison);
    dispatch(updatePinnedResults(newCompArray));
  };
  const handleManageAccount = (): void => {
    handleClose();
    setManageAcctVisible(!manageAcctVisible);
  };

  return (
    <AppBar position="fixed">
      <Toolbar className={classes.toolbar}>
        <Box display="flex" alignItems="center" width="100%">
          <IconButton
            style={{ color: theme.palette.border.main }}
            size="small"
            onClick={() => onOpen()}
          >
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
          <Box>
            <Link to="/" className={classes.link}>
              <Typography
                variant="h5"
                className={classes.title}
                style={{ color: theme.palette.text.primary }}
              >
                CART <br />
              </Typography>
              <Divider className={classes.divider} />
              <Typography
                variant="body1"
                component="p"
                className={classes.subTitle}
                color="textPrimary"
              >
         
              </Typography>
            </Link>
          </Box>
          <Box ml={3} flexGrow={1.4} />
          <Box>
            <InputBase
              placeholder={headerText}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box>
            <Tooltip id="saveButton" title="Save Project">
              <span>
                <IconButton
                  className={classes.tab}
                  onClick={handleSave}
                  disabled={state.isLastSave || state.loading}
                >
                  <SaveIcon
                    style={{ color: '#e14748' }}
                    className={
                      state.isLastSave
                        ? classes.refreshDisabled
                        : classes.refresh
                    }
                  />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              id="compareButton"
              title="Pin this selection for comparison"
            >
              <span>
                <IconButton
                  className={classes.tab}
                  onClick={() => setIsComparisonOpen(true)}
                  disabled={
                    state.selectedItems.length === 0 ||
                    state.isMarkedForComparison ||
                    state.loading ||
                    !state.isDataLoaded
                  }
                >
                  <Badge
                    badgeContent={comparisonIds.length}
                    color="secondary"
                    overlap="rectangular"
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <FontAwesomeIcon
                      icon={faThumbtack as IconProp}
                      style={{ color: '#e14748' }}
                      size="sm"
                      className={
                        state.selectedItems.length === 0 ||
                        state.isMarkedForComparison ||
                        state.loading ||
                        !state.isDataLoaded
                          ? classes.refreshDisabled
                          : classes.refresh
                      }
                    />
                  </Badge>
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip id="refreshButton" title="Run Analysis">
              <span>
                <IconButton
                  className={classes.sync}
                  onClick={handleRequestAnalysis}
                  //{state.isLastAnalysis? setAskSinglePoint: handleSync}
                  size="small"
                  disabled={
                    state.selectedItems.length === 0 ||
                    (state.networkType === 'dte' && !state.parameters.isOrbital)
                  }
                >
                  <PlayCircleFilled
                    style={{ color: theme.palette.primary.main }}
                    className={
                      state.selectedItems.length === 0
                        ? classes.refreshDisabled
                        : classes.refresh
                    }
                  />
                </IconButton>
              </span>
            </Tooltip>
            {state.loading && (
              <Tooltip id="refreshButton" title="Show Loading Screen">
                <span>
                  <IconButton
                    className={classes.sync}
                    onClick={() => {
                      setHideLoading(false);
                    }}
                    size="small"
                    disabled={!hideLoading}
                  >
                    <CircularProgress
                      variant={'indeterminate'}
                      size={20}
                      thickness={8}
                    />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Box>
          <Box flexGrow={1} />
          <Box mr={2}>
            <Settings />
          </Box>
          <Box>
            <IconButton
              color="inherit"
              onClick={handleModal}
              className={classes.tab}
            >
              <Icon
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <img
                  alt="help"
                  style={{
                    height: '1em',
                    fontSize: '0.875rem'
                  }}
                  src="/static/icons/help.svg"
                />
              </Icon>
            </IconButton>
            <IconButton
              size="small"
              onClick={handleMenu}
              className={classes.tab}
              style={{ borderRadius: 0 }}
            >
              <Avatar
                style={{
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.component.main,
                  border: `1px solid ${theme.palette.border.main}`
                }}
              >
                {user &&
                  user.split(' ').length > 1 &&
                  user.split(' ')[0].charAt(0).toUpperCase() +
                    user.split(' ')[1].charAt(0).toUpperCase()}
                {user &&
                  user.split(' ').length === 1 &&
                  user.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              style={{ marginTop: '3rem' }}
            >
              <MenuItem>
                <Link
                  to="./"
                  onClick={handleManageAccount}
                  className={classes.item}
                >
                  <AccountCircle fontSize="large" color="primary" />
                  Account Settings
                </Link>
              </MenuItem>
              {/* <MenuItem>
                <Link to="#" className={classes.item}>
                  <Work fontSize="large" className={classes.icon} />
                  User Preferences
                </Link>
              </MenuItem> */}
              {isEngineer && (
                <MenuItem>
                  <Link
                    to="/statistics-dashboard"
                    target="_blank"
                    className={classes.item}
                  >
                    <Timeline fontSize="large" color="primary" />
                    Engineer Dashboard
                  </Link>
                </MenuItem>
              )}
              <MenuItem>
                <Link to="/signin" onClick={logout} className={classes.item}>
                  <ExitToApp fontSize="large" color="primary" />
                  Log Out
                </Link>
              </MenuItem>
              <hr></hr>
              <div className={classes.versionFormat}>
                CART Version: v{version}
              </div>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
      <HelpModal open={isModal} onOpen={handleModal} />
      {isComparisonOpen && (
        <ComparisonModal
          open={isComparisonOpen}
          onOpen={() => setIsComparisonOpen(!isComparisonOpen)}
          markForComparison={markForComparison}
          selectedItems={state.selectedItems}
        />
      )}
      <ManageAccounts open={manageAcctVisible} onOpen={handleManageAccount} />
    </AppBar>
  );
};

export default Header;
