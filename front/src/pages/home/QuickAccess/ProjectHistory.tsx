import { FC, Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Radio,
  colors,
  makeStyles,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Grid
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import type { ISave } from 'src/types/preference';
import { Language } from '@material-ui/icons';
import type { Theme } from 'src/theme';
import { useSelector } from 'src/store';

interface ProjectHistoryProps {
  result: ISave;
  source: ISave[];
  checked: any;
  onDelete: (name: string) => void;
  onCheck: (event) => void;
  onBaseLine: (id: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: '#fff'
  },
  title: {
    fontStyle: 'italic',
    fontWeight: 'normal'
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontStyle: "normal",
    fontSize: "21px",
    lineHeight: "25px",
    display: "flex",
    alignItems: "center",
    color: theme.palette.border.main,
    paddingTop: '1rem',
    paddingLeft: '.5vw',
    borderBottom: `4px solid ${theme.palette.border.main}`,
  },
  box: {
    backgroundColor: theme.palette.background.light,
    border: `2px solid ${theme.palette.border.main}`,
    // marginTop: theme.spacing(3),
    // userSelect: 'none',
    // MozUserSelect: 'none',
    // WebkitUserSelect: 'none',
    // msUserSelect: 'none',
    // cursor: 'pointer',
    borderRadius: "0px 0px 8px 8px"
  },
  boxUnselected: {
    backgroundColor: theme.palette.background.light,
    // border: `1px solid ${theme.palette.border.main}`,
    // marginTop: theme.spacing(3),
    // userSelect: 'none',
    // MozUserSelect: 'none',
    // WebkitUserSelect: 'none',
    // msUserSelect: 'none',
    // cursor: 'default',
    borderRadius: 6
  },
  panel: {
    backgroundColor: theme.palette.background.light,
    overflowY: 'auto',
  },
  icon: {
    color: colors.green[500]
  },
  iconDeselected: {
    color: colors.lightBlue[700]
  },
  smallIcon: {
    color: theme.palette.primary.main
  },
  item: {
    paddingTop: '0.5rem',
    paddingBottom: 0
  },
  iconBtn: {
    padding: 0
  },
  divider: {
    backgroundColor: theme.palette.border.main
  },
  button: {
    border: 'none !important',
    borderRadius: '0 0 8px 8px',
    color: `#FFFFFF !important`,
    backgroundColor: '#E34747'
  },
  buttonDisabled: {
    border: 'none !important',
    borderRadius: '0 0 8px 8px',
    color: `#FFFFFF !important`,
    backgroundColor: '#E34747'
  },
  radio: {
    color: theme.palette.border.main
  },
}));

