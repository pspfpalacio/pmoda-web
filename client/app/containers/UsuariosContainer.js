const { Container } = require('unstated')
const moment = require('moment')
const SecurityContainer = require('./SecurityContainer')
const UIContainer = require("./UIContainer")

import 'whatwg-fetch';

const initUsuario = () => {
  return {
    office: '',
    name: '',
    lastname: '',
    user: '',
    pass: '',
    email: '',
    id_rol: '',
    id_alumno: '',
    id_profesor: '',
    user_alta: '',
    user_mod: '',
    fecha_alta: '',
    fecha_mod: '',
    enabled: true
  }
}

class UsuariosContainer extends Container {
  constructor() {
    super();

    /**
     * Todos los campos del state son solamente para lectura. Si se quiere
     * modificar cualquier valor usar los métodos setter.
     */
    this.state = {
      usuarios: [],
      selectedUsuarios: [],
      toActiveUsuarios: [],
      toDeactiveUsuarios: [],
      toStatus: '',
      usuario: initUsuario(),
      configTitle: '',
      modal: {
        confirm: false,
        status: false,
        statusTitle: ''
      },
      loading: {
        roles: false,
        alumnos: false,
        profesores: false
      },
      errors: [],
      roles: [],
      alumnos: [],
      profesores: []
    }
  }

  onLoadUsuarios() {
    let list = fetch('/api/users').then(res => res.json())
    Promise.all([list]).then(values => {
      const usuarios = values[0]
      this.setState({
        usuarios
      })
    }).catch(error => {
      console.log("Error al obtener los usuarios", error)
      this.setState({usuarios: []})
    })
  }

  // onLoadProvincias() {
  //   this.setLoading({provincias: true})
  //   let list = fetch('/api/locations').then(res => res.json())
  //   Promise.all([list]).then(values => {      
  //     const provincias = values[0]
  //     this.setState({
  //       provincias
  //     }, () => this.setLoading({provincias: false}))
  //   }).catch(error => {
  //     console.log("Error al obtener las provincias", error)
  //     this.setState({provincias: []}, () => this.setLoading({provincias: false}))
  //   })
  // }

  // onLoadLocalidades() {
  //   this.setLoading({localidades: true})    
  //   const { provincia } = this.state.alumno    
  //   let filterProvincias = this.state.provincias.filter(it => it._id === provincia._id)    
  //   const localidades = filterProvincias[0].localidades
  //   this.setState({
  //     localidades
  //   }, () => this.setLoading({localidades: false}))
  // }

  setUsuario(params, callback) {
    const newState = state => {
      return {
        usuario: Object.assign({}, state.usuario, params)
      }
    }
    if (callback) {
      this.setState(newState, callback)
    } else {
      this.setState(newState)
    }    
  }

  setStateModal(params) {
    this.setState(state => {
      return {
        modal: Object.assign({}, state.modal, params)
      }
    })
  }

  setLoading(params) {
    this.setState(state => {
      return {
        loading: Object.assign({}, state.loading, params)
      }
    })
  }

  setStateParams(name, value) {
    this.setState({
      [name]: value
    })
  }

  onCheck(event, usuario) {
    let selectedUsuarios = this.state.selectedUsuarios
    let toDeactiveUsuarios = this.state.toDeactiveUsuarios
    let toActiveUsuarios = this.state.toActiveUsuarios
    if (event.target.checked) {
      if (usuario.enabled) {
        toDeactiveUsuarios.push(usuario)
      } else {
        toActiveUsuarios.push(usuario)
      }
      selectedUsuarios.push(usuario)
    } else {
      toDeactiveUsuarios = this.state.toDeactiveUsuarios.filter(row => row._id !== usuario._id)
      toActiveUsuarios = this.state.toActiveUsuarios.filter(row => row._id !== usuario._id)
      selectedUsuarios = this.state.selectedUsuarios.filter(row => row._id !== usuario._id)
    }
    this.setState({toDeactiveUsuarios, toActiveUsuarios, selectedUsuarios})
  }

