import React from 'react';
import { useLocation } from 'wouter';

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface CreativeNavigationProps {
  items: NavigationItem[];
  className?: string;
}

export function CreativeNavigation({ items, className = '' }: CreativeNavigationProps) {
  const [location, setLocation] = useLocation();

  return (
    <nav className={`creative-nav ${className}`}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            setLocation(item.href);
          }}
          className={`creative-nav-item ${location === item.href ? 'active' : ''}`}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
        </a>
      ))}
    </nav>
  );
}