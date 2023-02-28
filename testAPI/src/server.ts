/**
 * @fileoverview This is the driver module for the server,
 * i.e. it is directly invoked by the npm run server script.
 */

import { App } from './app';
import { api } from './api';

const app = App(api);

app.listen(5000);