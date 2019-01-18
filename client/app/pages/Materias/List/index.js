import React, { Component } from 'react';
import { CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import { withRouter } from 'react-router-dom';

const Table = require("./components/Table")
const ModalStatus = require("../components/ModalStatus")

const { Subscribe } = require("unstated")
const MateriasContainer = require("../../../containers/MateriasContainer")
const navigate = require("../../../../services/navigate")

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    MateriasContainer.onLoadMaterias();
  }

  render() {
    return (
      <Subscribe to={[MateriasContainer]}>{(materiasContainer) => {        
        const { history } = this.props
        const textActive = materiasContainer.state.toActive.length > 0 
            ? `Activar (${materiasContainer.state.toActive.length})`
            : 'Activar'
        const textDeactive = materiasContainer.state.toDeactive.length > 0
            ? `Desactivar (${materiasContainer.state.toDeactive.length})`
            : 'Desactivar'
        return (
          <React.Fragment>
            <h4 className="ui-card__title">Configuración de materias</h4>
    
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <CardActions>
                <FlatButton label="Nueva Materia" onClick={() => {
                  materiasContainer.onNew();
                  navigate.to(history, "/materias/config");
                }}  />
              </CardActions>
              <CardActions>
                <RaisedButton 
                  label={textActive} 
                  onClick={() => materiasContainer.onActive()} 
                />
                <RaisedButton 
                  label={textDeactive} 
                  onClick={() => materiasContainer.onDeactive()} 
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