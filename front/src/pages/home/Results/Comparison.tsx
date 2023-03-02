/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import {
  colors,
  makeStyles,
  // useTheme
} from '@material-ui/core';
import { useSelector } from 'src/store';
import { useWindowSize } from 'src/utils/util';
import {
  CompareHeader,
  CompareTable
} from 'src/components/Results';
import type { State } from 'src/pages/home';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { COMPARISON_TABLE_TERRESTRIAL, COMPARISON_TABLE_ORBITAL } from 'src/utils/constants/comparison';
import { IComparisonType, Status } from 'src/types/comparison';
import { ComparisonResult } from 'src/slices/pinnedResults';
import { GroundStationCharacteristics, RelayCharacteristics } from 'src/types/evaluation';
import { getGNSSAvailability } from 'src/algorithms/nav';
import { getOrbitalModelValue, getValue } from 'src/algorithms/regressions';
import { AntennaInputs, computeDipoleSize, computeHelicalSize, computeParabolicDiameter, computeParabolicMass, computePatchSize, computeSteerableSize } from 'src/algorithms/antennas';
interface ComparisonProps {
  state: State;
  onState: (name: string, value: any) => void;
  visible: boolean;
}

const initialStatus: Status = {
  page: 1,
  perPage: 5,
  totalPage: 1,
  isSize: true,
  width: '150px',
  disabled: false,
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    backgroundColor: theme.palette.component.main
  },
  hide: {
    display: 'none',
  },
  dialog: {
    maxWidth: '500px',
    minHeight: '55vh'
  },
  title: {
    margin: 0,
    padding: theme.spacing(4),
    backgroundColor: THEMES.DARK
      ? theme.palette.background.light
      : colors.grey[200]
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.background.dark
  },
  select: {
    verticalAlign: 'middle',
    backgroundColor: theme.palette.background.light,
    border: `1px solid ${theme.palette.border.main}`,
    color: `${theme.palette.text.primary} !important`,
    '& .MuiSelect-iconOutlined': {
      color: theme.palette.border.main
    }
  }
}));

// Group names
export const PARAMETERS_NAME = 'Parameters';
export const RANKING_NAME = 'Ranking';
export const PERFORMANCE_NAME = 'Performance';
export const ANTENNA_OPTIONS_NAME = 'User Burden: Antenna Options';
export const MISSION_IMPACTS_NAME = 'User Burden: Mission Impacts';
export const NAV_AND_TRACKING_NAME = 'Nav and Tracking';

