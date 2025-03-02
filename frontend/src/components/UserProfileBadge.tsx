import React from 'react';
import { Badge, Flex, Avatar, Box, Text, Tooltip } from '@chakra-ui/react';
import { useUser } from '@clerk/clerk-react';

interface UserProfileBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showRole?: boolean;
}

const UserProfileBadge: React.FC<UserProfileBadgeProps> = ({ 
  size = 'md', 
  showRole = true 
}) => {
  const { user, isSignedIn } = useUser();
  
  if (!isSignedIn) return null;
  
  const userRole = user?.publicMetadata?.role as string || 'user';
  const isApproved = user?.publicMetadata?.isApproved as boolean;
  
  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'superAdmin':
        return 'purple';
      case 'admin':
        return 'blue';
      default:
        return 'gray';
    }
  };
  
  const avatarSize = {
    sm: 'xs',
    md: 'sm',
    lg: 'md'
  }[size];
  
  const textSize = {
    sm: 'xs',
    md: 'sm',
    lg: 'md'
  }[size];
  
  return (
    <Flex alignItems="center" gap={2}>
      <Avatar size={avatarSize} src={user.imageUrl} name={`${user.firstName} ${user.lastName}`} />
      <Box>
        <Text fontSize={textSize} fontWeight="medium">{user.firstName} {user.lastName}</Text>
        {showRole && (
          <Flex gap={1} mt="1px">
            <Tooltip label={userRole === 'superAdmin' ? 'Super Administrator' : userRole === 'admin' ? 'Administrator' : 'Standard User'}>
              <Badge size="sm" colorScheme={getRoleBadgeColor()}>
                {userRole}
              </Badge>
            </Tooltip>
            
            {userRole !== 'user' && (
              <Badge size="sm" colorScheme={isApproved ? 'green' : 'yellow'}>
                {isApproved ? 'Approved' : 'Pending'}
              </Badge>
            )}
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default UserProfileBadge;