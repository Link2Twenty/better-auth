// Compoenents
import { Box, Flex } from '@strapi/design-system';

const AdminReset = ({ id }: { id?: string }) => {
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
          <Flex direction="row" alignItems="stretch" gap={6}>
            Your id is {id || 'not provided'}
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default AdminReset;
