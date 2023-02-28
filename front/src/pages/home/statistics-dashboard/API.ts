import  { AxiosResponse } from 'axios';
import axios from 'src/utils/axios';

export const getSystemsAndVersions = async () => {
  try {
    const res: AxiosResponse = await axios.get('/get-systems-and-versions');
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSystemKeyFromName = async (params: any) => {
  try {
    const res: AxiosResponse = await axios.post('/systemNameToKey', params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getItems = async (params: any) => {
  try {
    const res: AxiosResponse = await axios.post('/get-items', params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getPlotItems = async () => {
  try {
    const res: AxiosResponse = await axios.get('/get-plot');
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCartItems = async (params: Object) => {
  try {
    const res: AxiosResponse = await axios.get('/get-cart', { params });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSystems = async (params: Object) => {
  try {
    const res: AxiosResponse = await axios.post('/get-systems', params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getStationsAndFrequencies = async (params: Object) => {
  try {
    const res: AxiosResponse = await axios.post('/get-stations-and-frequencies', params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSystemVersion = async (params: Object) => {
  try {
    const res: AxiosResponse = await axios.post(
      '/get-versions',
      params
    );
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFileId = async (params: Object) => {
  try {
    const res: AxiosResponse = await axios.get('/get-file-id', { params });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteRecord = async (params: Object) => {
  try {
    const res: AxiosResponse = await axios.post('/delete-record', params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteAll = async (params: Object) => {
  try {
    const res: AxiosResponse = await axios.post('/delete-all', params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const migrate = async (params: Object) => {
  try {
    const res: AxiosResponse = await axios.post('/migrate', params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getModels = async (params: Object) => {
  try {
    const res: AxiosResponse = await axios.get('/get-models', { params });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const generateModels = async (params: Object) => {
  try {
    const res: AxiosResponse = await axios.post('/generate-Models', params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getModifySystems = async () => {
  try {
    const res: AxiosResponse = await axios.get('/get-modify-systems');
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getGroundStations = async () => {
  try {
    const res: AxiosResponse = await axios.get('/get-ground-stations');
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export const getPrecs = async () => {
  try {
    const res: AxiosResponse = await axios.get('/get-precs');
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getVersionIds = async () => {
  try {
    const res: AxiosResponse = await axios.get('/get-version-ids');
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getModifyAttrVersions = async (params: { [key: string]: number }) => {
  try {
    const res: AxiosResponse = await axios.get(
      '/get-modify-attr-versions',
      {
        params
      }
    );
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getModifyModels = async (params: { [key: string]: number }) => {
  try {
    const res: AxiosResponse = await axios.get('/get-modify-models', {
      params
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const getBeamTypes = async () => {
  try {
    const res: AxiosResponse = await axios.get('/get-beams-types', {
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const changeDB = async (params: { [key: string]: string }) => {
  try {
    const res: AxiosResponse = await axios.get('/change-db', {
      params
    });
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const createSystem = async (params: { [key: string]: string }) => {
  try {
    const res: AxiosResponse = await axios.post('/create-system', params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const createVersion = async (params: { [key: string]: number | string }) => {
  try {
    const res: AxiosResponse = await axios.post('/create-version', params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const createAttrVersion = async (params: { [key: string]: number | string }) => {
  try {
    const res: AxiosResponse = await axios.post('/create-attribute-version', params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const createModel = async (params: { [key: string]: number | string }) => {
  try {
    const res: AxiosResponse = await axios.post('/create-model', params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const processing = async (params: Object, formData: FormData) => {
  try {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        params
      }
    };
    const res: AxiosResponse = await axios.post(
      '/processing',
      formData,
      config
    );
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadRegressions = async (formData: FormData) => {
  try {
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    const res: AxiosResponse = await axios.post(
      '/upload-regressions',
      formData,
      config
    );
    return res;
  } catch (error) {
    throw new Error(error);
  }
};