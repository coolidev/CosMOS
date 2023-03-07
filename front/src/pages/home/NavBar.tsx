import { useState, useEffect, FC, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Icon,
  Drawer,
  List,
  ListItem,
  Button,
  makeStyles,
  IconButton,
  SvgIcon,
  useTheme,
  Typography,
  Grid
} from '@material-ui/core';
import {
  NewProject,
  Welcome,
  Confirm,
  EditProject
} from 'src/components/Modals';
import { PDFViewerADD, PDFViewerGuide } from './pdf-view-panel';
import { Menu as MenuIcon } from 'react-feather';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { useSelector } from 'src/store';
import StationLibrary from './Network/StationLibrary';
import DialogBox from 'src/components/DialogBox';
import { Close } from '@material-ui/icons';

interface NavBarProps {
  onClose: () => void;
  open: boolean;
  openIntro: () => void;
  loading: boolean;
}

const projectSections = [
  {
    name: 'new',
    label: 'New Project',
    icon: 'New_Project_Icon-Unselected-SVG.svg'
  },
  {
    name: 'load',
    label: 'Load Project',
    icon: 'Load_Project_Icon-Unselected-SVG.svg'
  },
  {
    name: 'close',
    label: 'Close Project',
    icon: 'Close_Project_Icon-Unselected-PNG.svg'
  },
  {
    name: 'manage',
    label: 'Manage Project Details',
    icon: 'Manage_Project_Details_Icon-Unselected-SVG.svg'
  }
];

const resourceSections = [
  // TODO: release for the next version
  // { name: 'model-library', label: 'Model Library' },
  // { name: 'system-library', label: 'System Library' },
  {
    name: 'guide',
    label: 'Users Guide',
    icon: 'Users Guide_Icon-Unselected-SVG.svg'
  },
  {
    name: 'algorithm',
    label: 'Algorithm Description Doc',
    icon: 'Algoritm_Description_Doc_Icon-Unselected-SVG.svg'
  },
  {
    name: 'introPanel',
    label: 'Information',
    icon: 'introPanel.svg'
  },
  {
    name: 'platformList',
    label: 'Browse Platforms',
    icon: 'Load_Project_Icon-Unselected-SVG.svg'
  }
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  mobileDrawer: {
    width: 256,
    overflow: 'hidden'
  },
  itemLeaf: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5
    //borderBottom: '1px solid #aaa',
    //backgroundColor: colors.grey[100]
  },
  buttonLeaf: {
    color: theme.palette.text.secondary,
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: 'inherit', //theme.typography.fontWeightRegular,
    '&.depth-0': {
      '& $title': {
        fontWeight: theme.typography.fontWeightMedium
      }
    }
  },
  title: {
    marginRight: 'auto',
    marginLeft: '10px'
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    padding: "5px",
    paddingLeft: '1rem',
    gap: "1px",

    background: "#E34747",
    boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px 8px 0px 0px",

    textAlign: 'left',
    fontFamily: 'Roboto',
    fontStyle: "normal",
    fontSize: "24px",
    color: "white",
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontStyle: "normal",
    fontSize: "21px",
    lineHeight: "25px",
    display: "flex",
    alignItems: "center",
    color: theme.palette.border.main,
    paddingTop: '1rem',
    paddingLeft: '.5vw',
    borderBottom: `4px solid ${theme.palette.border.main}`,
  },
  sectionTitle: {
    marginRight: 'auto',
    marginLeft: '10px'
  },
  dialog: {
    minWidth: '60vw'
  }
}));