  isCheck(usuario) {
    let listChecked = this.state.selectedUsuarios.filter(row => row._id === usuario._id)
    return listChecked.length > 0
  }

  onNewUsuario() {
    this.setState({
      usuario: initUsuario(),
      configTitle: 'Nuevo Usuario',
      errors: []
    })
  }

  onEditUsuario(row, callback) {
    console.log("usuario", row)
    this.setState({
      usuario: row,
      configTitle: 'Modificar Usuario',
      errors: []
    }, () => {      
      // this.onLoadLocalidades()
      //TODO -> onLoadRoles(); onLoadAlumnos(); onLoadProfesores();
      callback()
    })
  }

  onRequiredInput(name) {
    let error = '';
    this.state.errors.map(err => {
      if (err === name) {
        error = 'El campo es requerido.'
      }
    });
    return error;
  }

  onActive() {
    if (this.state.toActiveUsuarios.length > 0) {
      this.setState(state => {
        return {
          modal: Object.assign({}, state.modal, {
            status: true,
            statusTitle: '¿Está seguro que desea activar los usuarios seleccionados?'
          }),
          toStatus: 'active'
        }
      })
    }
  }
  
  onDeactive() {
    if (this.state.toDeactiveUsuarios.length > 0) {
      this.setState(state => {
        return {
          modal: Object.assign({}, state.modal, {
            status: true,
            statusTitle: '¿Está seguro que desea desactivar los usuarios seleccionados?'
          }),
          toStatus: 'deactive'
        }
      })
    }
  }

  onConfirmStatus() {
    UIContainer.Instance.showSpinner()
    this.closeModalStatus()

    if (this.state.toStatus === 'active') {
      this.activeUsuarios()
    } else {      
      this.deactiveUsuarios()
    }
  }