const Comparison: FC<ComparisonProps> = ({ state, onState, visible }) => {
  const size = useWindowSize();
  // const theme = useTheme<Theme>();
  const [status, setStatus] = useState(initialStatus);
  const [source, setSource] = useState<IComparisonType>();

  const [initialPins, setInitialPins] = useState<ComparisonResult[]>([])
  const [initialData, setInitialData] = useState<IComparisonType>();

  const [refresh, setRefresh] = useState<boolean>(false);

  const {pinnedResults} = useSelector((state) => state.pinnedResults);
  const {performancePanel} = useSelector((state) => state.results);

  const classes = useStyles();

  useEffect(() => {
    const initializeData = async () => {
      try {
        setInitialPins(pinnedResults);
        setInitialData(formatForComparison(pinnedResults));
        setStatus((prevState) => ({
          ...prevState,
          page: Math.ceil(pinnedResults.length / status.perPage)
        }))
      }
      catch (e) {
        console.log(e)
        throw e;
      }
    }
    initializeData();
  }, [])

  useEffect(() => {
    if (initialData !== undefined) {
      const buffer = {
        tableStructure: initialData.tableStructure,
        columnData: initialData.columnData.filter((column, index) => index >= (status.page - 1) * status.perPage && index < status.page * status.perPage),
        columnSequence: initialData.columnSequence
      }
      setSource(buffer)
    }
  }, [initialData, status])

  useEffect(() => {
    if(performancePanel){
      //Basically, just borrowing the code from the header to update the data based on the analysis
      const KEYS = {
        coverage: state.networkType === "relay"? "coverage" : "coverageMinutes",
        mean_contacts: state.networkType === "relay"? "mean_contacts" : "contactsPerDay",
        mean_coverage_duration: state.networkType === "relay"? "mean_coverage_duration" : "averageCoverageDuration",
        average_gap: state.networkType === "relay"? "average_gap" : "averageGapDuration",
        max_gap: state.networkType === "relay"? "max_gap" : "maxGapDuration",
        mean_response_time: state.networkType === "relay"? "mean_response_time" : "meanResponseTime",
        availability: state.networkType === "relay"? "availability" : "availability_gap"
      }

      let currentComparison: ComparisonResult = {
        name: "Current Analysis",
        id: -1,
        parameters: {
          altitude: state.parameters.isOrbital? state.parameters.altitude: null,
          inclination: state.parameters.isOrbital? state.parameters.inclination: null,
          eccentricity: state.parameters.isOrbital? state.parameters.eccentricity: null,
          frequencyBand: state.commsSpecs.freqBand,
          modulation: state.commsSpecs.commsPayloadSpecs.modulation, //might be stored somewhere different, if buggy check this 
          coding: state.commsSpecs.commsPayloadSpecs.coding, //might be stored somewhere different, if buggy check this
          standardsCompliance: state.commsSpecs.standardsCompliance, //might be stored somewhere different, if buggy check this
          latitude: !state.parameters.isOrbital? state.parameters.latitude: null,
          longitude: !state.parameters.isOrbital? state.parameters.longitude: null
        },
        performance: {
          rfCoverage: getResultsFromPerfromancePanel(KEYS.coverage),
          meanContacts: getResultsFromPerfromancePanel(KEYS.mean_contacts),
          meanContactDuration: getResultsFromPerfromancePanel(KEYS.mean_coverage_duration),
          averageGap: getResultsFromPerfromancePanel(KEYS.average_gap),
          maxGap: getResultsFromPerfromancePanel(KEYS.max_gap),
          meanResponseTime: getResultsFromPerfromancePanel(KEYS.mean_response_time),
          effectiveCommsTime: !isNaN(getResultsFromPerfromancePanel(KEYS.availability))? getResultsFromPerfromancePanel(KEYS.availability): 0, //See header for why this one doesnt work
          dataRate: (state.results.dataRate_kbps/1000),
          throughput: (state.results.maxThroughput_Gb_Day/8)
        },
        antennaOptions: {
          eirp: (!state.commsSpecs.commsPayloadSpecs.minEIRPFlag)?  (state.commsSpecs.commsPayloadSpecs.eirp): state.results.eirp_dBW,
          parabolicAntennaDiameter: getAntennaResults("parabolicDiameter"),
          parabolicAntennaMass: getAntennaResults("parabolicMass"),
          electronicAntennaSize: getAntennaResults("steerableSize"),
          helicalAntennaHeight: getAntennaResults("helicalHeight"),
          patchAntennaSize: getAntennaResults("patchSize"),
          dipoleAntennaSize: getAntennaResults("dipoleSize")
        },
        navAndTracking: {
          trackingAccuracy: 
            state.networkType === 'relay'
            ? (performancePanel.systemParams as RelayCharacteristics)?.trackingAccuracy.toString()
            : "N/A",
          gnssAvailability: getGNSSAvailability(state.parameters.altitude)
        }
      }
      const newCompArray = initialPins.slice();
      newCompArray.unshift(currentComparison);
      setSource(formatForComparison(newCompArray));
      setRefresh(!refresh);
    } else {
      setSource(formatForComparison(initialPins));
      setRefresh(!refresh);
    }
  }, [performancePanel])

  useEffect(() => {
    setInitialPins(pinnedResults);
    setSource(formatForComparison(pinnedResults));
    setRefresh(!refresh);
  }, [pinnedResults])

  const getResultsFromPerfromancePanel = (key: string) => {
    let value;
    let name = state.networkType === "relay"? (performancePanel.systemParams as RelayCharacteristics).systemName: (performancePanel.systemParams as GroundStationCharacteristics).systemName
    if(state.pointSync || state.parametric){
      let data = performancePanel.modelData
      value = getOrbitalModelValue(
        state.parameters.altitude,
        state.parameters.inclination,
        key,
        data,
        name.toString()
        );
    } else {
      let data = performancePanel.predictedData
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
  }

  const USER_BURDEN_FUNCS = {
    parabolicDiameter: computeParabolicDiameter,
    parabolicMass: computeParabolicMass,
    steerableSize: computeSteerableSize,
    helicalHeight: computeHelicalSize,
    patchSize: computePatchSize,
    dipoleSize: computeDipoleSize
  };

  const getAntennaResults = (key: string) => {
    let wavelength_m =
       (
        performancePanel.systemParams as
          | RelayCharacteristics
          | GroundStationCharacteristics
      )?.lambda
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
  }

  // useEffect(() => {
  //   size.width > 1200 &&
  //     status.isSize &&
  //     setStatus((prevState) => ({
  //       ...prevState,
  //       isSize: false,
  //       perPage: status.perPage + 2
  //     }));

  //   size.width <= 1200 &&
  //     !status.isSize &&
  //     setStatus((prevState) => ({
  //       ...prevState,
  //       isSize: true,
  //       perPage: status.perPage - 2
  //     }));

  //   setStatus((prevState) => ({
  //     ...prevState,
  //     width: (size.width - 0.15 * size.width - 420) / 6 + 'px'
  //   }));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [size]);

  //This inevitably large and nasty function will convert the neat Comparison Results object into the
  //obtuse structre required to make the comparison panel work
  //Be greatful that it is this simple; it was way worse before this
  const formatForComparison = (pinnedResults: ComparisonResult[]) => {
    //This entire preliminary setting thing is basically hard coding all of the columns into the comparison panel
    //We can think of another way of doing this later if we want, but for now if we want to add another column to the comparison
    //panel, this is where it needs to go.
    //This also needs to be moved to a 
    let comparisonFormat: IComparisonType = state.parameters.isOrbital? COMPARISON_TABLE_ORBITAL: COMPARISON_TABLE_TERRESTRIAL;

    //This confusing hunk is supposed to get the column data without it being a huge mess everywhere
    let columnData = []
    pinnedResults.forEach((comparison, index) => {
        let column = {
          name: comparison.name,
          key: comparison.id?? index,
          data:[]
        };
        let subcolumnData = [];
        comparisonFormat.tableStructure.group.forEach((section) => {
          section.items.forEach((column) => {
            let dataPoint = {
              key: column.key,
              value: pinnedResults[index][section.key][column.key]
            };
            subcolumnData.push(dataPoint);
          })
        })
        column.data = subcolumnData;
        columnData.push(column);
    })
    comparisonFormat.columnData = columnData;
    return comparisonFormat;
  }

  const handleStatus = (values: Status) => setStatus(values);

  return (
    <div className={visible ? classes.root : classes.hide}>
      <CompareHeader
        status={status}
        onStatus={handleStatus}
        handleDialog={() => { }}
        disabled={state.radioButtonSelectionId === 0}
      />
      <CompareTable
        state={state}
        status={status}
        source={source}
        refresh = {refresh}
      />
    </div>
  );
};

export default Comparison;
