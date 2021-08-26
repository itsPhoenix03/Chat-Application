import React from 'react';
import { Redirect, Route } from 'react-router';

const PrivateRoute = ({ childern, ...routeProps }) => {
  const profile = false;

  if (!profile) return <Redirect to="/siginin" />;

  return <Route {...routeProps}>{childern}</Route>;
};

export default PrivateRoute;
