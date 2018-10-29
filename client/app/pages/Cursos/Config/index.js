import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import ModalConfirm from '../components/ModalConfirm';

const { Subscribe } = require("unstated")
const CursosContainer = require("../../../containers/CursosContainer")

const navigate = require("../../../../services/navigate")

const Config = (props) => (
  <Subscribe to={[CursosContainer]}>{(cursosContainer) => {
    const {history} = props
    return (
      <React.Fragment>
        <h4 className="ui-card__title">Configuración de cursos</h4>

        <CardTitle
          title={cursosContainer.state.configTitle}
        />
        <div className="form__body">
          <TextField
            name="nombre"
            hintText="Nombre"
            floatingLabelText="Nombre"
            floatingLabelFixed={true}
            fullWidth={true}
            value={cursosContainer.state.nombre}
            errorText={cursosContainer.onRequiredInput('nombre')}
            onChange={(e) => cursosContainer.setInputText(e)}
          />
          <TextField
            name="cantHoras"
            hintText="Horas de cursado"
            floatingLabelText="Horas de cursado"
            type="number"
            floatingLabelFixed={true}
            fullWidth={true}            
            value={cursosContainer.state.cantHoras}
            errorText={cursosContainer.onRequiredInput('cantHoras')}
            onChange={(e) => cursosContainer.setInputText(e)}
          />
          <TextField
            name="duracionMeses"
            hintText="Duración (en Meses)"
            floatingLabelText="Duración (en Meses)"
            type="number"
            floatingLabelFixed={true}
            fullWidth={true}            
            value={cursosContainer.state.duracionMeses}
            errorText={cursosContainer.onRequiredInput('duracionMeses')}
            onChange={(e) => cursosContainer.setInputText(e)}
          />
          <TextField
            name="costoCurso"
            hintText="Costo de curso"
            floatingLabelText="Costo de curso"
            type="number"
            floatingLabelFixed={true}
            fullWidth={true}            
            value={cursosContainer.state.costoCurso}
            errorText={cursosContainer.onRequiredInput('costoCurso')}
            onChange={(e) => cursosContainer.setInputText(e)}
          />
          <TextField
            name="costoMatricula"
            hintText="Costo de matrícula"
            floatingLabelText="Costo de matrícula"
            type="number"
            floatingLabelFixed={true}
            fullWidth={true}            
            value={cursosContainer.state.costoMatricula}
            errorText={cursosContainer.onRequiredInput('costoMatricula')}
            onChange={(e) => cursosContainer.setInputText(e)}
          />
        </div>
        <div className="form__action-buttons">                        
          <FlatButton
            className="button__confirm"
            label="Aceptar"
            primary={true}                            
            onClick={() => cursosContainer.onAcept()}
          />
          <FlatButton
              label="Volver"
              primary={true}
              onClick={() => navigate.to(history, "/cursos/list")}
          />
        </div>
        <ModalConfirm />
      </React.Fragment>
    )
  }}</Subscribe>
);

module.exports = withRouter(Config)