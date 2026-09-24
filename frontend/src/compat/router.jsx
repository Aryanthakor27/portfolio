import './server-polyfill.js';
import React, { useMemo } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

// Next.js Link compatibility wrapper for React Router <Link to="...">
export const Link = React.forwardRef(function Link({ to, href, children, ...props }, ref) {
  const target = to || href || '#';
  return (
    <NextLink href={target} ref={ref} {...props}>
      {children}
    </NextLink>
  );
});

// Next.js NavLink compatibility wrapper for React Router <NavLink to="..." className={({ isActive }) => ...}>
export const NavLink = React.forwardRef(function NavLink({ to, href, className, children, ...props }, ref) {
  const router = useRouter();
  const target = to || href || '#';
  const currentPath = router?.asPath?.split('?')[0] || router?.pathname || '/';

  const isActive = currentPath === target || (target !== '/' && currentPath.startsWith(target));

  const resolvedClass = useMemo(() => {
    if (typeof className === 'function') {
      return className({ isActive });
    }
    return `${className || ''} ${isActive ? 'active' : ''}`.trim();
  }, [className, isActive]);

  return (
    <NextLink href={target} ref={ref} className={resolvedClass} {...props}>
      {children}
    </NextLink>
  );
});

// React Router useLocation() compatibility
export function useLocation() {
  const router = useRouter();
  const asPath = router?.asPath || '/';
  const [pathname, searchStr] = asPath.split('?');
  const search = searchStr ? `?${searchStr}` : '';
  return { pathname: pathname || '/', search };
}

// React Router useNavigate() compatibility
export function useNavigate() {
  const router = useRouter();
  return (to, options) => {
    if (!router) return;
    if (typeof to === 'number') {
      if (to === -1) window.history.back();
      return;
    }
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

// React Router <Navigate to="..." replace /> compatibility
export function Navigate({ to, replace }) {
  const router = useRouter();
  React.useEffect(() => {
    if (router) {
      if (replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    }
  }, [router, to, replace]);
  return null;
}

// React Router useSearchParams() compatibility
export function useSearchParams() {
  const router = useRouter();
  const searchParams = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    const query = router?.query || {};
    const sp = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach(val => sp.append(k, val));
      } else if (v !== undefined) {
        sp.set(k, v);
      }
    });
    return sp;
  }, [router?.asPath, router?.query]);

  const setSearchParams = (params) => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(params);
      const newUrl = `${window.location.pathname}?${sp.toString()}`;
      window.history.replaceState(null, '', newUrl);
    }
  };

  return [searchParams, setSearchParams];
}

export function BrowserRouter({ children }) {
  return <>{children}</>;
}

export function Routes({ children }) {
  return <>{children}</>;
}

export function Route({ element }) {
  return element;
}

export function useParams() {
  const router = useRouter();
  return router?.query || {};
}

export function useHref(to) {
  return to || '';
}

export function useMatch() {
  return null;
}

export function useInRouterContext() {
  return true;
}

export function Outlet() {
  return null;
}

export function createSearchParams(init) {
  return new URLSearchParams(init);
}

export default {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  Navigate,
  useSearchParams,
  useParams,
  useHref,
  useMatch,
  useInRouterContext,
  Outlet,
  createSearchParams,
  BrowserRouter,
  Routes,
  Route
};

