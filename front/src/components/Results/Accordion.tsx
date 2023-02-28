import { withStyles } from '@material-ui/core/styles';
import { Box, colors, Typography } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';

export const Accordion = withStyles((theme: Theme) => ({
  root: {
    border: `1px solid ${
      theme.name === THEMES.DARK
        ? theme.palette.primary.main
        : 'rgba(0, 0, 0, .125)'
    }`,
    borderRadius: 6,
    backgroundColor:
      theme.name === THEMES.DARK
        ? theme.palette.component.main
        : colors.grey[50],
    marginBottom: theme.spacing(2)
  },
  expanded: {}
}))(MuiAccordion);

export const AccordionSummary = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    backgroundColor:
      theme.name === THEMES.DARK
        ? theme.palette.background.light
        : 'rgba(0, 0, 0, .03)',
    borderRadius: 6,
    minHeight: '2.5rem',
    '& .MuiAccordionSummary-content': {
      margin: theme.spacing(1, 0, 1, 2),
      alignItems: 'center'
    }
  },
  expanded: {}
}))(MuiAccordionSummary);

export const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiAccordionDetails);

// bgcolor={theme.palette.border.main}
// py={2}
// px={3}
// borderRadius={6}
export const StyledBox = withStyles((theme : Theme) => ({
  root: {
    border: `1px solid ${
      theme.name === THEMES.DARK
        ? theme.palette.primary.main
        : 'rgba(0, 0, 0, .125)'
    }`,
    backgroundColor:
      theme.name === THEMES.DARK
        ? theme.palette.background.light
        : 'rgba(0, 0, 0, .03)',
    marginBottom: theme.spacing(2)
  },
}))(Box);

export const ItemBox = (props : {withTypography:boolean,children:any, theme : Theme}) => {
  return (
    <StyledBox
      py={2}
      px={3}
      borderRadius={6}
      >
      {props.withTypography ? 
        (
        <Typography style={{color:props.theme.palette.text.primary}}>
          {props.children}
        </Typography>
        )
      :
        (
          <>{props.children}</>
        )
      }
    </StyledBox>
  );
}
