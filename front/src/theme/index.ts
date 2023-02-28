import _ from 'lodash';
import { createTheme as createMuiTheme } from '@material-ui/core/styles';
import typography from './typography';
import overrides from './overrides';
import shadows from './shadows';
import { THEMES } from 'src/utils/constants/general';
import type { BaseOption, ThemeOptions } from 'src/types/theme';
import type { Theme as MuiTheme } from '@material-ui/core';
//import type { Theme as MuiTheme } from '@material-ui/core/styles/createMuiTheme';
import type {
  Palette as MuiPalette,
  TypeBackground as MuiTypeBackground
} from '@material-ui/core/styles/createPalette';

interface ThemeConfig {
  theme?: string;
}

type Border = {
  main: string;
  opposite?: string;
  boring: string;
};

interface TypeBackground extends MuiTypeBackground {
  header: string;
  light: string;
  main: string;
  paper: string;
  dark: string;
}

interface Palette extends MuiPalette {
  background: TypeBackground;
  border: Border;
  component: Border;
}

export interface Theme extends MuiTheme {
  name: string;
  palette: Palette;
}

export const CART_RED = '#e34747';

const baseOptions: BaseOption = {
  spacing: 4,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1600
    }
  },
  overrides: overrides,
  props: {
    MuiButtonBase: {
      disableRipple: true
    },
    MuiCardHeader: {
      titleTypographyProps: { variant: 'h6' }
    }
  },
  typography: typography,
  shadows: shadows
};

const themesOptions: ThemeOptions[] = [
  {
    name: THEMES.LIGHT,
    palette: {
      primary: {
        main: CART_RED,
        light: '#ffffff'
      },
      secondary: {
        main: CART_RED
      },
      border: {
        main: CART_RED,
        boring: '#000'
      },
      component: {
        main: '#ffffff',
        opposite: '#1A1A1A'
      },
      background: {
        header: '#f0f1f3',
        main: '#f0f1f3',
        paper: '#f0f1f3',
        light: '#fff',
        dark: '#fff'
      },
      text: {
        primary: '#1A1A1A',
        secondary: '#737373'
      }
    }
  },
  {
    name: THEMES.DARK,
    palette: {
      primary: {
        main: '#e34748',
        light: '#2d2d2d'
      },
      secondary: {
        main: '#e34748'
      },
      border: {
        main: '#e34748',
        boring: '#ddd'
      },
      component: {
        main: '#2d2d2d',
        opposite: '#fff'
      },
      background: {
        header: '#232323',
        main: '#232323',
        light: '#2d2d2d',
        paper: '#232323',
        dark: '#2d2d2d'
      },
      text: {
        primary: '#e6e5e8',
        secondary: '#737373'
      }
    }
  }
];

export const createTheme = (config: ThemeConfig = {}): Theme => {
  let themeOptions = themesOptions.find(
    (theme: ThemeOptions) => theme.name === config.theme
  );

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    [themeOptions] = themesOptions;
  }

  let theme = createMuiTheme(_.merge({}, baseOptions, themeOptions));

  return theme as Theme;
};