const ProjectHistory: FC<ProjectHistoryProps> = ({
  result,
  source,
  checked,
  onDelete,
  onCheck,
  onBaseLine
}) => {
  const classes = useStyles();
  const { zoom } = useSelector((state) => state.zoom);

  const handleBaseLine = (): void => onBaseLine(result.id);

  const [baselineId, setBaselineId] = useState<string>(
    source.filter((save) => save.isBaseline)[0]?.id ?? null
  );
  const [baselineSave, setBaselineSave] = useState<ISave>(null);

  const handleDelete = (event): void => {
    if (event.currentTarget.name === baselineId) {
      alert(
        'You cannot delete your baseline save. Please change your baseline selection to delete this configuration.'
      );
      return;
    }
    onDelete(event.currentTarget.name);
  };

  useEffect(() => {
    setBaselineId(source.filter((save) => save.isBaseline)[0]?.id ?? null);
    setBaselineSave(source.filter((save) => save.isBaseline)[0] ?? null);
  }, [source]);

  return (
    <div className={classes.root}>
      <Box className={classes.box}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Typography className={classes.subtitle}>
              Baseline
            </Typography>
          </Grid>
          <Grid item xs={12}
            onClick={() =>
              baselineId
                ? result.id === baselineId
                  ? null
                  : onCheck({ target: { name: baselineId } } as unknown as Event)
                : null
            }
          >
            <List>
              <Tooltip placement="bottom-end" arrow
                title={
                  `${baselineSave?.parameters.isOrbital
                    ? `${baselineSave?.parameters.altitude} km Altitude, ${baselineSave?.parameters.inclination}° Inclination`
                    : `${baselineSave?.parameters.latitude}° Latitude, ${baselineSave?.parameters.longitude}° Longitude`}
                    ${baselineSave?.selectedNetworks[0]?.antennaId && baselineSave?.selectedNetworks.length>1 
                      ? `- ${baselineSave.selectedNetworks.map((item) => {return item.name}).join(`, `)}`
                      : ''}`
                }
              >
                <ListItem className={classes.item}>
                  <ListItemAvatar>
                    {result.id === baselineId ? (
                      <CheckIcon fontSize="large" className={classes.icon} />
                    ) : (
                      <Language fontSize="large" color="primary" />
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        component="h6"
                        color="textPrimary"
                        style={{ fontWeight: 'normal' }}
                      >
                        {baselineId
                          ? `${
                              !baselineSave?.selectedNetworks[0]?.name
                                ? 'No Selections'
                                : baselineSave?.selectedNetworks[0]?.antennaId
                                  ? `DTE Network - 
                                    ${baselineSave?.selectedNetworks.length > 1 
                                      ? baselineSave.selectedNetworks.length 
                                      : baselineSave.selectedNetworks[0]?.name}
                                    ${baselineSave.selectedNetworks.length > 1 ? ' Selected Stations' : ''}`
                                  : `Relay Network - ${baselineSave?.selectedNetworks[0]?.name}`
                            }`
                          : 'No Baseline Found'}
                      </Typography>
                    }
                    secondary={
                      result.id === baselineId
                        ? 'Currently Viewing'
                        : 'Click to Load Baseline'
                    }                
                  />
                </ListItem>
              </Tooltip>
            </List>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.subtitle}>
              Saved configurations
            </Typography>
          </Grid>
          <Grid item xs={12}
            className={classes.panel}
            style={{
              minHeight: window.screen.availHeight*(.45/zoom)
            }}
          >
            <List>
              {source
                .filter((item) => !item.isCompared)
                .reverse()
                .map((item, i) => (
                  <Fragment key={i}>
                    <ListItem className={classes.item}>
                      <Radio
                        name={item.id}
                        checked={item.id === checked}
                        onChange={onCheck}
                        className={classes.radio}
                      />
                      <Tooltip placement="bottom-end" arrow
                        title={
                          `${item?.parameters.isOrbital
                            ? `${item?.parameters.altitude} km Altitude, ${item?.parameters.inclination}° Inclination`
                            : `${item?.parameters.latitude}° Latitude, ${item?.parameters.longitude}° Longitude`}
                            ${item?.selectedNetworks[0]?.antennaId && item?.selectedNetworks.length>1 
                              ? `- ${item.selectedNetworks.map((item) => {return item.name}).join(`, `)}`
                              : ''}`
                        }
                      >
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            component="h6"
                            color="textPrimary"
                            style={{ fontWeight: 'normal' }}
                          >
                            {moment
                              .unix(item.dateTime)
                              .format('MMM DD, YYYY - h:mm A')}
                          </Typography>
                        }
                        secondary={`${
                          item.id === 'project-created'
                            ? 'Project Created'
                            : item.id === checked
                            ? 'Current Configuration'
                            : `${
                              !item?.selectedNetworks[0]?.name
                                ? 'No Selections'
                                : item?.selectedNetworks[0]?.antennaId
                                  ? `DTE Network - 
                                    ${item?.selectedNetworks.length > 1 
                                      ? item.selectedNetworks.length 
                                      : item.selectedNetworks[0]?.name}
                                    ${item.selectedNetworks.length > 1 ? ' Selected Stations' : ''}`
                                  : `Relay Network - ${item?.selectedNetworks[0]?.name}`
                              }`
                        }`}
                      />
                      </Tooltip>
                      <Box flexGrow={1} />
                      <Tooltip title="Delete This Save" arrow>
                        <IconButton
                          name={item.id}
                          className={classes.iconBtn}
                          onClick={handleDelete}
                          hidden={item.id === 'project-created'}
                        >
                          {item.id === baselineId ? (
                            <CheckIcon
                              fontSize="large"
                              className={classes.icon}
                            />
                          ) : (<CloseIcon
                              fontSize="large"
                              className={classes.smallIcon}
                            />)}
                          
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                    <Divider className={classes.divider} />
                  </Fragment>
                ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant={'outlined'}
              disabled={result.id === baselineId}
              className={
                result.id === baselineId ? classes.buttonDisabled : classes.button
              }
              onClick={handleBaseLine}
              fullWidth
            >
              Set Selected as Baseline
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ProjectHistory;
