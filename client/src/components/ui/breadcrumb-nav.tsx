import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const [location] = useLocation();

  // Auto-generate breadcrumbs based on current path if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/dashboard', icon: <Home className="h-4 w-4" /> }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      if (segment !== 'dashboard') {
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
          href: currentPath
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {index === breadcrumbItems.length - 1 ? (
            <span className="flex items-center gap-2 text-foreground font-medium">
              {item.icon}
              {item.label}
            </span>
          ) : (
            <Link href={item.href}>
              <span className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                {item.icon}
                {item.label}
              </span>
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}