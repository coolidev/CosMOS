import { Button, Grid, makeStyles } from "@material-ui/core";
import { FC, useState } from "react";
import ParameterSummary from "src/components/Results/SummaryPanel/ParameterSummary";
import NetworkSelectionSummary from "src/components/Results/SummaryPanel/NetworkSelectionSummary";
import AnalysisParametersSummary from "src/components/Results/SummaryPanel/AnalysisParametersSummary";
import { State } from "..";
import { useDispatch, useSelector } from "src/store";
import { updateResults } from "src/slices/results";
import { PlayCircleFilled } from "@material-ui/icons";
import type { Theme } from 'src/theme';

interface SummaryPanelProps {
  visible: boolean
  state: State
  onState: any,
  analysisType: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
  },
  hide: {
    display: 'none'
  },
  analysisButton: {
    color: theme.palette.border.main,
    padding: '0.5rem 1.5rem',
  }
}));

const SummaryPanel: FC<SummaryPanelProps> = ({
  visible,
  state,
  onState,
  analysisType
}) => {

  const classes = useStyles();
  const [accordion, setAccordion] = useState({ params: true, networkSelection: false, analysisParameters: false });
  const { zoom } = useSelector((state) => state.zoom);
  const dispatch = useDispatch();

  const runAnalysis = () => {
    dispatch(updateResults());
    onState('sync', true);
  }

  return (
    <Grid container className={visible ? classes.root : classes.hide}>
      <Grid item>
        {/* <Tooltip title="Run Analysis"> */}
        <Button
          onClick={runAnalysis}
          disabled={
            (state.noRegression && !state.pointSync && !state.parametric) || state.loading
          }
          className={classes.analysisButton}
          fullWidth
          size="large"
        >
          <span>
            <PlayCircleFilled />
            Run Analysis
          </span>
        </Button>
        {/* </Tooltip> */}
      </Grid>
      <ParameterSummary
        parameters={state.parameters}
        missionTime={{
          launchDate: (state.constraints.launchMonth ?? new Date().getMonth() + 1) + '/' + (state.constraints.launchYear),
          endDate: (state.constraints.launchMonth ?? new Date().getMonth() + 1) + '/' + (state.constraints.endYear ?? state.constraints.launchYear + 10)
        }}
        commsSpecs={state.commsSpecs}
        accordion={accordion}
        setAccordion={setAccordion}
        networkType={state.networkType}
        constraints={state.constraints}
        selectedItems={state.selectedItems}
      />
      <NetworkSelectionSummary
        accordion={accordion}
        setAccordion={setAccordion}
        selectedNetworks={state.selectedItems}
        networkType={state.networkType}
      />
      {analysisType === 'point' &&
        <AnalysisParametersSummary
          accordion={accordion}
          setAccordion={setAccordion}
          parameters={{ timeStep: {}, altitudeStep: state.step.altitudeStep, inclinationStep: state.step.inclinationStep, eccentricityStep: state.step.eccentricityStep }}
          networkType={state.networkType}
          parametric={state.parametric}
          startDate={new Date(state.constraints.launchYear, state.constraints.launchMonth ? state.constraints.launchMonth - 1 : 11)}
          eccentricity={state.parameters.orbitState === 1}
          step={state.step}
        />
      }
    </Grid>

  );
};

export default SummaryPanel;