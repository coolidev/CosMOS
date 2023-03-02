// Libraries
import {
  Grid,
  Typography
} from '@material-ui/core';
import { ErrorOutline } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { ratio_list } from '../utils/basic';

export const RatioContext = React.createContext({});

const RatioContextProvider = ({ children }: any) => {
  const [isSupported, setIsSupported] = useState(false)
  const [appAlert, setAppAlert] = useState('');

  useEffect(() => {
    const check = window.screen.width / window.screen.height
    if (check >= 1) {
      const match = ratio_list.filter((v) => v.value === check);
      if (match.length === 0) {
        setAppAlert('this aspect ratio.');
      } else {
        setAppAlert(`${match[0].ratio} aspect ratios.`);
        setIsSupported(match[0].supported);
      }
    } else {
      setAppAlert('portrait mode.');
    }
  }, []);

  const renderNotSupported = () => {
    return (<>
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item>
          <Typography id="app-alert-description" style={{ fontSize: 20 }}>
            <ErrorOutline fontSize='large' />
            {`Currently this application doesn't support ${appAlert}`}
          </Typography>
        </Grid>
      </Grid>
    </>)
  }

  return (
    <RatioContext.Provider
      value={{}}
    >
      { isSupported ? children : renderNotSupported() }
    </RatioContext.Provider>
  )
}

export { RatioContextProvider };
