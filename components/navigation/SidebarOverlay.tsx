import React from "react";

interface SidebarOverlayProps {
  isMobileMenuOpen: boolean
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarOverlay: React.FC<SidebarOverlayProps> = ( {setShowMenu, isMobileMenuOpen}) => {
  return (
    <div
      onClick={() => setShowMenu(false)}
      className={`fixed inset-0 z-30 md:hidden transition-transform dark:bg-neutral-950/60 bg-white/60 duration-75 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    />
  );
};

export default SidebarOverlay;