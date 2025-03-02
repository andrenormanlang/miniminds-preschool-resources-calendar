import { Button, ButtonProps } from '@chakra-ui/react';
import { useUser } from '@clerk/clerk-react';
import { hasRole } from '../utils/roles';

interface RoleBasedButtonProps extends ButtonProps {
  requiredRole: string;
  children: React.ReactNode;
}

const RoleBasedButton: React.FC<RoleBasedButtonProps> = ({ 
  requiredRole, 
  children, 
  ...props 
}) => {
  const { user, isSignedIn } = useUser();
  
  if (!isSignedIn) return null;
  
  const userRole = user?.publicMetadata?.role as string;
  
  if (!hasRole(userRole, requiredRole)) return null;
  
  return (
    <Button {...props}>
      {children}
    </Button>
  );
};

export default RoleBasedButton;