import { createContext } from "react";

export interface ResourceApprovalContextType {
  approveResource: (resourceId: number) => Promise<boolean>;
  rejectResource: (resourceId: number) => Promise<boolean>;
  isProcessing: boolean;
}

export const ResourceApprovalContext = createContext<
  ResourceApprovalContextType | undefined
>(undefined);
