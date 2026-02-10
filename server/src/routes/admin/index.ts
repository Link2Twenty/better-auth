import mfa from './mfa.json';
import config from './config.json';

// Types
import type { Plugin } from '@strapi/types';

const route = (): Plugin.LoadedPlugin['routes']['admin'] => ({
  type: 'admin',
  routes: [...mfa, ...config] as Plugin.LoadedPlugin['routes']['admin']['routes'],
});

export default route as unknown as Plugin.LoadedPlugin['routes']['admin'];
