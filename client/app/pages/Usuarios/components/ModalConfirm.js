import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const { Subscribe } = require("unstated");
const UsuariosContainer = require('../../../containers/UsuariosContainer');

const navigate = require("../../../../services/navigate")

const ModalConfirm = (props) => (
  <Subscribe to={[UsuariosContainer]}>{(usuariosContainer) => {
    const { history } = props
    return (            
      <Dialog 
        open={usuariosContainer.state.modal.confirm}
        contentStyle={{height: "80%"}}
        autoScrollBodyContent={true} >            
        <h2 align="center">¿Está seguro que desea confirmar el usuario?</h2>

        <div className="modal__action-buttons">                        
          <FlatButton
            className="button__confirm"
            label="Confirmar"
            primary={true}                            
            onClick={() => usuariosContainer.onConfirm(() => navigate.to(history, "/usuarios/list"))}
          />
          <FlatButton
            label="Cerrar"
            primary={true}
            onClick={() => usuariosContainer.closeModal()}
          />
        </div>
      </Dialog>
    )}
  }</Subscribe>
)

module.exports = withRouter(ModalConfirm)
