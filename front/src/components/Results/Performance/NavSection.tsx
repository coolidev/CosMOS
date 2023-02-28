import { FC } from 'react';
import { Typography, Box } from '@material-ui/core';
import { Accordion, AccordionSummary } from '../Accordion';
import type {
  PerformancePanel,
  RelayCharacteristics
} from 'src/types/evaluation';
import type { State } from 'src/pages/home';
import { getGNSSAvailability } from 'src/algorithms/nav';

interface NavProps {
  data: PerformancePanel;
  state: State;
}

const NavSection: FC<NavProps> = ({ state, data }) => {
  return (
    <Box my={2} mx={4}>
      <Accordion expanded={false}>
        <AccordionSummary
          aria-controls="trackingAccuracy-content"
          id={`trackingAccuracy`}
        >
          <Typography style={{ width: '95%' }}>
            Tracking Accuracy (m):{' '}
            {state.isDataLoaded
              ? state.networkType === 'relay'
                ? (data?.systemParams as RelayCharacteristics)?.trackingAccuracy
                : 'N/A'
              : '-'}
          </Typography>
        </AccordionSummary>
      </Accordion>
      <Accordion expanded={false}>
        <AccordionSummary
          aria-controls="gnss-availability-content"
          id={`gnss-availability`}
        >
          <Typography style={{ width: '95%' }}>
            GNSS Availability:{' '}
            {state.isDataLoaded
              ? getGNSSAvailability(state.parameters.altitude)
              : '-'}
          </Typography>
        </AccordionSummary>
      </Accordion>
    </Box>
  );
};

export default NavSection;
