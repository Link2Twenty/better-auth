import type { Plugin } from '@strapi/types';

const bootstrap: Plugin.LoadedPlugin['bootstrap'] = async () => {
  const config = strapi.documents('plugin::better-auth.better-auth-config');
  const existingConfig = await config.count({});

  // If no configuration exists, create a default one
  if (!existingConfig) {
    await config.create({ enabled: false, enforce: false, issuer: 'Strapi' } as any);
  }
};

export default bootstrap;
