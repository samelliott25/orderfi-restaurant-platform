import { Link } from 'wouter';
import { ChefHat } from 'lucide-react';

export function Footer() {
  const customerLinks = [
    { name: 'Order', href: '/order' },
    { name: 'Menu', href: '/menu' },
    { name: 'Cart', href: '/cart' },
    { name: 'Scan Table', href: '/scan' },
  ];

  const businessLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Manage', href: '/manage' },
    { name: 'Orders', href: '/orders' },
    { name: 'Inventory', href: '/inventory' },
  ];

  const operationsLinks = [
    { name: 'Kitchen Display', href: '/kds' },
    { name: 'Tables', href: '/tables' },
    { name: 'Staff', href: '/staff' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <footer 
      className="w-full border-t-2 py-8 px-6 mt-auto"
      style={{ 
        background: 'var(--vintage-brown)', 
        borderColor: 'var(--vintage-sepia)',
        color: 'var(--vintage-cream)'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-5 h-5" style={{ color: 'var(--vintage-cream)' }} />
              <span className="playwrite-font text-lg" style={{ color: 'var(--vintage-cream)' }}>
                OrderFi
              </span>
            </div>
            <p className="text-sm typewriter-text opacity-80" style={{ fontFamily: '"Courier Prime", monospace' }}>
              AI-powered restaurant ordering
            </p>
          </div>

          {/* Customer Links */}
          <div>
            <h3 className="font-semibold mb-3 text-sm" style={{ fontFamily: '"Special Elite", cursive' }}>
              Customers
            </h3>
            <ul className="space-y-2">
              {customerLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm typewriter-text opacity-70 hover:opacity-100 transition-opacity"
                    style={{ fontFamily: '"Courier Prime", monospace' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Links */}
          <div>
            <h3 className="font-semibold mb-3 text-sm" style={{ fontFamily: '"Special Elite", cursive' }}>
              Business
            </h3>
            <ul className="space-y-2">
              {businessLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm typewriter-text opacity-70 hover:opacity-100 transition-opacity"
                    style={{ fontFamily: '"Courier Prime", monospace' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operations Links */}
          <div>
            <h3 className="font-semibold mb-3 text-sm" style={{ fontFamily: '"Special Elite", cursive' }}>
              Operations
            </h3>
            <ul className="space-y-2">
              {operationsLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm typewriter-text opacity-70 hover:opacity-100 transition-opacity"
                    style={{ fontFamily: '"Courier Prime", monospace' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div 
          className="mt-8 pt-4 border-t text-center text-sm typewriter-text opacity-60"
          style={{ borderColor: 'rgba(245, 240, 230, 0.2)', fontFamily: '"Courier Prime", monospace' }}
        >
          &copy; {new Date().getFullYear()} OrderFi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
