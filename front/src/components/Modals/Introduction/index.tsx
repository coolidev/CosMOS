import React, { useState } from 'react';
import axios from 'src/utils/axios';
import {
  Dialog,
  DialogActions,
  Slide,
  FormControlLabel,
  Checkbox,
  makeStyles,
  Icon,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import Carousel from 'react-material-ui-carousel';
import useStyles from 'src/utils/styles';
import { importAll } from 'src/utils/util';
import { INTROITEMS } from 'src/utils/constants/intro';
import IntroSection from './intro-section';
import { Theme } from 'src/theme';
import { ArrowBackIos, ArrowForwardIos, FiberManualRecord } from '@material-ui/icons';

const customStyle = makeStyles((theme: Theme) => ({
  dialogBox: {
    '& > div > div': {
      border: `2px solid ${theme.palette.border.main}`,
      borderRadius: '8px'
    },
  },
  dialog: {
    minWidth: theme.spacing(180) + 'px !important',
    minHeight: theme.spacing(140) + 'px !important',
    maxWidth: theme.spacing(180) + 'px !important',
    maxHeight: theme.spacing(160) + 'px !important',
    backgroundColor: theme.palette.background.light
  },
  introItem: {},
  comboShadow: {
    '& input+span': {
      boxShadow: '0 2px 7px rgba(0,0,0,21%)'
    }
  }
}))

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function IntroPanel(props) {
  const [checkedShow, setCheckedShow] = useState(localStorage.getItem('introPopCheckbox') === 'false');
  const classes = useStyles();
  const customClasses = customStyle();
  const images = importAll(
    require['context'](
      '../../../../public/static/images/intro',
      false,
      /\.(png|jpe?g|svg)$/
    )
  );

  const handleClose = () => {
    const email = localStorage.getItem('email');
    axios.post('/requestIntroDisable', { email, checkedShow });
    localStorage.setItem('introPopCheckbox', (!checkedShow).toString());
    props.close();
  };

  const handleChange = () => {
    setCheckedShow(!checkedShow);
  };

  return (
    <Dialog
      open={true}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      classes={{ paper: customClasses.dialog }}
      className={customClasses.dialogBox}
    >
      <Carousel
        autoPlay={false}
        animation="fade"
        className={customClasses.introItem}
        fullHeightHover={false}
        navButtonsAlwaysVisible={true}
        NextIcon={<ArrowForwardIos fontSize="large" />}
        PrevIcon={<ArrowBackIos fontSize="large" />}
        navButtonsProps={{
          style: {
            backgroundColor: 'transparent',
            color: '#E34747'
          }
        }}
        IndicatorIcon={<FiberManualRecord />}
        indicatorIconButtonProps={{
          style: {
            color: '#E2E2E2',
          }
        }}
        activeIndicatorIconButtonProps={{
          style: {
            color: '#E34747'
          }
        }}
        indicatorContainerProps={{
          style: {
            alignItems: 'center',
            height: '80px',
            display: 'flex',
            justifyContent: 'center'
          }
        }}  
      >
        {INTROITEMS.map((item, idx) => (
          <IntroSection
            key={item.title}
            image={images[idx] ? images[idx].default : ''}
            item={item}
            onClose={handleClose}
            isPanel={false}
          />
        ))}
      </Carousel>
      <DialogActions
        style={{
          marginTop: '-80px',
          height: '80px'
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedShow}
              size="small"
              onChange={handleChange}
              name="checkedShow"
              icon={<Icon></Icon>}
              // color="primary"
              className={customClasses.comboShadow}
            />
          }
          label="Don’t show me this again"
          style={{
            color: '#B3B3B3',
            fontStyle: 'italic',
            fontSize: '14px'
          }}
        />
      </DialogActions>
    </Dialog>
  );
}

export default IntroPanel;
