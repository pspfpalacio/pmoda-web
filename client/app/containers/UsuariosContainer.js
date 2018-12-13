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
    role: '',
    id_alumno: '',
    id_profesor: '',
    user_create: '',
    user_modify: '',
    date_create: '',
    last_modify: '',
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

  onLoadRoles() {
    this.setLoading({roles: true})
    let list = fetch('/api/roles').then(res => res.json())
    Promise.all([list]).then(values => {      
      const roles = values[0]
      this.setState({
        roles
      }, () => this.setLoading({roles: false}))
    }).catch(error => {
      console.log("Error al obtener los roles", error)
      this.setState({roles: []}, () => this.setLoading({roles: false}))
    })
  }

  onLoadAlumnos() {
    this.setLoading({alumnos: true})
    let list = fetch('/api/alumnos').then(res => res.json())
    Promise.all([list]).then(values => {      
      const alumnos = values[0]
      this.setState({
        alumnos
      }, () => this.setLoading({alumnos: false}))
    }).catch(error => {
      console.log("Error al obtener los alumnos", error)
      this.setState({alumnos: []}, () => this.setLoading({alumnos: false}))
    })
  }

  onLoadProfesores() {
    this.setLoading({profesores: true})
    let list = fetch('/api/instructors').then(res => res.json())
    Promise.all([list]).then(values => {      
      const profesores = values[0]
      this.setState({
        profesores
      }, () => this.setLoading({profesores: false}))
    }).catch(error => {
      console.log("Error al obtener los profesores", error)
      this.setState({profesores: []}, () => this.setLoading({profesores: false}))
    })
  }

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

  onAcept() {
    const {
      name,
      lastname,
      user,
      pass,
      email,
      role,
      id_alumno,
      id_profesor
    } = this.state.usuario;    
    const errors = [];

    (name.length === 0) && errors.push('name');
    (lastname.length === 0) && errors.push('lastname');
    (user.length === 0) && errors.push('user');
    (pass.length === 0) && errors.push('pass');
    (email.length === 0) && errors.push('email');
    (role.length === 0) && errors.push('role');
    (id_alumno.length === 0) && errors.push('id_alumno');
    (id_profesor.length === 0) && errors.push('id_profesor');    

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

    if (this.state.usuario._id) {
      this.updateUsuario(callback)
    } else {     
      this.createUsuario(callback)
    }
  }

  createUsuario(callback) {
    const {
      name,
      lastname,
      user,
      pass,
      email,
      role,
      id_alumno,
      id_profesor
    } = this.state.usuario;

    const body = {
      name,
      lastname,
      user,
      pass,
      email,
      role,
      id_alumno,
      id_profesor,
      user_create: SecurityContainer.state.user,
      date_create: moment().format()
    }

    console.log("body", body)

    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json._id) {
        this.onLoadUsuarios();
        callback();
        this.setStateModal({confirm: false});
        UIContainer.Instance.closeSpinner();
        UIContainer.Instance.showSnackbar("Usuario creado correctamente", "success", "CERRAR");
      } else {
        this.setStateModal({confirm: false});
        UIContainer.Instance.closeSpinner();
        UIContainer.Instance.showSnackbar("Ocurrió un error al crear el usuario", "error", "CERRAR");
      }
    }).catch(error => {
      console.log("error", error)
      this.setStateModal({confirm: false})
      UIContainer.Instance.closeSpinner()      
      UIContainer.Instance.showSnackbar("Ocurrió un error al crear el usuario", "error", "CERRAR")
    })
  }

  updateUsuario(callback) {
    const {
      name,
      lastname,
      user,
      pass,
      email,
      role,
      id_alumno,
      id_profesor
    } = this.state.usuario;

    const body = {
      name,
      lastname,
      user,
      pass,
      email,
      role,
      id_alumno,
      id_profesor,
      user_modify: SecurityContainer.state.user,
      last_modify: moment().format()
    }

    fetch(`/api/users/${this.state.usuario._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json.ok >= 1) {
        this.onLoadUsuarios()
        callback()
        this.setStateModal({confirm: false})
        UIContainer.Instance.closeSpinner()
        UIContainer.Instance.showSnackbar("Usuario actualizado correctamente", "success", "CERRAR")
      } else {
        this.setStateModal({confirm: false})
        UIContainer.Instance.closeSpinner()
        UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el usuario", "error", "CERRAR")
      }
    }).catch(error => {
      this.setStateModal({confirm: false})
      console.log("error", error)
      UIContainer.Instance.closeSpinner()      
      UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el usuario", "error", "CERRAR")
    })
  }

}

module.exports = new UsuariosContainer();
