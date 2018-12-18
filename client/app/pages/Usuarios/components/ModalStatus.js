import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const { Subscribe } = require("unstated");
const UsuariosContainer = require('../../../containers/UsuariosContainer');

const ModalStatus = (props) => (
  <Subscribe to={[UsuariosContainer]}>{(usuariosContainer) => (            
    <Dialog 
      open={usuariosContainer.state.modal.status}
      contentStyle={{height: "80%"}}
      autoScrollBodyContent={true} >            
      <h2 align="center">{usuariosContainer.state.modal.statusTitle}</h2>

      <div className="modal__action-buttons">                        
        <FlatButton
          className="button__confirm"
          label="Confirmar"
          primary={true}                            
          onClick={() => usuariosContainer.onConfirmStatus()}
        />
        <FlatButton
          label="Cerrar"
          primary={true}
          onClick={() => usuariosContainer.closeModalStatus()}
        />
      </div>
    </Dialog>
  )}</Subscribe>
)

module.exports = ModalStatus