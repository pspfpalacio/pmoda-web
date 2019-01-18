import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const { Subscribe } = require("unstated");
const MateriasContainer = require('../../../containers/MateriasContainer');

const navigate = require("../../../../services/navigate")

const ModalConfirm = (props) => (
  <Subscribe to={[MateriasContainer]}>{(materiasContainer) => {
    const { history } = props
    return (            
      <Dialog 
        open={materiasContainer.state.modal.confirm}
        contentStyle={{height: "80%"}}
        autoScrollBodyContent={true} >            
        <h2 align="center">¿Está seguro que desea confirmar la materia?</h2>

        <div className="modal__action-buttons">                        
          <FlatButton
            className="button__confirm"
            label="Confirmar"
            primary={true}                            
            onClick={() => materiasContainer.onConfirm(() => navigate.to(history, "/materias/list"))}
          />
          <FlatButton
            label="Cerrar"
            primary={true}
            onClick={() => materiasContainer.closeModal()}
          />
        </div>
      </Dialog>
    )}
  }</Subscribe>
)

module.exports = withRouter(ModalConfirm);
