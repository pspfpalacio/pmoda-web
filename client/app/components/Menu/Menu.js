import React from 'react';
import { Link } from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

const { Subscribe } = require("unstated")
const SecurityContainer = require('../../containers/SecurityContainer');

const Menu = () => (
  <Subscribe to={[SecurityContainer]}>{(securityContainer) => (
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
        <Link key={21} to="cursos/list"><ListItem
          key={2}
          primaryText="Cursos"
        /></Link>
        <Link key={31} to="alumnos/list"><ListItem
          key={3}
          primaryText="Alumnos"
        /></Link>
      </List>
      }
    </div>
  )}  
  </Subscribe>
);

export default Menu;
