import axios from 'axios';
import { BASE_URL } from 'src/utils/constants/paths';
import { getSocketId } from './ws';

const axiosConfig = {
  baseURL: BASE_URL,
  timeout: 0
};

const axiosInstance = axios.create(axiosConfig);

// const redirect = (redirectUrl: any) => {
//   window.location = redirectUrl;
// };

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      //if (error.response.status === 401) {
      //  return redirect('/');
      //}
    }
    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    );
  }
);

axiosInstance.interceptors.request.use((reqConfig) => {
  try {
    if(reqConfig.method.toLowerCase() === 'get') {
      reqConfig.params['sessionId'] = getSocketId() ?? 'alphabet';
    } else if (reqConfig.method.toLowerCase() === 'post') {
      reqConfig.data['sessionId'] = getSocketId() ?? 'alphabet';
    }
  } catch (err) {};
  return reqConfig;
});

export default axiosInstance;
