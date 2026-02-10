import admin from './admin.json';
import config from './config.json';
import mfa from './mfa.json';

// Types
import type { Plugin } from '@strapi/types';

const route = (): Plugin.LoadedPlugin['routes']['admin'] => ({
  type: 'admin',
  routes: [...mfa, ...config, ...admin] as Plugin.LoadedPlugin['routes']['admin']['routes'],
});

export default route as unknown as Plugin.LoadedPlugin['routes']['admin'];
