import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const { Subscribe } = require("unstated");
const MateriasContainer = require('../../../containers/MateriasContainer');

const ModalStatus = (props) => (
  <Subscribe to={[MateriasContainer]}>{(materiasContainer) => (            
    <Dialog 
      open={materiasContainer.state.modal.status}
      contentStyle={{height: "80%"}}
      autoScrollBodyContent={true} >            
      <h2 align="center">{materiasContainer.state.modal.statusTitle}</h2>

      <div className="modal__action-buttons">                        
        <FlatButton
          className="button__confirm"
          label="Confirmar"
          primary={true}                            
          onClick={() => materiasContainer.onConfirmStatus()}
        />
        <FlatButton
          label="Cerrar"
          primary={true}
          onClick={() => materiasContainer.closeModalStatus()}
        />
      </div>
    </Dialog>
  )}</Subscribe>
)

module.exports = ModalStatus;