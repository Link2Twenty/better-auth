import hasMFA from './has-mfa';

import type { Plugin } from '@strapi/types';

const policies: Plugin.LoadedPlugin['policies'] = { 'has-mfa': hasMFA };

export default policies;
