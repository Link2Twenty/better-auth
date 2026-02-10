// Types
import type { Core } from '@strapi/strapi';
import type { Plugin } from '@strapi/types';

type controller = Plugin.LoadedPlugin['controllers'][string];

const admin = ({ strapi }: { strapi: Core.Strapi }): controller => ({
  async isEnabled(ctx) {
    const userId = ctx.params.id;
    const adminService = strapi.service('plugin::strapi-identity.admin');

    if (!userId) {
      ctx.status = 400;
      ctx.body = { data: null, error: 'User ID is required' };
      return;
    }

    try {
      const enabled = await adminService.isEnabled(userId);

      ctx.status = 200;
      ctx.body = { data: enabled, error: null };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { data: null, error: 'Failed to check if 2FA is enabled for user' };
    }
  },
  async reset(ctx) {
    const userId = ctx.params.id;
    const adminService = strapi.service('plugin::strapi-identity.admin');

    if (!userId) {
      ctx.status = 400;
      ctx.body = { data: null, error: 'User ID is required' };
      return;
    }

    try {
      await adminService.reset(userId);

      ctx.status = 200;
      ctx.body = { data: true, error: null };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { data: null, error: 'Failed to reset 2FA for user' };
    }
  },
});

export default admin as unknown as controller;
