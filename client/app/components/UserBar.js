import React from 'react';
import { withRouter } from 'react-router-dom';
const { Subscribe } = require("unstated");

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';

const SecurityContainer = require('../containers/SecurityContainer');

const navigate = require("../../services/navigate");

const UserBar = (props) => {
  const { history } = props;
  return (
    <Subscribe to={[SecurityContainer]}>{(securityContainer) => (
      <div>
        {securityContainer.state.isAuthenticated &&
        <AppBar
          title={securityContainer.state.user}
          iconElementRight={<IconButton tooltip="Cerrar sesión" onClick={() => securityContainer.logout(() => navigate.to(history, "/login"))}>
              <PowerSettingsNew />
            </IconButton>}
        />
        }
      </div>
    )}    
    </Subscribe>
  )
};

module.exports = withRouter(UserBar);
// export default UserBar;
