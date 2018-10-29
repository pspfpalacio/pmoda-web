import React, { Component } from 'react';
import {
  Route,
  Redirect
} from "react-router-dom";

const { Subscribe } = require("unstated")
const SecurityContainer = require('../../containers/SecurityContainer');

const PrivateRoute = ({ component: Component }) => (
  <Subscribe to={[SecurityContainer]}>{(securityContainer) => (
    <Route
      render={props =>
        securityContainer.state.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )}    
  </Subscribe>
);

export default PrivateRoute;
