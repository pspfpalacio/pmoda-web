import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const { Subscribe } = require("unstated");
const CursosContainer = require('../../../containers/CursosContainer');

const ModalStatus = (props) => (
  <Subscribe to={[CursosContainer]}>{(cursoContainer) => (            
    <Dialog 
      open={cursoContainer.state.modalStatus}
      contentStyle={{height: "80%"}}
      autoScrollBodyContent={true} >            
      <h2 align="center">{cursoContainer.state.modalStatusTitle}</h2>

      <div className="modal__action-buttons">                        
        <FlatButton
          className="button__confirm"
          label="Confirmar"
          primary={true}                            
          onClick={() => cursoContainer.onConfirmStatus()}
        />
        <FlatButton
          label="Cerrar"
          primary={true}
          onClick={() => cursoContainer.closeModalStatus()}
        />
      </div>
    </Dialog>
  )}</Subscribe>
)

module.exports = ModalStatus