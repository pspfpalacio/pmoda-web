import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import { Card } from 'material-ui/Card';

import PrivateRoute from './pages/App/PrivateRoute';
import App from './pages/App/App';
import NotFound from './pages/App/NotFound';
import Login from './pages/Login/Login';
import Inscipcion from './pages/Inscripciones/Inscripcion';
// import Cursos from './pages/Cursos/Cursos';
import CursosConfig from './pages/Cursos/Config';
import CursosList from './pages/Cursos/List';

const Sucursal = require("./components/Sucursal");
const AlumnosConfig = require('./pages/Alumnos/Config')
const AlumnosList = require('./pages/Alumnos/List')
const ProfesorConfig = require('./pages/Profesores/Config')
const ProfesorList = require('./pages/Profesores/List')
const UsuariosList = require('./pages/Usuarios/List')
const UsuariosConfig = require('./pages/Usuarios/Config')
const MateriasList = require('./pages/Materias/List')
const MateriasConfig = require('./pages/Materias/Config')

import Home from './components/Home/Home';
import HelloWorld from './components/HelloWorld/HelloWorld';
import Spinner from './components/Spinner';

import './styles/styles.scss';

const { Provider } = require("unstated")
const { Subscribe } = require("unstated")

const UIContainer = require("./containers/UIContainer");
const SecurityContainer = require("./containers/SecurityContainer");

render((
  <Router>
    <Provider>
      <MuiThemeProvider>
        <Subscribe to={[UIContainer, SecurityContainer]}>{(uiContainer, securityContainer) => (
          <App>
            <React.Fragment>
              {securityContainer.state.isAuthenticated && <Sucursal />}              
              <Card style={{padding: "30px"}}>
                <Switch>
                  <PrivateRoute exact path="/" component={Home}/>
                  <Route path="/login" component={Login} />
                  <PrivateRoute path="/helloworld" component={HelloWorld}/>
                  <PrivateRoute path="/inscripcion" component={Inscipcion}/>
                  {/* <PrivateRoute path="/cursos" component={Cursos}/> */}
                  <PrivateRoute path="/cursos/list" component={CursosList}/>
                  <PrivateRoute path="/cursos/config" component={CursosConfig}/>
                  <PrivateRoute path="/alumnos/list" component={AlumnosList}/>
                  <PrivateRoute path="/alumnos/config" component={AlumnosConfig}/>
                  <PrivateRoute path="/profesors/list" component={ProfesorList}/>
                  <PrivateRoute path="/profesors/config" component={ProfesorConfig}/>
                  <PrivateRoute path="/usuarios/list" component={UsuariosList}/>
                  <PrivateRoute path="/usuarios/config" component={UsuariosConfig}/>
                  <PrivateRoute path="/materias/list" component={MateriasList}/>
                  <PrivateRoute path="/materias/config" component={MateriasConfig}/>
                  <Route component={NotFound}/>
                </Switch>

                <Snackbar
                  open={uiContainer.state.snackbar.open}
                  message={uiContainer.state.snackbar.message}
                  // autoHideDuration={uiContainer.state.autoHideDuration}
                  action={uiContainer.state.snackbar.action}
                  // onRequestClose={() => uiContainer.closeSnackbar()}
                  onActionClick={() => uiContainer.closeSnackbar()}
                />

                <Spinner 
                  size={uiContainer.state.spinner.size}
                  thickness={uiContainer.state.spinner.thickness}
                  show={uiContainer.state.spinner.show}
                  modifier={uiContainer.state.spinner.modifier}
                  label={uiContainer.state.spinner.label}
                  // className
                />
              </Card>
            </React.Fragment>
          </App>
        )}</Subscribe>        
      </MuiThemeProvider>
    </Provider>
  </Router>
), document.getElementById('app'));
