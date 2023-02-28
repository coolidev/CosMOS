import { FC } from 'react';
import { capitalCase } from 'change-case';
import {
  Box,
  FormControlLabel,
  Switch,
  makeStyles,
  Typography
} from '@material-ui/core';
import useSettings from 'src/hooks/useSettings';
import { THEMES } from 'src/utils/constants/general';
import { Theme } from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.text.primary
  }
}));

const Settings: FC = () => {
  const classes = useStyles();
  const { settings, saveSettings } = useSettings();

  const handleChange = (value: boolean): void => {
    const theme = value ? THEMES.DARK : THEMES.LIGHT;
    saveSettings({ theme });
  };

  return (
    <Box className={classes.root}>
      
      <FormControlLabel
        control={<>
          <Typography style={{color: settings.theme === THEMES.DARK ? '#FFF' : '#000', paddingRight: '10px'}}>{capitalCase('Light')}</Typography>
          <Switch
            edge="start"
            name="direction"
            checked={settings.theme === THEMES.DARK}
            onChange={(event) => handleChange(event.target.checked)}
            
          /></>
        }
        label={<Typography style={{color: settings.theme === THEMES.DARK ? '#FFF' : '#000'}}>{capitalCase('Dark')}</Typography>}
        
      />
    </Box>
  );
};

export default Settings;
