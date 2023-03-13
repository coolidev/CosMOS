import { FC } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { NetworkPanel } from 'src/components/Results';
import type { State } from 'src/pages/home';
import { Theme } from 'src/theme';

interface NetworkProps {
  state: State;
  visible: boolean;
  onState: (name: string, value: any) => void;
  onBounds: (name: string, type: string, value: number) => void;
  handleClear: any;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  hide: {
    display: 'none'
  },
}));

const Network: FC<NetworkProps> = ({ 
  state, 
  visible,
  onState,
  onBounds,
  handleClear
}) => {
  const classes = useStyles();

  return (
    <Grid container spacing={0} className={visible?classes.root:classes.hide}>
      <Grid item xs={12}>
        <NetworkPanel
          state={state}
          onState={onState}
          handleClear = {handleClear}
          onBounds = {onBounds}
        />
      </Grid>
    </Grid>
  );
};

export default Network;
