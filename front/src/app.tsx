import { useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet-async';
import {
  AuthContext,
  SMSContext,
  ChangePasswordContext,
  ChangePasswordSMSContext
} from './hooks/useAuth';
import { createTheme } from 'src/theme';
import useSettings from './hooks/useSettings';
import routes, { renderRoutes } from 'src/routes';
import { THEMES } from 'src/utils/constants/general';
import useMaximized from './hooks/useMaximized';
import Alert from './pages/home/Alert';
import { RatioContextProvider } from './providers/ratio';
import { ZoomContextProvider } from './providers/zoom';
import { PanelContextProvider } from './providers/panel';

const App = () => {
  const isMaximized = useMaximized();
  const { settings } = useSettings();
  const existingTokens = JSON.parse(localStorage.getItem('tokens'));
  const existingSMSTokens = JSON.parse(localStorage.getItem('smstokens'));
  const [authTokens, setAuthTokens] = useState<string>(existingTokens);
  const [smsTokens, setSMSTokens] = useState<string>(existingSMSTokens);
  const [changePasswordTokens, setChangePassword] = useState('');
  const [smsPasswordTokens, setSMSPassword] = useState('');

  const [sBrowser, setBrowser] = useState('');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const setTokens = (data: any) => {
    localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  const setSMSAuthTokens = (data: any) => {
    localStorage.setItem('smstokens', JSON.stringify(data));
    setSMSTokens(data);
  };

  const setChangePasswordTokens = (data: any) => {
    localStorage.setItem('changePasswordTokens', JSON.stringify(data));
    setChangePassword(data);
  };

  const setSMSPasswordTokens = (data: any) => {
    localStorage.setItem('smsPasswordTokens', JSON.stringify(data));
    setSMSPassword(data);
  };

  const theme = createTheme({
    theme: settings.theme
  });

  return (
    <>{sBrowser !== 'Apple Safari' ?
      <>
      <Helmet>
        <style>
          {`body { 
            overflow: ${isMaximized ? 'hidden' : 'auto'};
            background-color: ${theme.palette.background.light}
            }
            :root {
              color-scheme: ${theme.name === THEMES.LIGHT ? 'light' : 'dark'};
            }
            .dx-button {
              color: ${theme.palette.border.main}!important;
            }
            .dx-checkbox[aria-checked=mixed] .dx-checkbox-icon, .dx-checkbox[aria-checked=true] .dx-checkbox-icon {
              background-color: ${theme.palette.border.main}!important;
            }
            .dx-datagrid .dx-datagrid-content .dx-datagrid-table .dx-row > td:not(.dx-validation-pending):not(.dx-datagrid-select-all) {
              vertical-align: unset!important
            }
            .dx-datagrid-content .dx-datagrid-table .dx-row .dx-editor-cell .dx-texteditor {
              padding: 0 1rem 0 0;
            }
            .dx-selectbox-container {
              box-shadow: 0px 4px 14px rgb(0 0 0 / 10%);
            }
            `}
        </style>
      </Helmet>
      <ThemeProvider theme={theme}>
        <RatioContextProvider>
          <ZoomContextProvider>
            <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
              <SMSContext.Provider
                value={{ smsTokens, setSMSTokens: setSMSAuthTokens }}
              >
                <ChangePasswordContext.Provider
                  value={{
                    changePasswordTokens,
                    setChangePassword: setChangePasswordTokens
                  }}
                >
                  <ChangePasswordSMSContext.Provider
                    value={{
                      smsPasswordTokens,
                      setSMSPassword: setSMSPasswordTokens
                    }}
                  >
                    <PanelContextProvider>
                      <HashRouter>{renderRoutes(routes)}</HashRouter>
                    </PanelContextProvider>
                  </ChangePasswordSMSContext.Provider>
                </ChangePasswordContext.Provider>
              </SMSContext.Provider>
            </AuthContext.Provider>
          </ZoomContextProvider>
        </RatioContextProvider>
      </ThemeProvider>
      </>
    : <Alert browser={sBrowser}/>
    }
    </>
  );
};

export default App;
