import * as admin from './admin';
import * as config from './config';
import * as secret from './mfa';

import type { Plugin } from '@strapi/types';

const services: Plugin.LoadedPlugin['services'] = { admin, config, secret };

export default services;
