'use client'
import React, { useState } from 'react'
import MobileMenuButton from './MobileMenuButton'
import Sidebar from './Sidebar'
import SidebarOverlay from './SidebarOverlay'



const Nav = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false)

  return (
  <>
    <MobileMenuButton showMenu={showMenu} setShowMenu={setShowMenu} />
    <Sidebar isMobileMenuOpen={showMenu} setShowMenu={setShowMenu} />
    <SidebarOverlay isMobileMenuOpen={showMenu} setShowMenu={setShowMenu} />
  </>
  )
}

export default Nav