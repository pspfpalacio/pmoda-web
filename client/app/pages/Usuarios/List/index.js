import React, { Component } from 'react';
import { CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import { withRouter } from 'react-router-dom';

const Table = require("./components/Table")
const ModalStatus = require("../components/ModalStatus")

const { Subscribe } = require("unstated")
const UsuariosContainer = require("../../../containers/UsuariosContainer")
const navigate = require("../../../../services/navigate")

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    UsuariosContainer.onLoadUsuarios();    
  }

  render() {
    return (
      <Subscribe to={[UsuariosContainer]}>{(usuariosContainer) => {        
        const { history } = this.props
        const textActive = usuariosContainer.state.toActiveUsuarios.length > 0 
            ? `Activar (${usuariosContainer.state.toActiveUsuarios.length})`
            : 'Activar'
        const textDeactive = usuariosContainer.state.toDeactiveUsuarios.length > 0
            ? `Desactivar (${usuariosContainer.state.toDeactiveUsuarios.length})`
            : 'Desactivar'
        return (
          <React.Fragment>
            <h4 className="ui-card__title">Configuración de usuarios</h4>
    
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <CardActions>
                <FlatButton label="Nuevo Usuario" onClick={() => {
                  usuariosContainer.onNewUsuario()
                  navigate.to(history, "/usuarios/config")
                }}  />
              </CardActions>
              <CardActions>
                <RaisedButton 
                  label={textActive} 
                  onClick={() => usuariosContainer.onActive()} 
                />
                <RaisedButton 
                  label={textDeactive} 
                  onClick={() => usuariosContainer.onDeactive()} 
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