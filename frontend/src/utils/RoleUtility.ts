export const ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'superAdmin'
  };
  
  export const hasRole = (userRole: string | undefined | null, requiredRole: string): boolean => {
    if (!userRole) return false;
    
    // SuperAdmin can do everything
    if (userRole === ROLES.SUPER_ADMIN) return true;
    
    // Admin can do admin and user things
    if (userRole === ROLES.ADMIN && 
        (requiredRole === ROLES.ADMIN || requiredRole === ROLES.USER)) {
      return true;
    }
    
    // Regular user can only do user things
    if (userRole === ROLES.USER && requiredRole === ROLES.USER) {
      return true;
    }
    
    return false;
  };
  
  export const canEditResource = (
    userRole: string | undefined | null, 
    resourceUserId: number | undefined | null,
    userId: number | undefined | null
  ): boolean => {
    // SuperAdmin can edit any resource
    if (userRole === ROLES.SUPER_ADMIN) return true;
    
    // Admin can only edit their own resources
    if (userRole === ROLES.ADMIN && resourceUserId === userId) return true;
    
    // Users can't edit resources
    return false;
  };