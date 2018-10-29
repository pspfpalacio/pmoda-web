import React, { Component } from 'react';
import { CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import { withRouter } from 'react-router-dom';

const CursosTable = require("./components/Table")
const ModalStatus = require("../components/ModalStatus")

const { Subscribe } = require("unstated")
const CursosContainer = require("../../../containers/CursosContainer")
const navigate = require("../../../../services/navigate")

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    CursosContainer.onLoadCursos()
  }

  render() {
    return (
      <Subscribe to={[CursosContainer]}>{(cursosContainer) => {        
        const { history } = this.props
        const textActive = cursosContainer.state.toActiveCursos.length > 0 
            ? `Activar (${cursosContainer.state.toActiveCursos.length})`
            : 'Activar'
        const textDeactive = cursosContainer.state.toDeactiveCursos.length > 0
            ? `Desactivar (${cursosContainer.state.toDeactiveCursos.length})`
            : 'Desactivar'
        return (
          <React.Fragment>
            <h4 className="ui-card__title">Configuración de cursos</h4>
    
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <CardActions>
                <FlatButton label="Nuevo Curso" onClick={() => {
                  cursosContainer.onNewCurse()
                  navigate.to(history, "/cursos/config")
                }}  />
              </CardActions>
              <CardActions>
                <RaisedButton 
                  label={textActive} 
                  onClick={() => cursosContainer.onActiveCursos()} 
                />
                <RaisedButton 
                  label={textDeactive} 
                  onClick={() => cursosContainer.onDeactiveCursos()} 
                />
              </CardActions>
            </div>      
    
            <CursosTable />
    
            <ModalStatus />
          </React.Fragment>
        )
      }}</Subscribe>
    )
  }
}

module.exports = withRouter(List)