import { Suspense, lazy, Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomeView from 'src/pages/home';
import LoadingScreen from 'src/components/LoadingScreen';
import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';
import MainLayout from './layouts/MainLayout';

type Routes = {
  exact?: boolean;
  path?: string | string[];
  guard?: any;
  layout?: any;
  component?: any;
  routes?: Routes;
}[];

export const renderRoutes = (routes: Routes = []): JSX.Element => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Component {...props} />
                  )}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes: Routes = [
  {
    exact: true,
    path: '/signin',
    guard: GuestGuard,
    component: lazy(() => import('src/pages/auth/Login'))
  },
  {
    exact: true,
    path: '/signup',
    guard: GuestGuard,
    component: lazy(() => import('src/pages/auth/Register'))
  },
  {
    exact: true,
    path: '/change-password-landing',
    guard: GuestGuard,
    component: lazy(() => import('src/pages/auth/ChangePasswordLanding'))
  },
  {
    exact: true,
    path: '/change-password',
    guard: GuestGuard,
    component: lazy(() => import('src/pages/auth/ChangePassword'))
  },
  {
    exact: true,
    path: '/change-password-sms',
    component: lazy(() => import('src/pages/auth/VerifyCodeSms'))
  },
  {
    exact: true,
    path: '/sms',
    guard: AuthGuard,
    component: lazy(() => import('src/pages/auth/VerifySms'))
  },
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/pages/errors/NotFound'))
  },
  {
    exact: true,
    path: '/statistics-dashboard',
    guard: AuthGuard,
    component: lazy(() => import('src/pages/home/statistics-dashboard'))
  },
  {
    path: '*',
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/',
        component: HomeView
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  }
];

export default routes;
