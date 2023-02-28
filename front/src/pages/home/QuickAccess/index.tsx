import { FC, useEffect, useState } from 'react';
import { Box, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import { updatePreference } from 'src/slices/preference';
import { useSelector, useDispatch } from 'src/store';
import type { ISave } from 'src/types/preference';
import type { ICollapsed, State } from 'src/pages/home';
import ProjectHistory from './ProjectHistory';
import Mission from './Mission';
import Reports from 'src/pages/reports';
import { updateResults } from 'src/slices/results';
import type { Theme } from 'src/theme';
import { parseComma } from 'src/utils/util';

interface QuickAccessProps {
  currentTab: string;
  cache: ISave;
  state: State;
  bounds: { [key: string]: { min: number; max: number } };
  onBounds: (name: string, type: string, value: number) => void;
  setWizardIndex: any;
  onCache: (data: ISave) => void;
  onState: (name: string, value: any) => void;
  networkPanelStatus: ICollapsed;
  resultPanelCollapsed: boolean;
}

export interface ChangeProps {
  name: string;
  value: number;
  category: string;
}

const tabs = {
  mission: 'Mission',
  saves: 'Project History',
  report: 'Reports'
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(5)
  },
  divider: {
    backgroundColor: theme.palette.border.main
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    padding: "5px",
    gap: "1px",

    background: "#E34747",
    boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px 8px 0px 0px",

    fontFamily: 'Roboto',
    fontStyle: "normal",
    fontSize: "24px",
    color: "white",
  }
}));

const QuickAccess: FC<QuickAccessProps> = ({
  currentTab,
  state,
  cache,
  bounds,
  onBounds,
  setWizardIndex,
  onCache,
  onState,
  networkPanelStatus,
  resultPanelCollapsed,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [source, setSource] = useState<ISave[]>([]);
  const { preference } = useSelector((state) => state.preference);
  const { project } = useSelector((state) => state.project);
  const [saveCount, setSaveCount] = useState<number>(0);

  useEffect(() => {
    // Whenever the current project or the object containing all projects
    // is updated, set the ID for the current save to the most recent save.
    const saves = preference.project.find((item) => item.id === project)?.saves;
    const sorted =
      //@ts-ignore
      saves && [...saves]; //.sort((a, b) => b.isBaseline - a.isBaseline);

    if (sorted) {
      setSource(sorted);

      // Update the save ID. If a save is currently loaded, it likely means that
      // the preference object was modified due to a network being added for
      // comparison or removed from the comparison table. If this is the case,
      // we do not want to change the current state of the application, so we
      // do not load a save.
      const savesExceptIsCompared =
        saves && saves.filter((save) => !save.isCompared);
      const mostRecentSave =
        savesExceptIsCompared &&
        savesExceptIsCompared.length > 0 &&
        savesExceptIsCompared[savesExceptIsCompared.length - 1];
      if (
        !state.save ||
        savesExceptIsCompared.length > saveCount ||
        savesExceptIsCompared.length < 1
      ) {
        onState('save', mostRecentSave.id ?? '');
        setSaveCount(savesExceptIsCompared.length);
      }
    } else {
      setSource([] as ISave[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, preference]);

  useEffect(() => {
    // Whenever the ID of the loaded save changes, actually load
    // that save.
    const data =
      source.length > 0 &&
      (state.save
        ? source.find((item) => item.id === state.save)
        : source[source.length - 1]);

    data && onCache(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.save, source]);

  // Updates the state variable. Used when values in the
  // Mission panel change.
  const handleChange = (values: any): void => {
    const { name, value, category } = values;
    const parsedValue = parseFloat(parseComma(value));
    if (Object.keys(bounds).includes(name)) {
      if(name === 'altitude' && state.parameters.orbitState === 1 && bounds['semiMajorAxis'].min <= parsedValue && !isNaN(parsedValue)){ //if Keplerian
        onState(category, { ...state[category], [name]: parsedValue });
      }
      else if (
        bounds[name].min <= parsedValue &&
        bounds[name].max >= parsedValue &&
        !isNaN(parsedValue)
      ) {
        onState(category, { ...state[category], [name]: parsedValue });
      }
    } else {
      onState(category, { ...state[category], [name]: typeof value === 'boolean' ? value : parsedValue });
    }
  };

  // Deletes a save from the project history.
  const handleDelete = (name: string) => {
    let temp = JSON.parse(JSON.stringify(preference));

    const selected = temp.project.find((item) => item.id === project);
    selected.saves = selected.saves.filter((save) => save.id !== name);

    const data = temp.project.filter((item) =>
      item.id === project ? selected : item
    );

    // Update the database.
    dispatch(updatePreference({ project: data }));

    const savesExceptIsCompared =
      selected.saves && selected.saves.filter((save) => !save.isCompared);
    const mostRecentSave =
      savesExceptIsCompared &&
      savesExceptIsCompared.length > 0 &&
      savesExceptIsCompared[savesExceptIsCompared.length - 1];
    onState('save', mostRecentSave.id ?? '');
    onState('isLastAnalysis', false);
    onState('isMarkedForComparison', false);
    onState('isDataLoaded', false);
  };

  const handleBaseLine = (resultId: string): void => {
    let temp = JSON.parse(JSON.stringify(preference));
    const selected = temp.project.find((item) => item.id === project);
    selected.saves = selected.saves.map((save) => {
      save.isBaseline = save.id === resultId;
      return save;
    });
    const data = temp.project.filter((item) =>
      item.id === project ? selected : item
    );
    dispatch(updatePreference({ project: data }));
  };

  const handleCheck = (event): void => {
    dispatch(updateResults());
    onState('save', event.target.name);
    onState('isLastAnalysis', false);
    onState('isMarkedForComparison', false);
    onState('isDataLoaded', false);
  };

  return (
    <div
      className={classes.root}
      style={{
        overflowY: currentTab === 'mission' ? 'scroll' : 'auto',
        height: currentTab === 'report' ? '100%' : '95%',
        overflowX: 'hidden',
      }}
    >
      <Grid container justifyContent="center" spacing={3}>
        <Grid item md={12}>
          <Box>
            <Typography
              variant="h3"
              component="h3"
              style={{ fontWeight: 'normal' }}
              className = {classes.header}
              color="textPrimary"
            >
              {"  " + tabs[currentTab]}
            </Typography>
          </Box>
          <Divider className={classes.divider} />
          {currentTab === 'mission' && (
            <Mission 
              state={state} 
              bounds={bounds}
              onBounds = {onBounds}
              setWizardIndex = {setWizardIndex} 
              onChange={handleChange}
              onState = {onState}
            />
          )}
          {currentTab === 'saves' && (
            <ProjectHistory
              result={cache}
              source={source}
              checked={state.save}
              onDelete={handleDelete}
              onCheck={handleCheck}
              onBaseLine={handleBaseLine}
            />
          )}
          {currentTab === 'report' && (
            <Reports
              project={preference.project.find((item) => item.id === project)}
              state={state}
              networkPanelStatus={networkPanelStatus}
              resultPanelCollapsed={resultPanelCollapsed}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default QuickAccess;
