import adminAPIRoutes from './admin';

import type { Plugin } from '@strapi/types';

const routes: Plugin.LoadedPlugin['routes'] = {
  admin: adminAPIRoutes,
};

export default routes;
