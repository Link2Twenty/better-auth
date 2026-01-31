import type { Plugin } from '@strapi/types';

const route = () => ({
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/verify',
      handler: 'controller.index',
      config: {
        auth: false,
        policies: ['has-mfa'],
      },
    },
  ],
});

export default route as unknown as Plugin.LoadedPlugin['routes']['admin'];
