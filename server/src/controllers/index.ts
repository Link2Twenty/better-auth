import controller from './controller';

import type { Plugin } from '@strapi/strapi';

const controllers: Plugin.LoadedPlugin['controllers'] = {
  controller,
};

export default controllers;
