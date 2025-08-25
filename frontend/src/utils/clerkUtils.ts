/**
 * Utility to inject user role and status information into the Clerk dropdown
 */

// Helper to create badge element with appropriate styling
const createBadge = (text: string, color: string): HTMLSpanElement => {
  const badge = document.createElement("span");
  badge.innerText = text;
  badge.style.backgroundColor = color;
  badge.style.color = "white";
  badge.style.padding = "2px 8px";
  badge.style.borderRadius = "4px";
  badge.style.fontSize = "12px";
  badge.style.fontWeight = "bold";
  return badge;
};

// Create a label element
const createLabel = (text: string): HTMLSpanElement => {
  const label = document.createElement("span");
  label.innerText = text;
  label.style.fontWeight = "bold";
  label.style.marginRight = "8px";
  return label;
};

// Create a container for a label-badge pair
const createInfoRow = (): HTMLDivElement => {
  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.alignItems = "center";
  row.style.marginBottom = "8px";
  return row;
};

/**
 * Injects role and status information at the top of the Clerk dropdown
 * This function should be called after the dropdown opens
 */
export const injectUserInfoIntoClerkDropdown = (
  role: string | null,
  isApproved: boolean,
  roleIcon: string = ""
): void => {
  try {
    // Wait a bit for the Clerk dropdown to fully render
    setTimeout(() => {
      // Find the Clerk dropdown popup
      const popover = document.querySelector(".cl-userButtonPopoverCard");

      if (!popover) return;

      // Check if our custom info is already there
      const existingInfo = popover.querySelector(".custom-user-info");
      if (existingInfo) return;

      // Create container for our custom info
      const container = document.createElement("div");
      container.className = "custom-user-info";
      container.style.padding = "12px 16px";
      container.style.borderBottom = "1px solid rgba(229, 231, 235, 0.5)";
      container.style.margin = "0 0 8px 0";

      // Create role info row
      const roleRow = createInfoRow();
      roleRow.appendChild(createLabel("Role:"));

      // Determine role badge color
      let roleColor = "#48BB78"; // Default green
      if (role === "superAdmin") roleColor = "#805AD5"; // Purple
      else if (role === "admin") roleColor = "#4299E1"; // Blue

      // Format role display
      const formattedRole = role
        ? role
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
        : "User";

      const roleBadge = createBadge(`${roleIcon} ${formattedRole}`, roleColor);
      roleRow.appendChild(roleBadge);
      container.appendChild(roleRow);

      // Create status info row
      const statusRow = createInfoRow();
      statusRow.appendChild(createLabel("Status:"));
      const statusBadge = createBadge(
        isApproved ? "Approved" : "Pending Approval",
        isApproved ? "#48BB78" : "#ECC94B"
      );
      statusRow.appendChild(statusBadge);
      container.appendChild(statusRow);

      // Insert our custom info at the top of the dropdown, right after the header
      const header = popover.querySelector(".cl-userButtonPopoverHeader");
      if (header && header.nextSibling) {
        popover.insertBefore(container, header.nextSibling);
      } else {
        // Fallback - insert at the beginning
        const firstChild = popover.firstChild;
        if (firstChild) {
          popover.insertBefore(container, firstChild);
        } else {
          popover.appendChild(container);
        }
      }
    }, 100); // Increase timeout to ensure dropdown is fully rendered
  } catch (error) {
    console.error("Error injecting user info into Clerk dropdown:", error);
  }
};

/**
 * Sets up a mutation observer to detect when the Clerk dropdown opens
 * and injects our custom info
 */
export const setupClerkDropdownEnhancement = (
  role: string | null,
  isApproved: boolean,
  roleIcon: string = ""
): void => {
  try {
    // Define proper type for window with Clerk observer
    const windowWithObserver = window as Window & {
      __clerkObserver?: MutationObserver;
    };
    
    // First, ensure any previous observers are disconnected
    if (windowWithObserver.__clerkObserver) {
      windowWithObserver.__clerkObserver.disconnect();
    }

    // Create a MutationObserver to watch for the dropdown being added to the DOM
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          // Check if the added node is the Clerk dropdown
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i] as HTMLElement;
            if (node.classList?.contains("cl-userButtonPopoverCard")) {
              // Found the dropdown, inject our info
              injectUserInfoIntoClerkDropdown(role, isApproved, roleIcon);
              return;
            }
          }
        }
      }
    });

    // Store observer on window object so we can disconnect it later
    windowWithObserver.__clerkObserver = observer;

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (error) {
    console.error("Error setting up Clerk dropdown enhancement:", error);
  }
};
