import mfaToken from './mfa';
import mfaTemp from './temp-mfa';
import config from './config';

import type { Plugin } from '@strapi/types';

const contentTypes: Plugin.LoadedPlugin['contentTypes'] = {
  'mfa-token': mfaToken as unknown as Plugin.LoadedPlugin['contentTypes']['mfa-token'],
  'mfa-temp': mfaTemp as unknown as Plugin.LoadedPlugin['contentTypes']['mfa-temp'],
  'better-auth-config':
    config as unknown as Plugin.LoadedPlugin['contentTypes']['better-auth-config'],
};

export default contentTypes;
