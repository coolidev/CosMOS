import React, { useState } from 'react';
import axios from 'src/utils/axios';
import {
  Dialog,
  DialogActions,
  Slide,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import Carousel from 'react-material-ui-carousel';
import useStyles from 'src/utils/styles';
import { importAll } from 'src/utils/util';
import { INTROITEMS } from 'src/utils/constants/intro';
import IntroSection from './intro-section';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function IntroPanel(props) {
  const [checkedShow, setCheckedShow] = useState(localStorage.getItem('introPopCheckbox') === 'false');
  const classes = useStyles();
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
      classes={{ paper: classes.dialog }}
    >
      <Carousel autoPlay={false} animation="fade" className={classes.introItem} fullHeightHover={false} navButtonsAlwaysVisible={true}>
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
      <DialogActions>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedShow}
              size="small"
              onChange={handleChange}
              name="checkedShow"
              color="primary"
            />
          }
          label="Don’t show me this again"
        />
      </DialogActions>
    </Dialog>
  );
}

export default IntroPanel;
