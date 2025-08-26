import { useContext } from "react";
import { ResourceApprovalContext } from "../contexts/ResourceApprovalContextType";

export const useResourceApproval = () => {
  const context = useContext(ResourceApprovalContext);
  if (context === undefined) {
    throw new Error(
      "useResourceApproval must be used within a ResourceApprovalProvider"
    );
  }
  return context;
};
