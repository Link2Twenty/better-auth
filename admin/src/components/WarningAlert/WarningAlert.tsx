import { Button, Dialog, Flex } from '@strapi/design-system';
import { useIntl } from 'react-intl';

// Types
export interface WarningAlertProps {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  confirmText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function WarningAlert({
  open,
  title,
  children,
  confirmText,
  loading,
  onConfirm,
  onCancel,
}: WarningAlertProps) {
  const { formatMessage } = useIntl();

  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Content>
        <Dialog.Header>
          {title ||
            formatMessage({
              id: 'components.popUpWarning.title',
              defaultMessage: 'Confirmation',
            })}
        </Dialog.Header>
        <Dialog.Body>{children}</Dialog.Body>
        <Dialog.Footer>
          <Flex justifyContent="stretch" gap={1} width="100%">
            <Dialog.Cancel disabled={loading}>
              <Button fullWidth variant="tertiary" disabled={loading}>
                {confirmText ||
                  formatMessage({
                    id: 'components.popUpWarning.button.cancel',
                    defaultMessage: 'Cancel',
                  })}
              </Button>
            </Dialog.Cancel>
            <Dialog.Action>
              <Button fullWidth variant="danger-light" onClick={onConfirm} loading={loading}>
                {confirmText ||
                  formatMessage({
                    id: 'components.popUpWarning.button.confirm',
                    defaultMessage: 'Confirm',
                  })}
              </Button>
            </Dialog.Action>
          </Flex>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
