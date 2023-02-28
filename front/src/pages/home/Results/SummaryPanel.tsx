import { makeStyles, Theme} from "@material-ui/core";
import { FC, useState } from "react";
import ParameterSummary from "src/components/Results/SummaryPanel/ParameterSummary";
import NetworkSelectionSummary from "src/components/Results/SummaryPanel/NetworkSelectionSummary";
import AnalysisParametersSummary from "src/components/Results/SummaryPanel/AnalysisParametersSummary";
import { State } from "..";
import { useSelector } from "src/store";

interface SummaryPanelProps {
    visible: boolean
    state: State
    onState: any,
    analysisType: string;
  };
  
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      overflowY: 'scroll',
    },
    hide: {
      display: 'none'
    }
  }));
  
  const SummaryPanel: FC<SummaryPanelProps> = ({
    visible,
    state,
    onState,
    analysisType
    }) => {

    const classes = useStyles();
    const [accordion, setAccordion] = useState({params: true, networkSelection: false, analysisParameters: false});
    const { zoom } = useSelector((state) => state.zoom);

    
    return (
        <div className={visible? classes.root:classes.hide} style={{minHeight:((window.screen.availHeight / zoom) * 0.765), maxHeight: ((window.screen.availHeight / zoom) * 0.765)}}>
            <ParameterSummary
              parameters = {state.parameters}
              missionTime = {{
                launchDate: (state.constraints.launchMonth?? new Date().getMonth()+1) + '/' + (state.constraints.launchYear), 
                endDate: (state.constraints.launchMonth?? new Date().getMonth()+1) + '/' + (state.constraints.endYear?? state.constraints.launchYear + 10)}}
              commsSpecs = {state.commsSpecs}
              accordion = {accordion}
              setAccordion = {setAccordion}
              networkType = {state.networkType}
              constraints = {state.constraints}
              selectedItems = {state.selectedItems}
            />
            <NetworkSelectionSummary
              accordion = {accordion}
              setAccordion = {setAccordion}
              selectedNetworks = {state.selectedItems}
              networkType = {state.networkType}
            />
            {analysisType === 'point' &&
              <AnalysisParametersSummary
                accordion = {accordion}
                setAccordion = {setAccordion}
                parameters = {{timeStep: {}, altitudeStep: state.step.altitudeStep, inclinationStep: state.step.inclinationStep, eccentricityStep: state.step.eccentricityStep}}
                networkType = {state.networkType}
                parametric = {state.parametric}
                startDate = {new Date(state.constraints.launchYear, state.constraints.launchMonth? state.constraints.launchMonth-1: 11)}
                eccentricity = {state.parameters.orbitState === 1}
                step = {state.step}
              />
            }
        </div>
        
    );
  };
  
  export default SummaryPanel;