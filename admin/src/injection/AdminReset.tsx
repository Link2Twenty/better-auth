import { useEffect, useState } from 'react';

// Compoenents
import WarningAlert from '../components/WarningAlert';
import { Box, Button, Flex, Grid, Typography } from '@strapi/design-system';

// Helpers
import { getTranslation } from '../utils/getTranslation';
import { getToken } from '../utils/tokenHelpers';

// Hooks
import { useIntl } from 'react-intl';

const AdminReset = ({ id }: { id?: string }) => {
  const { formatMessage } = useIntl();

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  /**
   * Resets the MFA for a specific user
   */
  const handleReset = async () => {
    const token = getToken();
    setLoading(true);

    try {
      const response = await fetch(`/strapi-identity/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to fetch 2FA status for user');

      setIs2FAEnabled(false);
    } catch (error) {
      console.error('Error resetting 2FA for user:', error);
    } finally {
      setLoading(false);
      setWarningOpen(false);
    }
  };

  // get the initial status of 2FA for the user when the component mounts
  useEffect(() => {
    if (!id) return;

    const ac = new AbortController();
    const token = getToken();

    (async () => {
      try {
        const response = await fetch(`/strapi-identity/admin/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: ac.signal,
        });

        if (!response.ok) throw new Error('Failed to fetch 2FA status for user');

        const data = await response.json();
        setIs2FAEnabled(data.data);
      } catch (error) {
        console.error('Error fetching 2FA status for user:', error);
      }
    })();
  }, [id]);

  return (
    <>
      <Box
        background="neutral0"
        hasRadius
        shadow="filterShadow"
        paddingTop={6}
        paddingBottom={6}
        paddingLeft={7}
        paddingRight={7}
      >
        <Flex direction="column" alignItems="stretch" gap={4}>
          <Flex direction="column" alignItems="stretch" gap={1}>
            <Typography variant="delta" tag="h2">
              {formatMessage({
                id: getTranslation('admin.title'),
                defaultMessage: 'Two-Factor Authentication',
              })}
            </Typography>
            <Typography>
              {formatMessage({
                id: getTranslation('admin.subtitle'),
                defaultMessage: 'Reset the Two-Factor Authentication for a user.',
              })}
            </Typography>
          </Flex>
          <Grid.Root>
            <Grid.Item col={6} s={12} alignItems="stretch">
              <Button
                disabled={!is2FAEnabled}
                variant="danger"
                onClick={() => setWarningOpen(true)}
              >
                {formatMessage({
                  id: getTranslation('app.components.Button.reset'),
                  defaultMessage: 'Reset',
                })}
              </Button>
            </Grid.Item>
          </Grid.Root>
        </Flex>
      </Box>
      <WarningAlert
        loading={loading}
        title={formatMessage({
          id: getTranslation('admin.warn-title'),
          defaultMessage: 'Reset 2FA for this user?',
        })}
        open={warningOpen}
        onCancel={() => setWarningOpen(false)}
        onConfirm={handleReset}
      >
        <Typography variant="omega" textAlign="center">
          {formatMessage({
            id: getTranslation('admin.warning'),
            defaultMessage:
              'Resetting the Two-Factor Authentication will allow the user to set it up again with a new device. This action cannot be undone.',
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
};

export default AdminReset;
