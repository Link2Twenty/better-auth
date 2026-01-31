import jwt from 'jsonwebtoken';

import type { Core } from '@strapi/strapi';
import type { Plugin } from '@strapi/types';

const controller = ({
  strapi,
}: {
  strapi: Core.Strapi;
}): Plugin.LoadedPlugin['controllers'][string] => ({
  async index(ctx) {
    const sessionManager = strapi.sessionManager;
    const secret = strapi.config.get<string>('admin.auth.secret');

    const token = ctx.cookies.get('strapi_admin_mfa');
    const payload = jwt.verify(token, secret) as { userId: string; deviceId: string };

    const { token: refreshToken } = await sessionManager('admin').generateRefreshToken(
      payload.userId,
      payload.deviceId,
      {
        type: 'refresh',
      }
    );

    ctx.cookies.set('strapi_admin_refresh', refreshToken);

    const accessResult = await sessionManager('admin').generateAccessToken(refreshToken);
    const { token: accessToken } = accessResult as { token: string };

    const configuredSecure = strapi.config.get('admin.auth.cookie.secure');
    const isProduction = process.env.NODE_ENV === 'production';
    const isSecure = typeof configuredSecure === 'boolean' ? configuredSecure : isProduction;

    const domain: string | undefined = strapi.config.get('admin.auth.domain');

    ctx.cookies.set('jwtToken', accessToken, {
      httpOnly: false,
      secure: isSecure,
      overwrite: true,
      domain,
    });

    ctx.cookies.set('strapi_admin_mfa', null, { expires: new Date(0) });

    ctx.status = 200;
    ctx.body = { data: { message: 'MFA Verified' }, error: null };
  },
});

export default controller as unknown as Plugin.LoadedPlugin['controllers'][string];
