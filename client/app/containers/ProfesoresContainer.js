const { Container } = require('unstated')
const moment = require('moment')
const SecurityContainer = require('./SecurityContainer')
const UIContainer = require("./UIContainer")

import 'whatwg-fetch';

const initProfesor = () => {
  return {
    dni: '',
    name: '',
    lastname: '',
    birthdate: '',
    home_phone: '',
    cell_phone: '',
    email: '',
    address_street: '',
    address_number: '',
    address_floor: '',
    address_department: '',
    address_postcode: '',
    provincia: '',
    location: '',
    location_id: '',
    user_create: '',
    user_modify: '',
    date_create: '',
    last_modify: '',
    enabled: true
  }
}

class ProfesorContainer extends Container {
  constructor() {
    super();

    /**
     * Todos los campos del state son solamente para lectura. Si se quiere
     * modificar cualquier valor usar los métodos setter.
     */
    this.state = {
      profesores: [],
      selectedProfesores: [],
      toActiveProfesores: [],
      toDeactiveProfesores: [],
      toStatus: '',
      profesor: initProfesor(),
      configTitle: '',
      modal: {
        confirm: false,
        status: false,
        statusTitle: ''
      },
      loading: {
        provincias: false,
        localidades: false
      },
      errors: [],
      provincias: [],
      localidades: []    
    }
  }

  onLoadProfesores() {
    let office = SecurityContainer.state.offices.value;
    let list = fetch('/api/instructors').then(res => res.json())
    Promise.all([list]).then(values => {
      const profesores = office.name === 'all' ? values[0] : values[0].filter(it => it.office.name === office.name);
      this.setState({
        profesores
      })
    }).catch(error => {
      console.log("Error al obtener los profesores", error)
      this.setState({profesores: []})
    })
  }

  onLoadProvincias() {
    this.setLoading({provincias: true})
    let list = fetch('/api/locations').then(res => res.json())
    Promise.all([list]).then(values => {      
      const provincias = values[0]
      this.setState({
        provincias
      }, () => this.setLoading({provincias: false}))
    }).catch(error => {
      console.log("Error al obtener las provincias", error)
      this.setState({provincias: []}, () => this.setLoading({provincias: false}))
    })
  }

  onLoadLocalidades() {
    this.setLoading({localidades: true})    
    const { provincia } = this.state.profesor    
    let filterProvincias = this.state.provincias.filter(it => it._id === provincia._id)    
    const localidades = filterProvincias[0].localidades
    this.setState({
      localidades
    }, () => this.setLoading({localidades: false}))
  }

