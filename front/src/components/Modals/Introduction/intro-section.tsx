import { DialogContent, Divider, Grid, Typography } from '@material-ui/core';
import IntroTitleSection from './intro-title-section';
import useStyles from '../../../utils/styles';

function IntroSection(props) {
  const { onClose, item } = props;
  const classes = useStyles();

  return (
    <>
      <IntroTitleSection
        onClose={!props.isPanel ? onClose : 0}
        isPanel={props.isPanel}
      >
        {item.title}
      </IntroTitleSection>
      <DialogContent
        // dividers
        className={!props.isPanel ? classes.introContent : ''}
        style={{ backgroundColor: 'white' }}
      >
        {props.image !== '' ? (
          <Grid container justifyContent="center" spacing={6}>
            <Grid
              item
              md={props.isPanel ? 4 : 5}
              style={{
                backgroundImage: `url(${props.image})`,
                height: '440px',
                marginTop: 20,
                borderRadius: '8px',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <Grid item md={props.isPanel ? 8 : 7} className={"pt-4"}>
              <Typography style={{ overflowY: 'auto', height: '45vh' }}
                gutterBottom
                component="p"
                variant="body1"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item md={12}>
              <Typography style={{ overflowY: 'auto', height: '45vh' }}
                gutterBottom
                component="p"
                variant="body1"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <Divider style={{ backgroundColor: '#E34747' }} />
    </>
  );
}

export default IntroSection;
