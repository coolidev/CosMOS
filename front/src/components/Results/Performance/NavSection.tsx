import React, { FC } from 'react';
import { Typography, Box, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { Accordion, AccordionSummary } from '../Accordion';
import type {
  PerformancePanel,
  RelayCharacteristics
} from 'src/types/evaluation';
import type { State } from 'src/pages/home';
import { getGNSSAvailability } from 'src/algorithms/nav';
import { Theme } from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
  parameter: {
    borderBottom: `1px solid ${theme.palette.background.paper}`
  },
  resultComponent: {
    width: '15%'
  }
}))

interface NavProps {
  data: PerformancePanel;
  state: State;
}

const NavSection: FC<NavProps> = ({ state, data }) => {
  const classes = useStyles()  

  return (
    <Box>
      <ListItem className={classes.parameter}>
        <ListItemText
          primary={
            <React.Fragment>
              <Typography
                variant="body1"
                component="p"
                color="textPrimary"
              >
                Tracking Accuracy (m)
              </Typography>
            </React.Fragment>
          }
        />
        <Box flexGrow={1} />
        <Box className={classes.resultComponent}>{state.isDataLoaded ? (state.networkType === 'relay' ? (data?.systemParams as RelayCharacteristics)?.trackingAccuracy : 'N/A') : '...'}</Box>
      </ListItem>
      <ListItem className={classes.parameter}>
        <ListItemText
          primary={
            <React.Fragment>
              <Typography
                variant="body1"
                component="p"
                color="textPrimary"
              >
                GNSS Availability
              </Typography>
            </React.Fragment>
          }
        />
        <Box flexGrow={1} />
        <Box className={classes.resultComponent}>{state.isDataLoaded ? getGNSSAvailability(state.parameters.altitude) : '...'}</Box>
      </ListItem>
    </Box>
  );
};

export default NavSection;
