import admin from './admin';
import config from './config';
import controller from './controller';

import type { Plugin } from '@strapi/strapi';

const controllers: Plugin.LoadedPlugin['controllers'] = {
  admin,
  config,
  controller,
};

export default controllers;
