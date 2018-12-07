import React, { Component } from 'react';
import { CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import { withRouter } from 'react-router-dom';

const Table = require("./components/Table")
const ModalStatus = require("../components/ModalStatus")

const { Subscribe } = require("unstated")
const AlumnosContainer = require("../../../containers/AlumnosContainer")
const navigate = require("../../../../services/navigate")

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    AlumnosContainer.onLoadAlumnos()
    AlumnosContainer.onLoadProvincias()
  }

  render() {
    return (
      <Subscribe to={[AlumnosContainer]}>{(alumnosContainer) => {        
        const { history } = this.props
        const textActive = alumnosContainer.state.toActiveAlumnos.length > 0 
            ? `Activar (${alumnosContainer.state.toActiveAlumnos.length})`
            : 'Activar'
        const textDeactive = alumnosContainer.state.toDeactiveAlumnos.length > 0
            ? `Desactivar (${alumnosContainer.state.toDeactiveAlumnos.length})`
            : 'Desactivar'
        return (
          <React.Fragment>
            <h4 className="ui-card__title">Configuración de alumnos</h4>
    
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <CardActions>
                <FlatButton label="Nuevo Alumno" onClick={() => {
                  alumnosContainer.onNewAlumno()
                  navigate.to(history, "/alumnos/config")
                }}  />
              </CardActions>
              <CardActions>
                <RaisedButton 
                  label={textActive} 
                  onClick={() => alumnosContainer.onActive()} 
                />
                <RaisedButton 
                  label={textDeactive} 
                  onClick={() => alumnosContainer.onDeactive()} 
                />
              </CardActions>
            </div>      
    
            <Table />
    
            <ModalStatus />
          </React.Fragment>
        )
      }}</Subscribe>
    )
  }
}

module.exports = withRouter(List)