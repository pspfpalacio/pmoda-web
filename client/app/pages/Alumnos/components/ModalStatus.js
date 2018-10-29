import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const { Subscribe } = require("unstated");
const AlumnosContainer = require('../../../containers/AlumnosContainer');

const ModalStatus = (props) => (
  <Subscribe to={[AlumnosContainer]}>{(alumnosContainer) => (            
    <Dialog 
      open={alumnosContainer.state.modal.status}
      contentStyle={{height: "80%"}}
      autoScrollBodyContent={true} >            
      <h2 align="center">{alumnosContainer.state.modal.statusTitle}</h2>

      <div className="modal__action-buttons">                        
        <FlatButton
          className="button__confirm"
          label="Confirmar"
          primary={true}                            
          onClick={() => alumnosContainer.onConfirmStatus()}
        />
        <FlatButton
          label="Cerrar"
          primary={true}
          onClick={() => alumnosContainer.closeModalStatus()}
        />
      </div>
    </Dialog>
  )}</Subscribe>
)

module.exports = ModalStatus