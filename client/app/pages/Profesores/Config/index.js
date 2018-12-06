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

const ProfesoresContainer = require("../../../containers/ProfesoresContainer")

const navigate = require("../../../../services/navigate")

class Config extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    ProfesoresContainer.onLoadProvincias()
  }

  render() {
    return (
      <Subscribe to={[ProfesoresContainer]}>{(profesoresContainer) => {
        const { history } = this.props
        return (
          <React.Fragment>
            <h4 className="ui-card__title">Configuración de profesores</h4>
    
            <CardTitle
              title={profesoresContainer.state.configTitle}
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
                value={profesoresContainer.state.profesor.dni}
                errorText={profesoresContainer.onRequiredInput('dni')}
                onChange={(e) => profesoresContainer.setProfesor({'dni': e.target.value})}
              />
              <TextField
                name="name"
                hintText="Nombre"
                floatingLabelText="Nombre"
                floatingLabelFixed={true}
                fullWidth={true}
                value={profesoresContainer.state.profesor.name}
                errorText={profesoresContainer.onRequiredInput('name')}
                onChange={(e) => profesoresContainer.setProfesor({'name': e.target.value})}
              />
              <TextField
                name="lastname"
                hintText="Apellido"
                floatingLabelText="Apellido"
                floatingLabelFixed={true}
                fullWidth={true}
                value={profesoresContainer.state.profesor.lastname}
                errorText={profesoresContainer.onRequiredInput('lastname')}
                onChange={(e) => profesoresContainer.setProfesor({'lastname': e.target.value})}
              />
              <div className="ui-label__datepicker">Fecha de nacimiento</div>
              <DatePicker
                placeholderText="Fecha de nacimiento"
                className="form-control__field"
                showTimeSelect={false}
                dateFormat="DD/MM/YYYY"
                timeFormat="HH:mm"
                selected={profesoresContainer.state.profesor["birthdate"] ? moment(profesoresContainer.state.profesor["birthdate"]) : null}
                onChange={(dt) => {
                  if (dt.isValid()) {
                    profesoresContainer.setProfesor({birthdate: dt.format()})
                  } else {
                    profesoresContainer.setProfesor({birthdate: null})
                  }
                }}
              />          
              
              <h5 style={{color: "#666", marginTop: "2em", marginBottom: "0.5em"}}>Datos de domicilio</h5>    
              <div className="ui-label__select">Provincia</div>
              <div style={{width: "69%"}}>
                <Select
                  placeholder="Seleccione..."
                  options={profesoresContainer.state.provincias}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option._id}
                  isClearable={true}
                  loadingPlaceholder="Cargando..."
                  noResultsText="No se encontraron provincias"
                  isLoading={profesoresContainer.state.loading.provincias}
                  value={profesoresContainer.state.profesor.provincia}
                  onChange={value => profesoresContainer.setProfesor({ provincia: value }, () => profesoresContainer.onLoadLocalidades())}
                />
              </div>
              <div className="ui-label__select">Localidad</div>
              <div style={{width: "69%"}}>
                <Select
                  placeholder="Seleccione..."
                  options={profesoresContainer.state.localidades}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option._id}
                  isClearable={true}
                  loadingPlaceholder="Cargando..."
                  noResultsText="No se encontraron localidades"
                  isLoading={profesoresContainer.state.loading.localidades}
                  value={profesoresContainer.state.profesor.location}
                  onChange={value => profesoresContainer.setProfesor({ location: value })}
                />
              </div>
              <TextField
                name="address_postcode"
                hintText="Cod. postal"
                floatingLabelText="Cod. postal"
                type="number"
                floatingLabelFixed={true}
                fullWidth={true}            
                value={profesoresContainer.state.profesor.address_postcode}
                errorText={profesoresContainer.onRequiredInput('address_postcode')}
                onChange={(e) => profesoresContainer.setProfesor({'address_postcode': e.target.value})}
              />
              <TextField
                name="address_street"
                hintText="Calle"
                floatingLabelText="Calle"
                floatingLabelFixed={true}
                fullWidth={true}
                value={profesoresContainer.state.profesor.address_street}
                errorText={profesoresContainer.onRequiredInput('address_street')}
                onChange={(e) => profesoresContainer.setProfesor({'address_street': e.target.value})}
              />
              <TextField
                name="address_number"
                hintText="Número"
                floatingLabelText="Número"
                type="number"
                floatingLabelFixed={true}
                fullWidth={true}
                value={profesoresContainer.state.profesor.address_number}
                errorText={profesoresContainer.onRequiredInput('address_number')}
                onChange={(e) => profesoresContainer.setProfesor({'address_number': e.target.value})}
              />
              <TextField
                name="address_floor"
                hintText="Piso"
                floatingLabelText="Piso"
                floatingLabelFixed={true}
                fullWidth={true}
                value={profesoresContainer.state.profesor.address_floor}
                // errorText={alumnosContainer.onRequiredInput('address_floor')}
                onChange={(e) => profesoresContainer.setProfesor({'address_floor': e.target.value})}
              />
              <TextField
                name="address_department"
                hintText="Departamento"
                floatingLabelText="Departamento"
                floatingLabelFixed={true}
                fullWidth={true}
                value={profesoresContainer.state.profesor.address_department}
                // errorText={alumnosContainer.onRequiredInput('address_floor')}
                onChange={(e) => profesoresContainer.setProfesor({'address_department': e.target.value})}
              />

              <h5 style={{color: "#666", marginTop: "2em", marginBottom: "0.5em"}}>Datos de contacto</h5>
              <TextField
                name="email"
                hintText="Email"
                floatingLabelText="Email"
                floatingLabelFixed={true}
                fullWidth={true}
                value={profesoresContainer.state.profesor.email}
                errorText={profesoresContainer.onRequiredInput('email')}
                onChange={(e) => profesoresContainer.setProfesor({'email': e.target.value})}
              />
              <TextField
                name="cell_phone"
                hintText="Tel. celular"
                floatingLabelText="Tel. celular"
                floatingLabelFixed={true}
                fullWidth={true}
                value={profesoresContainer.state.profesor.cell_phone}
                errorText={profesoresContainer.onRequiredInput('cell_phone')}
                onChange={(e) => profesoresContainer.setProfesor({'cell_phone': e.target.value})}
              />
              <TextField
                name="home_phone"
                hintText="Tel. fijo"
                floatingLabelText="Tel. fijo"
                floatingLabelFixed={true}
                fullWidth={true}
                value={profesoresContainer.state.profesor.home_phone}
                // errorText={alumnosContainer.onRequiredInput('home_phone')}
                onChange={(e) => profesoresContainer.setProfesor({'home_phone': e.target.value})}
              />
    
            </div>
            <div className="form__action-buttons">                        
              <FlatButton
                className="button__confirm"
                label="Aceptar"
                primary={true}                            
                onClick={() => profesoresContainer.onAcept()}
              />
              <FlatButton
                  label="Volver"
                  primary={true}
                  onClick={() => navigate.to(history, "/profesors/list")}
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