import type { Plugin } from '@strapi/types';

const destroy: Plugin.LoadedPlugin['destroy'] = () => {
  // destroy phase
};

export default destroy;