  setProfesor(params, callback) {
    const newState = state => {
      return {
        profesor: Object.assign({}, state.profesor, params)
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

  onCheck(event, profesor) {
    let selectedProfesores = this.state.selectedProfesores
    let toDeactiveProfesores = this.state.toDeactiveProfesores
    let toActiveProfesores = this.state.toActiveProfesores
    if (event.target.checked) {
      if (profesor.enabled) {
        toDeactiveProfesores.push(profesor)
      } else {
        toActiveProfesores.push(profesor)
      }
      selectedProfesores.push(profesor)
    } else {
      toDeactiveProfesores = this.state.toDeactiveProfesores.filter(row => row._id !== profesor._id)
      toActiveProfesores = this.state.toActiveProfesores.filter(row => row._id !== profesor._id)
      selectedProfesores = this.state.selectedProfesores.filter(row => row._id !== profesor._id)
    }
    this.setState({toDeactiveProfesores, toActiveProfesores, selectedProfesores})
  }

  isCheck(profesor) {
    let listChecked = this.state.selectedProfesores.filter(row => row._id === profesor._id)
    return listChecked.length > 0
  }

  onNewProfesor() {
    this.setState({
      profesor: initProfesor(),
      configTitle: 'Nuevo Profesor',
      errors: []
    })
  }

  onEditProfesor(row, callback) {    
    this.setState({
      profesor: row,
      configTitle: 'Modificar Profesor',
      errors: []
    }, () => {
      SecurityContainer.setParams('offices', {value: row.office});
      this.onLoadLocalidades();
      callback();
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
    if (this.state.toActiveProfesores.length > 0) {
      this.setState(state => {
        return {
          modal: Object.assign({}, state.modal, {
            status: true,
            statusTitle: '¿Está seguro que desea activar los profesores seleccionados?'
          }),
          toStatus: 'active'
        }
      })
    }
  }
  
  onDeactive() {
    if (this.state.toDeactiveProfesores.length > 0) {
      this.setState(state => {
        return {
          modal: Object.assign({}, state.modal, {
            status: true,
            statusTitle: '¿Está seguro que desea desactivar los profesores seleccionados?'
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
      this.activeProfesores()
    } else {      
      this.deactiveProfesores()
    }
  }

  activeProfesores() {
    let ids = this.state.toActiveProfesores.map(it => it._id)    
    let body = {
      ids: ids,
      toStatus: true,
      user: SecurityContainer.state.user,
      fecha: moment().format()
    }

    fetch('/api/instructors_status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json.ok !== 0) {
        this.setState({
          toActiveProfesores: [],
          toDeactiveProfesores: [],
          selectedProfesores: []
        }, () => {
          this.onLoadProfesores()
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

  deactiveProfesores() {
    let ids = this.state.toDeactiveProfesores.map(it => it._id)    
    let body = {
      ids: ids,
      toStatus: false,
      user: SecurityContainer.state.user,
      fecha: moment().format()
    }

    fetch('/api/instructors_status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json.ok !== 0) {
        this.setState({
          toActiveProfesores: [],
          toDeactiveProfesores: [],
          selectedProfesores: []
        }, () => {
          this.onLoadProfesores()
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
    } = this.state.profesor;
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

    if (this.state.profesor._id) {
      this.updateProfesor(callback)
    } else {     
      this.createProfesor(callback)
    }
  }

  createProfesor(callback) {
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
      location } = this.state.profesor
    
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
      office: SecurityContainer.state.offices.value,
      user_create: SecurityContainer.state.user,
      date_create: moment().format()
    }

    console.log("body", body)

    fetch('/api/instructors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json._id) {
        this.onLoadProfesores()
        callback()
        this.setStateModal({confirm: false})
        UIContainer.Instance.closeSpinner()
        UIContainer.Instance.showSnackbar("Profesor creado correctamente", "success", "CERRAR")
      } else {
        this.setStateModal({confirm: false})
        UIContainer.Instance.closeSpinner()      
        UIContainer.Instance.showSnackbar("Ocurrió un error al crear el profesor", "error", "CERRAR")
      }      
    }).catch(error => {
      console.log("error", error)
      this.setStateModal({confirm: false})
      UIContainer.Instance.closeSpinner()      
      UIContainer.Instance.showSnackbar("Ocurrió un error al crear el profesor", "error", "CERRAR")
    })
  }

  updateProfesor(callback) {
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
      location } = this.state.profesor
    
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
      office: SecurityContainer.state.offices.value,
      user_modify: SecurityContainer.state.user,
      last_modify: moment().format()
    }

    fetch(`/api/instructors/${this.state.profesor._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json.ok >= 1) {
        this.onLoadProfesores()
        callback()
        this.setStateModal({confirm: false})
        UIContainer.Instance.closeSpinner()
        UIContainer.Instance.showSnackbar("Profesor actualizado correctamente", "success", "CERRAR")
      } else {
        this.setStateModal({confirm: false})
        UIContainer.Instance.closeSpinner()
        UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el profesor", "error", "CERRAR")
      }
    }).catch(error => {
      this.setStateModal({confirm: false})
      console.log("error", error)
      UIContainer.Instance.closeSpinner()      
      UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el profesor", "error", "CERRAR")
    })
  }

}

module.exports = new ProfesorContainer();
