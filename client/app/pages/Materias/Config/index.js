import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { CardTitle } from 'material-ui/Card';

const { Subscribe } = require("unstated");

const Select = require("react-select").default;
const ModalConfirm = require('../components/ModalConfirm');
const Table = require('./components/Table');

const MateriasContainer = require("../../../containers/MateriasContainer");
const navigate = require("../../../../services/navigate");

class Config extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    MateriasContainer.onLoadCursos();
    MateriasContainer.onLoadProfesores();
  }

  render() {
    return (
      <Subscribe to={[MateriasContainer]}>{(materiasContainer) => {
        const { history } = this.props
        return (
          <React.Fragment>
            <h4 className="ui-card__title">Configuración de materias</h4>
    
            <CardTitle
              title={materiasContainer.state.configTitle}
            />
            <div className="form__body">
              <h5 style={{color: "#666", marginTop: "0", marginBottom: "0.5em"}}>Datos de la materia</h5>
              <TextField
                name="name"
                hintText="Nombre"
                floatingLabelText="Nombre"
                floatingLabelFixed={true}
                fullWidth={true}
                value={materiasContainer.state.materia.name}
                errorText={materiasContainer.onRequiredInput('name')}
                onChange={(e) => materiasContainer.setParams('materia', {'name': e.target.value})}
              />              
              <div className="ui-label__select">Curso</div>
              <div style={{width: "69%"}}>
                <Select
                  placeholder="Seleccione..."
                  options={materiasContainer.state.cursos}
                  getOptionLabel={(option) => option.nombre}
                  getOptionValue={(option) => option._id}
                  isClearable={true}
                  loadingPlaceholder="Cargando..."
                  noResultsText="No se encontraron cursos"
                  isLoading={materiasContainer.state.loading.cursos}
                  value={materiasContainer.state.materia.curso}
                  onChange={value => materiasContainer.setParams('materia', { curso: value })}
                />
              </div>
              <div className="ui-label__select">Profesor titular</div>
              <div style={{width: "69%"}}>
                <Select
                  placeholder="Seleccione..."
                  options={materiasContainer.state.profesores}
                  getOptionLabel={(option) => `${option.lastname}, ${option.name}`}
                  getOptionValue={(option) => option._id}
                  isClearable={true}
                  loadingPlaceholder="Cargando..."
                  noResultsText="No se encontraron profesores"
                  isLoading={materiasContainer.state.loading.profesores}
                  value={materiasContainer.state.materia.instructor_primary}
                  onChange={value => materiasContainer.setParams('materia', { instructor_primary: value })}
                />
              </div>
              <div className="ui-label__select">Profesor suplente</div>
              <div style={{width: "69%"}}>
                <Select
                  placeholder="Seleccione..."
                  options={materiasContainer.state.profesores}
                  getOptionLabel={(option) => `${option.lastname}, ${option.name}`}
                  getOptionValue={(option) => option._id}
                  isClearable={true}
                  loadingPlaceholder="Cargando..."
                  noResultsText="No se encontraron profesores"
                  isLoading={materiasContainer.state.loading.profesores}
                  value={materiasContainer.state.materia.instructor_alternate}
                  onChange={value => materiasContainer.setParams('materia', { instructor_alternate: value })}
                />
              </div>             
    
            </div>
            <Table />
            <div className="form__action-buttons">                        
              <FlatButton
                className="button__confirm"
                label="Aceptar"
                primary={true}                            
                onClick={() => materiasContainer.onAcept()}
              />
              <FlatButton
                  label="Volver"
                  primary={true}
                  onClick={() => navigate.to(history, "/materias/list")}
              />
            </div>
            <ModalConfirm />
          </React.Fragment>
        )
      }}</Subscribe>
    )
  }
}

module.exports = withRouter(Config)