import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const { Subscribe } = require("unstated");
const ProfesoresContainer = require('../../../containers/ProfesoresContainer');

const ModalStatus = (props) => (
  <Subscribe to={[ProfesoresContainer]}>{(profesoresContainer) => (            
    <Dialog 
      open={profesoresContainer.state.modal.status}
      contentStyle={{height: "80%"}}
      autoScrollBodyContent={true} >            
      <h2 align="center">{profesoresContainer.state.modal.statusTitle}</h2>

      <div className="modal__action-buttons">                        
        <FlatButton
          className="button__confirm"
          label="Confirmar"
          primary={true}                            
          onClick={() => profesoresContainer.onConfirmStatus()}
        />
        <FlatButton
          label="Cerrar"
          primary={true}
          onClick={() => profesoresContainer.closeModalStatus()}
        />
      </div>
    </Dialog>
  )}</Subscribe>
)

module.exports = ModalStatus