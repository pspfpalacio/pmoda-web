import React from 'react';
import AppBar from 'material-ui/AppBar';

const { Subscribe } = require("unstated")
const SecurityContainer = require('../../containers/SecurityContainer');

const UserBar = () => (
  <Subscribe to={[SecurityContainer]}>{(securityContainer) => (
    <div>
      {securityContainer.state.isAuthenticated &&
      <AppBar
        title={securityContainer.state.user}
      />
      }
    </div>
  )}    
  </Subscribe>
);

export default UserBar;
