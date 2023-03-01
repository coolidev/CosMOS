import { FC } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { importAll } from 'src/utils/util';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import DialogBox from 'src/components/DialogBox';
import { makeStyles, Theme } from '@material-ui/core';
import packageJson from '../../../../package.json';

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    minWidth: '70vw',
    minHeight: '90vh',
    maxWidth: '70vw',
    maxHeight: '90vh',
  }
}));

const pdfjsVersion = packageJson.dependencies['pdfjs-dist'];

export const PDFViewerADD: FC<PDFViewerProps> = ({ isOpen, onClose }) => {
  const classes = useStyles();
  // const files = importAll(
  //   require['context']('../../../../public/static/pdf/add', false, /\.(pdf)$/)
  // );
  const handleClose = () => onClose();
  return (
    <div className={classes.root}>
      <DialogBox
        title="Algorithm Description Document"
        isOpen={isOpen}
        onClose={handleClose}
        className={{ paper: classes.dialog }}
      >
        <div style={{height:'80vh'}}>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
            {/* <Viewer
              // fileUrl={files[0]?.default}
              defaultScale={1.5}
              plugins={createPlugins()}
            /> */}
          </Worker>
        </div>
      </DialogBox>
    </div>
  );
};

export const PDFViewerGuide: FC<PDFViewerProps> = ({ isOpen, onClose }) => {
  const classes = useStyles();
  // const files = importAll(
  //   require['context']('../../../../public/static/pdf/guide', false, /\.(pdf)$/)
  // );
  const handleClose = () => onClose();
  return (
    <div className={classes.root}>
      <DialogBox
        title="Users Guide"
        isOpen={isOpen}
        onClose={handleClose}
        className={{ paper: classes.dialog }}
      >
        <div style={{height:'80vh'}}>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
            {/* <Viewer
              // fileUrl={files[0]?.default}
              plugins={createPlugins()}
              defaultScale={1.5}
            /> */}
          </Worker>
        </div>
      </DialogBox>
    </div>
  );
};

export const PDFViewerErgodic: FC<PDFViewerProps> = ({ isOpen, onClose }) => {
  const classes = useStyles();
  // const files = importAll(
  //   require['context']('../../../../public/static/pdf/add', false, /\.(pdf)$/)
  // );
  const handleClose = () => onClose();
  // const file = files?.find(e => e.default.includes('ergodic_theory_rfcov'));
  return (
    <div className={classes.root}>
      <DialogBox
        title="Graven et al, A RAPID METHOD FOR ORBITAL COVERAGE STATISTICS WITH J2 USING ERGODIC THEORY"
        isOpen={isOpen}
        onClose={handleClose}
        className={{ paper: classes.dialog }}
      >
        
        <div style={{height:'80vh'}}>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
            {/* <Viewer
              // fileUrl={file.default}
              plugins={createPlugins()}
              defaultScale={1.5}
              initialPage={0}
            /> */}
          </Worker>
        </div>
      </DialogBox>
    </div>
  );
};

function createPlugins() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return [defaultLayoutPluginInstance];
}
