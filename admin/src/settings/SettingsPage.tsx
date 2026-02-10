import { useEffect, useRef, useState } from 'react';

// Components
import WarningAlert from '../components/WarningAlert';
import { Layouts, Page, useNotification } from '@strapi/strapi/admin';
import { Button, Field, Flex, Grid, TextInput, Toggle, Typography } from '@strapi/design-system';
import { Check } from '@strapi/icons';

// Helpers
import { isEqual } from 'lodash';
import { getTranslation } from '../utils/getTranslation';
import { getToken } from '../utils/tokenHelpers';

// Hooks
import { useIntl } from 'react-intl';
// Types
type config = { enabled: boolean; enforce: boolean; issuer: string };

// Constants
const defaultConfig: config = { enabled: false, enforce: false, issuer: '' };

/**
 * Utility function to extract config values from form data
 * @param formData the form data to extract values from
 * @returns a config object with the extracted values
 */
const getConfigFromForm = (formData: FormData) => {
  return Array.from(formData.entries()).reduce<config>(
    (acc, [key, value]) => {
      if (key === 'enabled' || key === 'enforce') acc[key] = value === 'on';
      else if (key === 'issuer') acc[key] = String(value);

      return acc;
    },
    Object.assign({}, defaultConfig)
  );
};

export default function SettingsPage() {
  const formRef = useRef<HTMLFormElement>(null);

  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();

  const [showWarning, setShowWarning] = useState(false);

  const [canSave, setCanSave] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const [initialConfig, setInitialConfig] = useState<config | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [enforce, setEnforce] = useState(false);

  /**
   * Handle form submission to save the settings
   * @param event the form submission event
   */
  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | { preventDefault?: () => {}; currentTarget: HTMLFormElement },
    confirmed?: boolean
  ) => {
    event?.preventDefault?.();

    setSaving(true);

    const formData = new FormData(event.currentTarget);
    const values = getConfigFromForm(formData);

    if (initialConfig?.enabled && !values.enabled && !confirmed) {
      setShowWarning(true);
      setSaving(false);
      return;
    }

    try {
      const token = getToken();

      const response = await fetch('/better-auth/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const json = await response.json();

      if (!response.ok) throw new Error('Failed to update config');

      const { data, error } = json;
      if (error) throw new Error(error);

      setInitialConfig(data);
      setCanSave(false);

      toggleNotification({
        type: 'success',
        message: formatMessage({ id: 'notification.success.saved', defaultMessage: 'Saved' }),
      });
    } catch (error) {
      console.error('Error updating config:', error);

      toggleNotification({
        type: 'danger',
        message: formatMessage({ id: 'notification.error', defaultMessage: 'An error occured' }),
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle form changes to enable the save button when there are unsaved changes
   * @param event the form change event
   */
  const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const values = getConfigFromForm(formData);

    setCanSave(!isEqual(values, initialConfig || {}));
  };

  // Get the initial settings from the server when the component mounts
  useEffect(() => {
    const ac = new AbortController();
    const token = getToken();

    (async () => {
      try {
        const response = await fetch('/better-auth/config', {
          headers: { Authorization: `Bearer ${token}` },
          signal: ac.signal,
        });

        const json = await response.json();

        if (!response.ok) throw new Error('Failed to fetch config');

        const { data, error } = json;
        if (error) throw new Error(error);

        setInitialConfig(data);
        setEnabled(data.enabled);
        setEnforce(data.enforce);
      } catch (error) {
        console.error('Error fetching config:', error);

        toggleNotification({
          type: 'danger',
          message: formatMessage({ id: 'notification.error', defaultMessage: 'An error occured' }),
        });
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  if (isLoading) {
    return <Page.Loading />;
  }

  return (
    <>
      <Page.Title>
        {formatMessage(
          { id: 'Settings.PageTitle', defaultMessage: 'Settings - {name}' },
          { name: 'Better Auth' }
        )}
      </Page.Title>
      <Page.Main>
        <form onSubmit={handleSubmit} onChange={handleChange} ref={formRef}>
          <Layouts.Header
            title={formatMessage({
              id: getTranslation('settings.name'),
              defaultMessage: 'Better Auth',
            })}
            subtitle={formatMessage({
              id: getTranslation('settings.description'),
              defaultMessage:
                'Settings for Better Auth plugin, allowing you to configure authentication options and security settings.',
            })}
            primaryAction={
              <Button disabled={!canSave} loading={isSaving} type="submit" startIcon={<Check />}>
                {formatMessage({ id: 'global.save', defaultMessage: 'Save' })}
              </Button>
            }
          />
          <Layouts.Content>
            <Flex direction="column" alignItems="stretch" gap={6}>
              <Flex
                direction="column"
                alignItems="stretch"
                gap={4}
                hasRadius
                background="neutral0"
                shadow="tableShadow"
                paddingTop={6}
                paddingBottom={6}
                paddingRight={7}
                paddingLeft={7}
              >
                <Flex direction="column" alignItems="stretch" gap={1}>
                  <Typography variant="delta" tag="h2">
                    {formatMessage({
                      id: getTranslation('profile.title'),
                      defaultMessage: 'Two-Factor Authentication',
                    })}
                  </Typography>
                </Flex>
                <Grid.Root gap={5} tag="dl">
                  <Grid.Item col={6} xs={12} direction="column" alignItems="stretch">
                    <Field.Root
                      hint={formatMessage({
                        id: getTranslation('settings.enabled_hint'),
                        defaultMessage:
                          'Enable or disable Two-Factor Authentication for all users.',
                      })}
                    >
                      <Field.Label>
                        {formatMessage({ id: 'global.enabled', defaultMessage: 'Enabled' })}
                      </Field.Label>
                      <Toggle
                        name="enabled"
                        checked={enabled}
                        onChange={({ target }) => setEnabled(target.checked)}
                        offLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.off-label',
                          defaultMessage: 'False',
                        })}
                        onLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.on-label',
                          defaultMessage: 'True',
                        })}
                      />
                      <Field.Hint />
                      <Field.Error />
                    </Field.Root>
                  </Grid.Item>
                  <Grid.Item col={6} xs={12} direction="column" alignItems="stretch">
                    <Field.Root
                      hint={formatMessage({
                        id: getTranslation('settings.enforce_hint'),
                        defaultMessage:
                          'Enforce Multi-Factor Authentication for all users. If enabled, users will be required to set up MFA on their next login.',
                      })}
                    >
                      <Field.Label>
                        {formatMessage({
                          id: getTranslation('settings.enforce'),
                          defaultMessage: 'Enforce MFA',
                        })}
                      </Field.Label>
                      <Toggle
                        name="enforce"
                        disabled
                        checked={enforce}
                        onChange={({ target }) => setEnforce(target.checked)}
                        offLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.off-label',
                          defaultMessage: 'False',
                        })}
                        onLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.on-label',
                          defaultMessage: 'True',
                        })}
                      />
                      <Field.Hint />
                      <Field.Error />
                    </Field.Root>
                  </Grid.Item>
                  <Grid.Item col={6} xs={12} direction="column" alignItems="stretch">
                    <Field.Root
                      hint={formatMessage({
                        id: getTranslation('settings.issuer_hint'),
                        defaultMessage: 'Displayed in the MFA app',
                      })}
                    >
                      <Field.Label>
                        {formatMessage({
                          id: getTranslation('settings.issuer'),
                          defaultMessage: 'Issuer Name',
                        })}
                      </Field.Label>
                      <TextInput
                        name="issuer"
                        defaultValue={initialConfig?.issuer}
                        placeholder={formatMessage({
                          id: getTranslation('settings.issuer'),
                          defaultMessage: 'Issuer Name',
                        })}
                      />
                      <Field.Hint />
                      <Field.Error />
                    </Field.Root>
                  </Grid.Item>
                </Grid.Root>
              </Flex>
            </Flex>
          </Layouts.Content>
        </form>
      </Page.Main>
      <WarningAlert
        open={showWarning}
        onCancel={() => setShowWarning(false)}
        onConfirm={() => {
          setShowWarning(false);
          formRef.current && handleSubmit({ currentTarget: formRef.current }, true);
        }}
      >
        <Typography variant="omega" textAlign="center">
          {formatMessage({
            id: getTranslation('settings.warning'),
            defaultMessage:
              'Turning MFA off will affect all users. Please review the settings carefully before saving.',
          })}
        </Typography>
        <Typography textAlign="center" fontWeight="semiBold">
          {formatMessage({
            id: getTranslation('app.confirm.body'),
            defaultMessage: 'Are you sure?',
          })}
        </Typography>
      </WarningAlert>
    </>
  );
}