  activeUsuarios() {
    let ids = this.state.toActiveUsuarios.map(it => it._id)    
    let body = {
      ids: ids,
      toStatus: true,
      user: SecurityContainer.state.user,
      fecha: moment().format()
    }

    //TODO -> api de cambio de estado de usuarios
    fetch('/api/users_status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json.ok !== 0) {
        this.setState({
          toActiveUsuarios: [],
          toDeactiveUsuarios: [],
          selectedUsuarios: []
        }, () => {
          this.onLoadUsuarios()
          UIContainer.Instance.closeSpinner()
          UIContainer.Instance.showSnackbar("Estado actualizado correctamente", "success", "CERRAR")
        })
      }
    }).catch(error => {
      console.log("error", error)
      UIContainer.Instance.closeSpinner()      
      UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el estado", "error", "CERRAR")
    })
  }

  deactiveUsuarios() {
    let ids = this.state.toDeactiveUsuarios.map(it => it._id)    
    let body = {
      ids: ids,
      toStatus: false,
      user: SecurityContainer.state.user,
      fecha: moment().format()
    }

    //TODO -> api de cambio de estado de usuarios
    fetch('/api/users_status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json.ok !== 0) {
        this.setState({
          toActiveUsuarios: [],
          toDeactiveUsuarios: [],
          selectedUsuarios: []
        }, () => {
          this.onLoadUsuarios()
          UIContainer.Instance.closeSpinner()
          UIContainer.Instance.showSnackbar("Estado actualizado correctamente", "success", "CERRAR")
        })
      }
    }).catch(error => {
      console.log("error", error)
      UIContainer.Instance.closeSpinner()      
      UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el estado", "error", "CERRAR")
    })
  }

  closeModalStatus() {
    this.setState(state => {
      return {
        modal: Object.assign({}, state.modal, {
          status: false,
          statusTitle: ''
        }),
        toStatus: ''
      }
    })
  }

  //TODO -> metodo de creacion de un nuevo usuario
  onAcept() {
    const {
      dni,
      name,
      lastname,
      birthdate,
      cell_phone,
      email,
      address_street,
      address_number,
      address_postcode,
      provincia,
      location
    } = this.state.alumno;
    const errors = [];

    (dni.length === 0) && errors.push('dni');
    (name.length === 0) && errors.push('name');
    (lastname.length === 0) && errors.push('lastname');
    (birthdate.length === 0) && errors.push('birthdate');
    (cell_phone.length === 0) && errors.push('cell_phone');
    (email.length === 0) && errors.push('email');
    (address_street.length === 0) && errors.push('address_street');
    (address_number.length === 0) && errors.push('address_number');
    (address_postcode.length === 0) && errors.push('address_postcode');
    (provincia.length === 0) && errors.push('provincia');
    (location.length === 0) && errors.push('location');

    this.setState({ errors: errors });

    if (errors.length > 0) {
      UIContainer.Instance.showSnackbar("Revise los campos obligatorios", "error", "CERRAR")
    } else {
      this.setStateModal({confirm: true})
    }
  }

  closeModal() {
    this.setStateModal({confirm: false})
  }

  onConfirm(callback) {
    UIContainer.Instance.showSpinner()

    if (this.state.alumno._id) {
      this.updateAlumno(callback)
    } else {     
      this.createAlumno(callback)
    }
  }

  createAlumno(callback) {
    const { 
      dni, 
      name, 
      lastname, 
      birthdate, 
      home_phone, 
      cell_phone, 
      email, 
      address_street, 
      address_number,
      address_floor,
      address_department,
      address_postcode,
      provincia,
      location } = this.state.alumno
    
    delete provincia.localidades

    const body = {
      dni,
      name,
      lastname,
      birthdate,
      home_phone,
      cell_phone,
      email,
      address_street,
      address_number,
      address_floor,
      address_department,
      address_postcode,
      provincia: provincia,
      location: location,
      user_alta: SecurityContainer.state.user,
      fecha_alta: moment().format()
    }

    console.log("body", body)

    fetch('/api/alumnos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json._id) {
        this.onLoadAlumnos()
        callback()
        this.setStateModal({confirm: false})
        UIContainer.Instance.closeSpinner()
        UIContainer.Instance.showSnackbar("Alumno creado correctamente", "success", "CERRAR")
      } else {
        this.setStateModal({confirm: false})
        UIContainer.Instance.closeSpinner()      
        UIContainer.Instance.showSnackbar("Ocurrió un error al crear el alumno", "error", "CERRAR")
      }      
    }).catch(error => {
      console.log("error", error)
      this.setStateModal({confirm: false})
      UIContainer.Instance.closeSpinner()      
      UIContainer.Instance.showSnackbar("Ocurrió un error al crear el alumno", "error", "CERRAR")
    })
  }

  updateAlumno(callback) {
    const { 
      dni, 
      name, 
      lastname, 
      birthdate, 
      home_phone, 
      cell_phone, 
      email, 
      address_street, 
      address_number,
      address_floor,
      address_department,
      address_postcode,
      provincia,
      location } = this.state.alumno
    
    delete provincia.localidades

    const body = {
      dni,
      name,
      lastname,
      birthdate,
      home_phone,
      cell_phone,
      email,
      address_street,
      address_number,
      address_floor,
      address_department,
      address_postcode,
      provincia: provincia,
      location: location,
      user_mod: SecurityContainer.state.user,
      fecha_mod: moment().format()
    }

    fetch(`/api/alumnos/${this.state.alumno._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json.ok >= 1) {
        this.onLoadAlumnos()
        callback()
        this.setStateModal({confirm: false})
        UIContainer.Instance.closeSpinner()
        UIContainer.Instance.showSnackbar("Alumno actualizado correctamente", "success", "CERRAR")
      } else {
        this.setStateModal({confirm: false})
        UIContainer.Instance.closeSpinner()
        UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el alumno", "error", "CERRAR")
      }
    }).catch(error => {
      this.setStateModal({confirm: false})
      console.log("error", error)
      UIContainer.Instance.closeSpinner()      
      UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el alumno", "error", "CERRAR")
    })
  }

}

module.exports = new AlumnosContainer();
