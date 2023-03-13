/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { updateResults } from 'src/slices/results';
import _ from 'underscore';
import {
  Box,
  makeStyles,
  Typography,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Icon,
  Grid,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  withStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import type { State } from 'src/pages/home';
import type { Theme } from 'src/theme';
import Modulation from './Modulation';

interface NetworkPanelProps {
  state: State;
  onState: (name: string, value: any) => void;
  handleClear: any;
  onBounds: (name: string, type: string, value: number) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.text.primary,
  },
  title: {
    textAlign: 'center',
    cursor: 'default',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none'
  },
  box: {
    margin: theme.spacing(0, 5, 0, 5),
    backgroundColor: theme.palette.background.light,
    borderRadius: "8px",
    borderTop: `1px solid ${theme.palette.border.main}`,
    borderRight: `1px solid ${theme.palette.border.main}`,
    borderLeft: `1px solid ${theme.palette.border.main}`,
    borderBottom: `1px solid ${theme.palette.border.main}`,
    overflowY: 'auto',

  },
  listBox: {
  },
  none: {
    display: 'flex',
    borderRadius: 8,
  },
  item: {
    paddingTop: 0,
    paddingBottom: 0,
    // backgroundColor: theme.palette.component.main,
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none'
  },
  iconBtn: {
    padding: 0
  },
  divider: {
    backgroundColor: theme.palette.border.main
  },
  radio: {
    color: theme.palette.border.main
  },
  placeholder: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '12px',
    lineHeight: '14px',
    letterSpacing: '0.05em',

    color: `${theme.palette.text.secondary}`,
  },
  icon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit'
  },
  special: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '16px',

    color: theme.palette.border.main,
  },
}));

