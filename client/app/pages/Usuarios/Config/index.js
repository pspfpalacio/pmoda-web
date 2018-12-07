import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { CardTitle } from 'material-ui/Card';
// import DatePicker from 'material-ui/DatePicker';

const DatePicker = typeof window == "undefined" ? require("react-datepicker") : require("react-datepicker").default
const Select = require("react-select").default

const ModalConfirm = require('../components/ModalConfirm')

const { Subscribe } = require("unstated")
const moment = require("moment")
require('moment/locale/es')

const AlumnosContainer = require("../../../containers/AlumnosContainer")

const navigate = require("../../../../services/navigate")

class Config extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    AlumnosContainer.onLoadProvincias()
  }

  render() {
    return (
      <Subscribe to={[AlumnosContainer]}>{(alumnosContainer) => {
        const { history } = this.props
        return (
          <React.Fragment>
            <h4 className="ui-card__title">Configuración de alumnos</h4>
    
            <CardTitle
              title={alumnosContainer.state.configTitle}
            />
            <div className="form__body">
              <h5 style={{color: "#666", marginTop: "0", marginBottom: "0.5em"}}>Datos personales</h5>
              <TextField
                name="dni"
                hintText="DNI"
                floatingLabelText="DNI"
                type="number"
                floatingLabelFixed={true}
                fullWidth={true}            
                value={alumnosContainer.state.alumno.dni}
                errorText={alumnosContainer.onRequiredInput('dni')}
                onChange={(e) => alumnosContainer.setAlumno({'dni': e.target.value})}
              />
              <TextField
                name="name"
                hintText="Nombre"
                floatingLabelText="Nombre"
                floatingLabelFixed={true}
                fullWidth={true}
                value={alumnosContainer.state.alumno.name}
                errorText={alumnosContainer.onRequiredInput('name')}
                onChange={(e) => alumnosContainer.setAlumno({'name': e.target.value})}
              />
              <TextField
                name="lastname"
                hintText="Apellido"
                floatingLabelText="Apellido"
                floatingLabelFixed={true}
                fullWidth={true}
                value={alumnosContainer.state.alumno.lastname}
                errorText={alumnosContainer.onRequiredInput('lastname')}
                onChange={(e) => alumnosContainer.setAlumno({'lastname': e.target.value})}
              />
              <div className="ui-label__datepicker">Fecha de nacimiento</div>
              <DatePicker
                placeholderText="Fecha de nacimiento"
                className="form-control__field"
                showTimeSelect={false}
                dateFormat="DD/MM/YYYY"
                timeFormat="HH:mm"
                selected={alumnosContainer.state.alumno["birthdate"] ? moment(alumnosContainer.state.alumno["birthdate"]) : null}
                onChange={(dt) => {
                  if (dt.isValid()) {
                    alumnosContainer.setAlumno({birthdate: dt.format()})
                  } else {
                    alumnosContainer.setAlumno({birthdate: null})
                  }
                }}
              />          
              
              <h5 style={{color: "#666", marginTop: "2em", marginBottom: "0.5em"}}>Datos de domicilio</h5>    
              <div className="ui-label__select">Provincia</div>
              <div style={{width: "69%"}}>
                <Select
                  placeholder="Seleccione..."
                  options={alumnosContainer.state.provincias}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option._id}
                  isClearable={true}
                  loadingPlaceholder="Cargando..."
                  noResultsText="No se encontraron provincias"
                  isLoading={alumnosContainer.state.loading.provincias}
                  value={alumnosContainer.state.alumno.provincia}
                  onChange={value => alumnosContainer.setAlumno({ provincia: value }, () => alumnosContainer.onLoadLocalidades())}
                />
              </div>
              <div className="ui-label__select">Localidad</div>
              <div style={{width: "69%"}}>
                <Select
                  placeholder="Seleccione..."
                  options={alumnosContainer.state.localidades}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option._id}
                  isClearable={true}
                  loadingPlaceholder="Cargando..."
                  noResultsText="No se encontraron localidades"
                  isLoading={alumnosContainer.state.loading.localidades}
                  value={alumnosContainer.state.alumno.location}
                  onChange={value => alumnosContainer.setAlumno({ location: value })}
                />
              </div>
              <TextField
                name="address_postcode"
                hintText="Cod. postal"
                floatingLabelText="Cod. postal"
                type="number"
                floatingLabelFixed={true}
                fullWidth={true}            
                value={alumnosContainer.state.alumno.address_postcode}
                errorText={alumnosContainer.onRequiredInput('address_postcode')}
                onChange={(e) => alumnosContainer.setAlumno({'address_postcode': e.target.value})}
              />
              <TextField
                name="address_street"
                hintText="Calle"
                floatingLabelText="Calle"
                floatingLabelFixed={true}
                fullWidth={true}
                value={alumnosContainer.state.alumno.address_street}
                errorText={alumnosContainer.onRequiredInput('address_street')}
                onChange={(e) => alumnosContainer.setAlumno({'address_street': e.target.value})}
              />
              <TextField
                name="address_number"
                hintText="Número"
                floatingLabelText="Número"
                type="number"
                floatingLabelFixed={true}
                fullWidth={true}
                value={alumnosContainer.state.alumno.address_number}
                errorText={alumnosContainer.onRequiredInput('address_number')}
                onChange={(e) => alumnosContainer.setAlumno({'address_number': e.target.value})}
              />
              <TextField
                name="address_floor"
                hintText="Piso"
                floatingLabelText="Piso"
                floatingLabelFixed={true}
                fullWidth={true}
                value={alumnosContainer.state.alumno.address_floor}
                // errorText={alumnosContainer.onRequiredInput('address_floor')}
                onChange={(e) => alumnosContainer.setAlumno({'address_floor': e.target.value})}
              />
              <TextField
                name="address_department"
                hintText="Departamento"
                floatingLabelText="Departamento"
                floatingLabelFixed={true}
                fullWidth={true}
                value={alumnosContainer.state.alumno.address_department}
                // errorText={alumnosContainer.onRequiredInput('address_floor')}
                onChange={(e) => alumnosContainer.setAlumno({'address_department': e.target.value})}
              />

              <h5 style={{color: "#666", marginTop: "2em", marginBottom: "0.5em"}}>Datos de contacto</h5>
              <TextField
                name="email"
                hintText="Email"
                floatingLabelText="Email"
                floatingLabelFixed={true}
                fullWidth={true}
                value={alumnosContainer.state.alumno.email}
                errorText={alumnosContainer.onRequiredInput('email')}
                onChange={(e) => alumnosContainer.setAlumno({'email': e.target.value})}
              />
              <TextField
                name="cell_phone"
                hintText="Tel. celular"
                floatingLabelText="Tel. celular"
                floatingLabelFixed={true}
                fullWidth={true}
                value={alumnosContainer.state.alumno.cell_phone}
                errorText={alumnosContainer.onRequiredInput('cell_phone')}
                onChange={(e) => alumnosContainer.setAlumno({'cell_phone': e.target.value})}
              />
              <TextField
                name="home_phone"
                hintText="Tel. fijo"
                floatingLabelText="Tel. fijo"
                floatingLabelFixed={true}
                fullWidth={true}
                value={alumnosContainer.state.alumno.home_phone}
                // errorText={alumnosContainer.onRequiredInput('home_phone')}
                onChange={(e) => alumnosContainer.setAlumno({'home_phone': e.target.value})}
              />
    
            </div>
            <div className="form__action-buttons">                        
              <FlatButton
                className="button__confirm"
                label="Aceptar"
                primary={true}                            
                onClick={() => alumnosContainer.onAcept()}
              />
              <FlatButton
                  label="Volver"
                  primary={true}
                  onClick={() => navigate.to(history, "/alumnos/list")}
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