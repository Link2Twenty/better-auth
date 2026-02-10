/**
 * Internal function to create a complete configuration object by merging provided options with default values
 * @param options partial configuration options to override defaults
 * @returns a complete configuration object with all required fields
 */
const _config = (options: Record<string, unknown> | null) => {
  return {
    enabled: options?.enabled || false,
    enforce: options?.enforce || false,
    issuer: options?.issuer || '',
  };
};

/**
 * Service for managing the Better Auth plugin configuration
 * @returns an object containing functions to get and update the plugin configuration
 */
export const isEnabled = async () => {
  const config = await getConfig();

  return config?.enabled || false;
};

/**
 * Retrieves the current configuration for the Better Auth plugin
 * @returns the current configuration
 */
export const getConfig = async () => {
  const configDocument = strapi.documents('plugin::better-auth.better-auth-config');

  return configDocument
    .findFirst({ fields: ['enabled', 'enforce', 'issuer'] })
    .then((config) => _config(config));
};

/**
 * Updates the Better Auth plugin configuration with the provided data
 * @param data partial configuration data to update
 * @returns  the updated configuration
 */
export const updateConfig = async (
  data: Partial<{ enabled: boolean; enforce: boolean; issuer: string }>
) => {
  const configDocument = strapi.documents('plugin::better-auth.better-auth-config');

  const existingConfig = await configDocument.findFirst();

  if (!existingConfig) {
    return configDocument
      .create({ data, fields: ['enabled', 'enforce', 'issuer'] })
      .then((created) => _config(created));
  }

  return configDocument
    .update({
      documentId: existingConfig.documentId,
      data: { ...existingConfig, ...data },
      fields: ['enabled', 'enforce', 'issuer'],
    })
    .then((updated) => _config(updated));
};
