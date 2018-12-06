import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const { Subscribe } = require("unstated");
const ProfesoresContainer = require('../../../containers/ProfesoresContainer');

const navigate = require("../../../../services/navigate")

const ModalConfirm = (props) => (
  <Subscribe to={[ProfesoresContainer]}>{(profesoresContainer) => {
    const { history } = props
    return (            
      <Dialog 
        open={profesoresContainer.state.modal.confirm}
        contentStyle={{height: "80%"}}
        autoScrollBodyContent={true} >            
        <h2 align="center">¿Está seguro que desea confirmar el profesor?</h2>

        <div className="modal__action-buttons">                        
          <FlatButton
            className="button__confirm"
            label="Confirmar"
            primary={true}                            
            onClick={() => profesoresContainer.onConfirm(() => navigate.to(history, "/profesors/list"))}
          />
          <FlatButton
            label="Cerrar"
            primary={true}
            onClick={() => profesoresContainer.closeModal()}
          />
        </div>
      </Dialog>
    )}
  }</Subscribe>
)

module.exports = withRouter(ModalConfirm)
