import { TypographyOptions } from "@material-ui/core/styles/createTypography";

const typography: TypographyOptions = {
  // useNextVariants: true,
  fontFamily: [
    "Nunito",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(","),
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  h1: {
    fontSize: "2rem",
    '@media (max-width:1600px)': {
      fontSize:"1.65rem"
    },
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: "1.75rem",
    '@media (max-width:1600px)': {
      fontSize:"1.45rem"
    },
    fontWeight: 600,
    lineHeight: 1.2
  },
  h3: {
    fontSize: "1.5rem",
    '@media (max-width:1600px)': {
      fontSize:"1.25rem"
    },
    fontWeight: 600,
    lineHeight: 1.2
  },
  h4: {
    fontSize: "1.25rem",
    '@media (max-width:1600px)': {
      fontSize:"1.05rem"
    },
    fontWeight: 600,
    lineHeight: 1.2
  },
  h5: {
    fontSize: "1.125rem",
    '@media (max-width:1600px)': {
      fontSize:"0.95rem"
    },
    fontWeight: 600,
    lineHeight: 1.2
  },
  h6: {
    fontSize: "1.0625rem",
    '@media (max-width:1600px)': {
      fontSize:"0.85rem"
    },
    fontWeight: 600,
    lineHeight: 1.2
  },
  body1: {
    fontSize: 14,
    '@media (max-width:1600px)': {
      fontSize:"12px"
    },
  },
  body2: {
    '@media (max-width:1600px)': {
      fontSize:"0.675rem"
    },
  },
  button: {
    textTransform: "none",
    fontSize:"13px",
    '@media (max-width:1600px)': {
      fontSize:"11px",
      lineHeight:'normal'
    }
  }
};

export default typography;