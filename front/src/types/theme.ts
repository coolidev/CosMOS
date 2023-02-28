import type { Shadows } from '@material-ui/core/styles/shadows';
import type { ComponentsProps } from '@material-ui/core/styles/props';

export type BaseOption = {
  spacing: number;
  breakpoints: Record<string, any>;
  overrides: Record<string, any>;
  props: ComponentsProps;
  typography: Record<string, any>;
  shadows: Shadows;
};

export type ThemeOptions = {
  name: string;
  palette: {
    primary?: {
      main: string;
      light: string;
    };
    secondary?: {
      main: string;
    };
    border: {
      main: string;
      boring : string;
    };
    component: {
      main: string;
      opposite: string;
    };
    background?: {
      header: string;
      light: string;
      main: string;
      paper: string;
      dark: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
  };
};
