import { useContext, useEffect, useState } from "react";
import {
  Grid,
  makeStyles
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { ZoomContext } from "../../providers/zoom";
import useWindowSize, { useFullScreen } from "../../hooks/useSize";

const useStyles = makeStyles<Theme>((theme) => ({
  root: {
    textAlign: "center",
  },
}))

const HomeLayout = ({ children }: any) => {
  const { zoom, selectZoom } = useContext(ZoomContext)

  const [browser, setBrowser] = useState('');
  const [fullSize, setFullSize] = useState({
    width: `${window.screen.width}px`,
    height: `100vh`
  });

  const classes = useStyles();

  const size = useWindowSize();
  const isFull = useFullScreen();

  const sUsrAg = navigator.userAgent;

  useEffect(() => {
    // The order matters here, and this may report false positives for unlisted browsers.

    if (sUsrAg.indexOf("Firefox") > -1) {
      setBrowser("Mozilla Firefox");
      // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
    } else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
      setBrowser("Samsung Internet");
      // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
    } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
      setBrowser("Opera");
      // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
    } else if (sUsrAg.indexOf("Trident") > -1) {
      setBrowser("Microsoft Internet Explorer");
      // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
    } else if (sUsrAg.indexOf("Edge") > -1) {
      setBrowser("Microsoft Edge");
      // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    } else if (sUsrAg.indexOf("Chrome") > -1) {
      setBrowser("Google Chrome/Chromium");
      // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
    } else if (sUsrAg.indexOf("Safari") > -1) {
      setBrowser("Apple Safari");
      // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
    } else {
      setBrowser("unknown");
    }
  },[sUsrAg]);

  useEffect(() => {
    selectZoom()
  }, [size, selectZoom]);

  useEffect(() => {
    if (isFull) {
      if (browser === 'Google Chrome/Chromium') {
        setFullSize({
          width: `${window.screen.availWidth / zoom}px`,
          height: '100vh'
        })
      } else {
        setFullSize({
          width: `${window.screen.availWidth}px`,
          height: '100vh'
        })
      }
    } else {
      if (browser === 'Google Chrome/Chromium') {
        setFullSize({
          width: `${window.screen.width / zoom}px`,
          height: `${window.screen.height / zoom}px`
        })
      } else {
        setFullSize({
          width: `${window.screen.width}px`,
          height: `${window.screen.height}px`
        })
      }
    }
  }, [size, zoom, browser, isFull])

  return (
    <>
      <Grid
        className={classes.root}
        style={{
          width: `${fullSize.width}`,
          height: `${fullSize.height}`
        }}
      >
        { children }
      </Grid>
    </>
  );
}

export default HomeLayout;
