import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { CardTitle } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';

const { Subscribe } = require("unstated");

const Select = require("react-select").default;
const ModalConfirm = require('../components/ModalConfirm');
const {FaEye, FaEyeSlash} = require('react-icons/fa');

const UsuariosContainer = require("../../../containers/UsuariosContainer");
const navigate = require("../../../../services/navigate");

class Config extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visiblePass: false
    }
  }

  componentDidMount() {
    UsuariosContainer.onLoadRoles()
    UsuariosContainer.onLoadProfesores()
    UsuariosContainer.onLoadAlumnos()
  }

  onClickVisible(event) {    
    this.setState({
      visiblePass: event.target.checked
    })
  } 

  render() {
    return (
      <Subscribe to={[UsuariosContainer]}>{(usuariosContainer) => {
        const { history } = this.props
        return (
          <React.Fragment>
            <h4 className="ui-card__title">Configuración de usuarios</h4>
    
            <CardTitle
              title={usuariosContainer.state.configTitle}
            />
            <div className="form__body">
              <h5 style={{color: "#666", marginTop: "0", marginBottom: "0.5em"}}>Datos del usuario</h5>              
              <TextField
                name="name"
                hintText="Nombre"
                floatingLabelText="Nombre"
                floatingLabelFixed={true}
                fullWidth={true}
                value={usuariosContainer.state.usuario.name}
                errorText={usuariosContainer.onRequiredInput('name')}
                onChange={(e) => usuariosContainer.setUsuario({'name': e.target.value})}
              />
              <TextField
                name="lastname"
                hintText="Apellido"
                floatingLabelText="Apellido"
                floatingLabelFixed={true}
                fullWidth={true}
                value={usuariosContainer.state.usuario.lastname}
                errorText={usuariosContainer.onRequiredInput('lastname')}
                onChange={(e) => usuariosContainer.setUsuario({'lastname': e.target.value})}
              />
              <TextField
                name="user"
                hintText="Username"
                floatingLabelText="Username"
                floatingLabelFixed={true}
                fullWidth={true}
                value={usuariosContainer.state.usuario.name}
                errorText={usuariosContainer.onRequiredInput('user')}
                onChange={(e) => usuariosContainer.setUsuario({'user': e.target.value})}
              />
              <div style={{display: "flex", alignItems: "flex-end", width: "105%"}}>
                <TextField
                  type={this.state.visiblePass ? "text" : "password"}
                  name="pass"
                  hintText="Password"
                  floatingLabelText="Password"
                  floatingLabelFixed={true}
                  fullWidth={true}
                  value={usuariosContainer.state.usuario.pass}
                  errorText={usuariosContainer.onRequiredInput('pass')}
                  onChange={(e) => usuariosContainer.setUsuario({'pass': e.target.value})}
                />
                <Checkbox
                  style={{width: "50px", marginLeft: "10px"}}
                  checkedIcon={<FaEye />}
                  uncheckedIcon={<FaEyeSlash />}
                  onCheck={(e) => this.onClickVisible(e)}
                  checked={this.state.visiblePass}
                />
              </div>
              
              <div className="ui-label__select">Rol</div>
              <div style={{width: "69%"}}>
                <Select
                  placeholder="Seleccione..."
                  options={usuariosContainer.state.roles}
                  getOptionLabel={(option) => option.description}
                  getOptionValue={(option) => option._id}
                  isClearable={true}
                  loadingPlaceholder="Cargando..."
                  noResultsText="No se encontraron roles"
                  isLoading={usuariosContainer.state.loading.roles}
                  value={usuariosContainer.state.usuario.role}
                  onChange={value => usuariosContainer.setUsuario({ role: value })}
                />
              </div>
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
                  onClick={() => navigate.to(history, "/usuarios/list")}
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