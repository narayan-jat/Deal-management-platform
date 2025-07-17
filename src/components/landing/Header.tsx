import { GoldButton } from "@/components/ui/button"
import { Link } from "react-router-dom";
import { navigationConfig, NavigationItem } from "@/config/navigation";

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export default function Header({ isMenuOpen, toggleMenu }: HeaderProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (item: NavigationItem) => {
    if (item.type === 'scroll' && item.scrollTarget) {
      scrollToSection(item.scrollTarget);
    }
  };

  const handleMobileNavClick = (item: NavigationItem) => {
    if (item.type === 'scroll' && item.scrollTarget) {
      scrollToSection(item.scrollTarget);
      toggleMenu();
    }
  };

  const renderNavItem = (item: NavigationItem, isMobile = false) => {
    const baseClasses = "text-base font-medium no-underline text-neutral-600 hover:text-godex-primary transition-colors";
    const mobileClasses = isMobile ? "px-0 py-3 text-center w-full" : "";

    if (item.type === 'route' && item.path) {
      return (
        <Link 
          key={item.title}
          to={item.path} 
          className={`${baseClasses} ${mobileClasses}`}
        >
          {item.title}
        </Link>
      );
    }

    if (item.type === 'scroll') {
      return (
        <button
          key={item.title}
          onClick={() => isMobile ? handleMobileNavClick(item) : handleNavClick(item)}
          className={`${baseClasses} ${mobileClasses}`}
        >
          {item.title}
        </button>
      );
    }

    return null;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-godex-primary font-inter">
              GoDex
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationConfig.mainNav.map(item => renderNavItem(item))}
          </div>
          
          {/* Desktop Auth Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationConfig.authNav.map((item, index) => (
              <div key={item.title}>
                {item.title === "Sign Up" ? (
                  <Link to={item.path!}>
                    <GoldButton>
                      {item.title}
                    </GoldButton>
                  </Link>
                ) : (
                  renderNavItem(item)
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-godex-primary hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor"/>
              <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor"/>
              <rect x="4" y="16" width="16" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Main Navigation */}
            <div className="space-y-2">
              <div className="flex flex-col items-center space-y-2">
                {navigationConfig.mainNav.map(item => renderNavItem(item, true))}
              </div>
            </div>
            
            {/* Mobile Auth Navigation */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex flex-col items-center space-y-3">
                {navigationConfig.authNav.map((item, index) => (
                  <div key={item.title} className="w-full">
                    {item.title === "Sign Up" || item.title === "Sign in" ? (
                      <Link to={item.path!} className="block">
                        <button className="w-full px-4 py-3 text-base font-medium bg-godex-secondary text-black rounded-lg hover:bg-godex-secondary/90 transition-colors">
                          {item.title}
                        </button>
                      </Link>
                    ) : (
                      renderNavItem(item, true)
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
