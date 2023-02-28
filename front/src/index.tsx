import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { HelmetProvider } from 'react-helmet-async';
import App from 'src/app';
import store from 'src/store';
import { SettingsProvider } from 'src/contexts/SettingsContext';

ReactDOM.render(
  <HelmetProvider>
    <SnackbarProvider dense maxSnack={3}>
      <Provider store={store}>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </Provider>
    </SnackbarProvider>
  </HelmetProvider>,
  document.getElementById('root')
);
