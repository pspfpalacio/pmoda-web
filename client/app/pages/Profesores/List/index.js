import React, { Component } from 'react';
import { CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import { withRouter } from 'react-router-dom';

const Table = require("./components/Table")
const ModalStatus = require("../components/ModalStatus")

const { Subscribe } = require("unstated")
const ProfesoresContainer = require("../../../containers/ProfesoresContainer")
const navigate = require("../../../../services/navigate")

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    ProfesoresContainer.onLoadProfesores()
    ProfesoresContainer.onLoadProvincias()
  }

  render() {
    return (
      <Subscribe to={[ProfesoresContainer]}>{(profesoresContainer) => {        
        const { history } = this.props
        const textActive = profesoresContainer.state.toActiveProfesores.length > 0 
            ? `Activar (${profesoresContainer.state.toActiveProfesores.length})`
            : 'Activar'
        const textDeactive = profesoresContainer.state.toDeactiveProfesores.length > 0
            ? `Desactivar (${profesoresContainer.state.toDeactiveProfesores.length})`
            : 'Desactivar'
        return (
          <React.Fragment>
            <h4 className="ui-card__title">Configuración de profesores</h4>
    
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <CardActions>
                <FlatButton label="Nuevo Profesor" onClick={() => {
                  profesoresContainer.onNewProfesor()
                  navigate.to(history, "/profesors/config")
                }}  />
              </CardActions>
              <CardActions>
                <RaisedButton 
                  label={textActive} 
                  onClick={() => profesoresContainer.onActive()} 
                />
                <RaisedButton 
                  label={textDeactive} 
                  onClick={() => profesoresContainer.onDeactive()} 
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