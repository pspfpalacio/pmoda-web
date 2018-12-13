import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
// import { withRouter } from 'react-router-dom';

const { Subscribe } = require("unstated")
const SecurityContainer = require('../../containers/SecurityContainer')
const navigate = require("../../../services/navigate")

const Menu = (props) => (
  <Subscribe to={[SecurityContainer]}>{(securityContainer) => {
    const {history} = props
    return (
      <div>
        {securityContainer.state.isAuthenticated &&
        <List>
          <Subheader>Opciones</Subheader>
          <ListItem
            key={1}
            primaryText="Inscripción"
            nestedItems={[
              <Link key={11} to="/inscripcion"><ListItem
                key={1.1}
                style={{marginLeft: "18px"}}
                primaryText="Inscripción"
              /></Link>
            ]}
          />
          {/* <Link key={21} to="cursos/list"><ListItem
            key={2}
            primaryText="Cursos"
          /></Link> */}
          {/* <Link key={31} to="alumnos/list"><ListItem
            key={3}
            primaryText="Alumnos"
          /></Link> */}
          <ListItem
            key={2}
            primaryText="Cursos"
            onClick={() => navigate.to(history, "/cursos/list")}
          />          
          <ListItem
            key={3}
            primaryText="Alumnos"
            onClick={() => navigate.to(history, "/alumnos/list")}
          />
          <ListItem
            key={4}
            primaryText="Profesores"
            onClick={() => navigate.to(history, "/profesors/list")}
          />
          <ListItem
            key={5}
            primaryText="Usuarios"
            onClick={() => navigate.to(history, "/usuarios/list")}
          />
        </List>
        }
      </div>
  )}
  }</Subscribe>
);

// export default Menu;
module.exports = withRouter(Menu)
