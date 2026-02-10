import type { Plugin } from '@strapi/types';

const bootstrap: Plugin.LoadedPlugin['bootstrap'] = async () => {
  const config = strapi.documents('plugin::strapi-identity.strapi-identity-config');
  const existingConfig = await config.count({});

  // If no configuration exists, create a default one
  if (!existingConfig) {
    await config.create({ data: { enabled: false, enforce: false, issuer: 'Strapi' } });
  }

  // Register permissions
  strapi.admin.services.permission.actionProvider.registerMany([
    {
      uid: 'settings.read',
      section: 'plugins',
      displayName: 'Read',
      subCategory: 'settings',
      pluginName: 'strapi-identity',
    },
    {
      uid: 'settings.update',
      section: 'plugins',
      displayName: 'Update',
      subCategory: 'settings',
      pluginName: 'strapi-identity',
    },
  ]);
};

export default bootstrap;