const Accordion = withStyles({
  root: {
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.light,
    borderBottom: theme.palette.border.main,
    padding: 0,
    marginBottom: 0,
    // minHeight: 56,
    '&$expanded': {
      // minHeight: 56,
    },
  },
  content: {
    margin: '0',
    borderBottom: `1px solid ${theme.palette.border.main}`,
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const NetworkPanel: FC<NetworkPanelProps> = ({ state, onState, handleClear, onBounds }) => {
  const classes = useStyles();
  const { zoom } = useSelector((state) => state.zoom);
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Set the currently selected item to null
    // if no systems are in the selection list.
    if (state.selectedItems.length === 0) {
      onState('radioButtonSelectionId', 0);
      return;
    }

    // If the currently selected item is null, set
    // it to the first item in the selection list.
    state.radioButtonSelectionId === 0 &&
      onState('radioButtonSelectionId', state.selectedItems[0].id);

    // If every system in the selection list has the `supportedFrequencies`
    // parameter set to some value, filter out any potential duplicate items.
    // NOTE: Currently, only ground stations have the `supportedFrequencies`
    // parameter.
    if (
      state.selectedItems.every((item) => Boolean(item?.supportedFrequencies))
    ) {
      // Removes duplicate entries from the list of ground stations and relays.
      let selectedItems = state.selectedItems;
      const numberOfItemsBeforeFiltering = selectedItems.length;
      selectedItems = selectedItems.filter(
        (e, i) => selectedItems.findIndex((a) => a.id === e.id) === i
      );

      // If some items were filtered out of the list, update the
      // selected items.
      numberOfItemsBeforeFiltering !== selectedItems.length &&
        onState('selectedItems', selectedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedItems]);

  useEffect(() => {
    // If nothing is selected, set frequency bands and
    // network type to null.
    if (state.radioButtonSelectionId > 0 || state.selectedItems.length > 0)
      return;

    onState('networkType', null);
    onState('noRegression', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.radioButtonSelectionId, state.selectedItems]);

  // Removes a selected system (relay or ground station) from the
  // selection list.
  const handleDelete = (event) => {
    onState('isDataLoaded', false);

    const { name } = event.currentTarget;

    const newSelectedItems = state.selectedItems.filter(
      (item) => item.id !== parseInt(name)
    );

    // If the item being deleted is the currently selected item,
    // select another one, or indicate that no item is currently
    // selected.
    if (parseInt(name) === state.radioButtonSelectionId) {
      if (newSelectedItems.length > 0) {
        onState('radioButtonSelectionId', newSelectedItems[0].id);
      } else {
        onState('radioButtonSelectionId', 0);
      }
    }

    // Clear results returned from last API call.
    dispatch(updateResults());

    onState('selectedItems', newSelectedItems);
    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
    onState('isLastAnalysis', false);
    onState('isDataLoaded', false);
  };

  // Called when the radio button selection is changed.
  const handleChange = (event): void => {
    const { name } = event.currentTarget;

    // Sets the selected system (relay or ground station).
    onState('radioButtonSelectionId', parseInt(name));
    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
  };

  // Responsible for triggering the Antenna Modal open
  // event when the antenna name under the ground station
  // is clicked.
  const handleRowClick = (event): void => {

  };

  // Opens and closes the Antenna Modal.
  // NOT CURRENTLY USED
  const handleOpen = (): void => setOpen(!open);

  return (
    <Grid className={classes.root}>
      {/* <Box
        // className={clsx(classes.box, classes.listBox)}
        // style={{ height: (window.screen.availHeight / zoom) * 0.75 }}
      > */}
      {state.selectedItems.length > 0 ? (
        <>
          <Grid container spacing={0}>
            <Grid item xs={2}>
              <IconButton onClick={handleClear} disabled={state.loading}>
                <Icon>
                  <img
                    alt="Custom Icon"
                    className={classes.icon}
                    src={'/static/icons/Exit_Dropdown_Icon-Red-SVG.svg'}
                  />
                </Icon>
              </IconButton>
            </Grid>
            <Grid item xs={10} alignItems="center" style={{ display: 'flex' }}>
              <Typography className={classes.special}>
                Clear all Selections
              </Typography>
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          {state.selectedItems.map((item, i) => (
            <Accordion square key={i}
              // expanded={state.radioButtonSelectionId === item.id}
            >
              <AccordionSummary>
                <ListItem>
                  {/* <Radio
                    name={item.id.toString()}
                    checked={state.radioButtonSelectionId === item.id}
                    onChange={handleChange}
                    className={classes.radio}
                    disabled={state.loading}
                  /> */}
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        component="h6"
                        color="textPrimary"
                      >
                        {item?.system ?? item.name}
                      </Typography>
                    }
                    secondary={
                      item?.supportedFrequencies ??
                      `Antenna: ${item.antennaName ?? 'Auto-Select'}`
                    }
                    onClick={item?.supportedFrequencies && handleRowClick}
                  />
                  <Box flexGrow={1} />
                  <IconButton
                    name={item.id.toString()}
                    className={classes.iconBtn}
                    onClick={handleDelete}
                    disabled={state.loading}
                    size="small"
                  >
                    <CloseIcon color={'primary'} />
                  </IconButton>
                </ListItem>
              </AccordionSummary>
              <AccordionDetails>
                <Modulation
                  state={state}
                  onState={onState}
                  onBounds={onBounds}
                />
              </AccordionDetails>
            </Accordion>

          ))}
        </>
      ) : (
        <Grid container spacing={0}>
          <Grid item xs={2}>
            <IconButton onClick={handleClear} disabled={state.loading}>
              <Icon>
                <img
                  alt="Custom Icon"
                  className={classes.icon}
                  src={'/static/icons/Exit_Dropdown_Icon-Red-SVG.svg'}
                />
              </Icon>
            </IconButton>
          </Grid>
          <Grid item xs={10} alignItems="center" style={{ display: 'flex' }}>
            <Typography className={classes.special}>
              Clear all Selections
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item xs={12} style={{ paddingTop: '15vh' }}>
            <Typography className={classes.placeholder} align={'center'}>
              <i>*Right-click and Select a Network or <br />Ground Station to add to this list.</i>
            </Typography>
          </Grid>
        </Grid>
      )}
      {/* </Box> */}
    </Grid>
  );
};

export default NetworkPanel;