const NavBar: FC<NavBarProps> = ({ onClose, open, openIntro, loading }) => {
  const classes = useStyles();
  const location = useLocation();
  const [selected, setSelected] = useState<string | null>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModal, setModal] = useState<boolean>(false);
  const [isConfirm, setConfirm] = useState<boolean>(false);
  const theme = useTheme<Theme>();
  const { zoom } = useSelector((state) => state.zoom);
  const [platformPanel, setPlatformPanel] = useState<boolean>(false);

  useEffect(() => {
    if (open && onClose) {
      onClose();
      setSelected(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleClick = (event): void => {
    const { name } = event.currentTarget;
    setSelected(name);
    setIsOpen(true);
    if (name === 'introPanel') {
      openIntro();
    }
    if (name === 'platformList') {
      setPlatformPanel(true);
    }
    name !== 'manage' &&
      name !== 'guide' &&
      name !== 'algorithm' &&
      name !== 'platformList' &&
      handleModal(true);
    onClose();
  };

  const handleOpen = (): void => setIsOpen(!isOpen);

  const handleConfirm = (): void => setConfirm(!isConfirm);

  const handleModal = (value?: boolean): void => setModal(value || !isModal);

  return (
    <div className={classes.root}>
      <Drawer
        anchor="left"
        classes={{ paper: classes.mobileDrawer }}
        onClose={onClose}
        open={open}
        variant="temporary"
      >
        <Box
          height="100%"
          display="flex"
          flexDirection="column"
          style={{
            border: '2px solid #E34747',
            borderRadius: "8px 8px 8px 0px",
            backgroundColor:
              theme.name === THEMES.LIGHT
                ? '#fff'
                : theme.palette.background.main
          }}
        >
          <Box className={classes.header}>
            <Box>
              <IconButton color="inherit" size="small">
                <SvgIcon fontSize="small">
                  <MenuIcon />
                </SvgIcon>
              </IconButton>
              <Typography
                variant="h4"
                component="span"
                style={{ fontWeight: 'normal', color: 'white' }}
              >
                {"CosMOS"}
              </Typography>
              <IconButton color='inherit' size='small' onClick={onClose} style={{ position: "absolute", right: "1rem" }}>
                <Close />
              </IconButton>
            </Box>
          </Box>
          <PerfectScrollbar options={{ suppressScrollX: true }}>
            <Box py={2}>
              <List>
                <Grid item xs={12}>
                  <Typography className={classes.subtitle}>
                    Options
                  </Typography>
                </Grid>
                {projectSections.map((section) => (
                  <ListItem
                    className={classes.itemLeaf}
                    disableGutters
                    key={section.name}
                    disabled={loading}
                  >
                    <Button
                      name={section.name}
                      className={classes.buttonLeaf}
                      onClick={handleClick}
                      disabled={loading}
                    >
                      <Icon
                        style={{
                          width: (window.screen.availHeight / zoom) * 0.0384,
                          height: (window.screen.availHeight / zoom) * 0.0384,
                          textAlign: 'center',
                          overflow: 'visible'
                        }}
                      >
                        <img
                          alt="saves"
                          style={{
                            height: (window.screen.availHeight / zoom) * 0.034
                          }}
                          src={
                            theme.name === THEMES.LIGHT
                              ? `/static/icons/light/${section.icon}`
                              : `/static/icons/${section.icon}`
                          }
                        />
                      </Icon>
                      <span className={classes.title}>{section.label}</span>
                    </Button>
                  </ListItem>
                ))}
                <br />
                <Grid item xs={12}>
                  <Typography className={classes.subtitle}>
                    Resources
                  </Typography>
                </Grid>
                {resourceSections.map((section) => (
                  <ListItem
                    className={classes.itemLeaf}
                    disableGutters
                    key={section.name}
                  >
                    <Button
                      name={section.name}
                      className={classes.buttonLeaf}
                      onClick={handleClick}
                    >
                      <Icon
                        style={{
                          width: (window.screen.availHeight / zoom) * 0.0384,
                          height: (window.screen.availHeight / zoom) * 0.0384,
                          textAlign: 'center',
                          overflow: 'visible'
                        }}
                      >
                        <img
                          alt="saves"
                          style={{
                            height: (window.screen.availHeight / zoom) * 0.0383
                          }}
                          src={
                            theme.name === THEMES.LIGHT
                              ? `/static/icons/light/${section.icon}`
                              : `/static/icons/${section.icon}`
                          }
                        />
                      </Icon>
                      <span className={classes.title}>{section.label}</span>
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          </PerfectScrollbar>
        </Box>
      </Drawer>
      <Fragment>
        {selected === 'new' &&
          (isConfirm ? (
            <NewProject
              isOpen={isOpen}
              onOpen={handleOpen}
              onConfirm={handleConfirm}
            />
          ) : (
            <Confirm
              open={isModal}
              onOpen={handleModal}
              onConfirm={handleConfirm}
            />
          ))}
        {selected === 'close' &&
          (isConfirm ? (
            <Welcome onConfirm={handleConfirm} />
          ) : (
            <Confirm
              open={isModal}
              onOpen={handleModal}
              onConfirm={handleConfirm}
            />
          ))}

        {selected === 'load' &&
          (isConfirm ? (
            <Welcome onConfirm={handleConfirm} />
          ) : (
            <Confirm
              open={isModal}
              onOpen={handleModal}
              onConfirm={handleConfirm}
            />
          ))}
        {selected === 'manage' && (
          <EditProject
            open={isOpen}
            onOpen={handleOpen}
            onModal={handleModal}
          />
        )}
        {selected === 'manage' && isModal && !isConfirm && (
          <Confirm
            open={isModal}
            onOpen={handleModal}
            onConfirm={handleConfirm}
            hidePrompt={true}
          />
        )}
        {selected === 'manage' && !isModal && isConfirm && (
          <Welcome onConfirm={handleConfirm} />
        )}

        <PDFViewerADD
          isOpen={selected === 'algorithm'}
          onClose={() => setSelected(null)}
        />
        <PDFViewerGuide
          isOpen={selected === 'guide'}
          onClose={() => setSelected(null)}
        />
      </Fragment>
      <DialogBox
        isOpen={platformPanel}
        title={'Browse Platforms'}
        onClose={() => {
          setPlatformPanel(false);
        }}
        className={{ paper: classes.dialog }}
      >
        <StationLibrary />
      </DialogBox>
    </div>
  );
};

export default NavBar;
