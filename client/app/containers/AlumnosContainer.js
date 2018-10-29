const { Container } = require('unstated')
const moment = require('moment')
const SecurityContainer = require('./SecurityContainer')
const UIContainer = require("./UIContainer")

import 'whatwg-fetch';

let Instance = null

class AlumnosContainer extends Container {
  constructor() {
    super();

    /**
     * Todos los campos del state son solamente para lectura. Si se quiere
     * modificar cualquier valor usar los métodos setter.
     */
    this.state = {
      alumnos: [],
      selectedAlumnos: [],
      toActiveAlumnos: [],
      toDeactiveAlumnos: [],
      toStatus: '',
      alumno: {
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
        user_alta: '',
        user_mod: '',
        fecha_alta: '',
        fecha_mod: '',
        enabled: true
      },
      configTitle: 'Nuevo Alumno',
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

      // cursos: [],
      // toActiveCursos: [],
      // toDeactiveCursos: [],
      // selectedCursos: [],
      // configTitle: "",
      // modalOpen: false,
      // modalStatus: false,
      // modalStatusTitle: '',
      // toStatus: '',
      // curso: null,
      // nombre: "",
      // cantHoras: "",
      // duracionMeses: "",
      // costoCurso: "",
      // costoMatricula: "",      
    }

    Instance = this
  }

  static get Instance() {
    return Instance
  }

  onLoadAlumnos() {
    let list = fetch('/api/alumnos').then(res => res.json())
    Promise.all([list]).then(values => {
      const alumnos = values[0]
      this.setState({
        alumnos
      })
    }).catch(error => {
      console.log("Error al obtener los alumnos", error)
      this.setState({alumnos: []})
    })
  }

  onLoadProvincias() {
    this.setLoading({provincias: true})
    let list = fetch('/api/locations').then(res => res.json())
    Promise.all([list]).then(values => {      
      const provincias = values[0]
      console.log("provincias", provincias)
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
    console.log("provincia", this.state.alumno.provincia)
    const { provincia } = this.state.alumno    
    const localidades = provincia.localidades
    this.setState({
      localidades
    }, () => this.setLoading({localidades: false}))
    // let list = fetch(`/api/localidades`).then(res => res.json())
    // Promise.all([list]).then(values => {      
    //   const localidades = values[0]
    //   console.log("localidades", localidades)
    //   this.setState({
    //     localidades
    //   }, () => this.setLoading({localidades: false}))
    // }).catch(error => {
    //   console.log("Error al obtener las localidades", error)
    //   this.setState({localidades: []}, () => this.setLoading({localidades: false}))
    // })
  }

  setAlumno(params, callback) {
    const newState = state => {
      return {
        alumno: Object.assign({}, state.alumno, params)
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

  onCheck(event, alumno) {
    let selectedAlumnos = this.state.selectedAlumnos
    let toDeactiveAlumnos = this.state.toDeactiveAlumnos
    let toActiveAlumnos = this.state.toActiveAlumnos
    if (event.target.checked) {
      if (alumno.enabled) {
        toDeactiveAlumnos.push(alumno)
      } else {
        toActiveAlumnos.push(alumno)
      }
      selectedAlumnos.push(alumno)
    } else {
      toDeactiveAlumnos = this.state.toDeactiveAlumnos.filter(row => row._id !== alumno._id)
      toActiveAlumnos = this.state.toActiveAlumnos.filter(row => row._id !== alumno._id)
      selectedAlumnos = this.state.selectedAlumnos.filter(row => row._id !== alumno._id)
    }
    this.setState({toDeactiveAlumnos, toActiveAlumnos, selectedAlumnos})
  }

  isCheck(alumno) {
    let listChecked = this.state.selectedAlumnos.filter(row => row._id === alumno._id)
    return listChecked.length > 0
  }

  onNewAlumno() {
    this.setState({
      alumno: {
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
        address_location: '',
        user_alta: '',
        user_mod: '',
        fecha_alta: '',
        fecha_mod: '',
        enabled: true
      },
      configTitle: 'Nuevo Alumno',
      errors: []
    })
  }

  onEditAlumno(alumno) {
    this.setState({
      alumno,
      configTitle: 'Modificar Alumno',
      errors: []
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
    if (this.state.toActiveAlumnos.length > 0) {
      this.setState(state => {
        return {
          modal: Object.assign({}, state.modal, {
            status: true,
            statusTitle: '¿Está seguro que desea activar los alumnos seleccionados?'
          }),
          toStatus: 'active'
        }
      })
      // this.setState({
      //   modalStatus: true,
      //   modalStatusTitle: '¿Está seguro que desea activar los alumnos seleccionados?',
      //   toStatus: 'active'
      // })
    }
  }
  
  onDeactive() {
    if (this.state.toDeactiveAlumnos.length > 0) {
      this.setState(state => {
        return {
          modal: Object.assign({}, state.modal, {
            status: true,
            statusTitle: '¿Está seguro que desea desactivar los alumnos seleccionados?'
          }),
          toStatus: 'deactive'
        }
      })
      // this.setState({
      //   modalStatus: true,
      //   modalStatusTitle: '¿Está seguro que desea desactivar los cursos seleccionados?',
      //   toStatus: 'deactive'
      // })
    }
  }

  onConfirmStatus() {
    UIContainer.Instance.showSpinner()
    this.closeModalStatus()

    if (this.state.toStatus === 'active') {
      this.activeAlumnos()
    } else {      
      this.deactiveAlumnos()
    }
  }

  activeAlumnos() {
    let ids = this.state.toActiveAlumnos.map(it => it._id)    
    let body = {
      ids: ids,
      toStatus: true,
      user: SecurityContainer.state.user,
      fecha: moment().format()
    }

    fetch('/api/alumnos_status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json.ok !== 0) {
        this.setState({
          toActiveAlumnos: [],
          toDeactiveAlumnos: [],
          selectedAlumnos: []
        }, () => {
          this.onLoadAlumnos()
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

  deactiveAlumnos() {
    let ids = this.state.toDeactiveAlumnos.map(it => it._id)    
    let body = {
      ids: ids,
      toStatus: false,
      user: SecurityContainer.state.user,
      fecha: moment().format()
    }

    fetch('/api/alumnos_status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json.ok !== 0) {
        this.setState({
          toActiveAlumnos: [],
          toDeactiveAlumnos: [],
          selectedAlumnos: []
        }, () => {
          this.onLoadAlumnos()
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

  // setInputText(event) {
  //   this.setState({
  //     [event.target.name]: event.target.value
  //   })
  // }

  // onConfirm(callback) {
  //   UIContainer.Instance.showSpinner()

  //   if (this.state.curso) {
  //     this.updateCurso(callback)
  //   } else {     
  //     this.createCurso(callback)
  //   }
  // }

  // createCurso(callback) {
  //   const body = {
  //     nombre: this.state.nombre,
  //     cantHoras: this.state.cantHoras,
  //     duracionMeses: this.state.duracionMeses,
  //     costoCurso: this.state.costoCurso,
  //     costoMatricula: this.state.cantHoras,
  //     userAlta: SecurityContainer.state.user,
  //     fechaAlta: moment().format()
  //   }

  //   fetch('/api/cursos', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(body)
  //   }).then(res => res.json()).then(json => {
  //     console.log("json", json)
  //     if (json._id) {
  //       this.setState({
  //         modalOpen: false,
  //         modalTitle: ''
  //       }, () => {
  //         this.onLoadCursos()
  //         callback
  //         UIContainer.Instance.closeSpinner()
  //         UIContainer.Instance.showSnackbar("Curso creado correctamente", "success", "CERRAR")          
  //       })
  //     } else {
  //       UIContainer.Instance.closeSpinner()      
  //       UIContainer.Instance.showSnackbar("Ocurrió un error al crear el curso", "error", "CERRAR")
  //     }      
  //   }).catch(error => {
  //     console.log("error", error)
  //     UIContainer.Instance.closeSpinner()      
  //     UIContainer.Instance.showSnackbar("Ocurrió un error al crear el curso", "error", "CERRAR")
  //   })
  // }

  // updateCurso(callback) {
  //   const body = {
  //     nombre: this.state.nombre,
  //     cantHoras: this.state.cantHoras,
  //     duracionMeses: this.state.duracionMeses,
  //     costoCurso: this.state.costoCurso,
  //     costoMatricula: this.state.costoMatricula,
  //     user_mod: SecurityContainer.state.user,
  //     fecha_mod: moment().format()
  //   }

  //   fetch(`/api/cursos/${this.state.curso._id}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(body)
  //   }).then(res => res.json()).then(json => {
  //     console.log("json", json)
  //     if (json.ok >= 1) {
  //       this.setState({
  //         modalOpen: false,
  //         modalTitle: ''
  //       }, () => {
  //         this.onLoadCursos()
  //         callback
  //         UIContainer.Instance.closeSpinner()
  //         UIContainer.Instance.showSnackbar("Curso actualizado correctamente", "success", "CERRAR")            
  //       })
  //     } else {
  //       UIContainer.Instance.closeSpinner()
  //       UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el curso", "error", "CERRAR")
  //     }
  //   }).catch(error => {
  //     console.log("error", error)
  //     UIContainer.Instance.closeSpinner()      
  //     UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el curso", "error", "CERRAR")
  //   })
  // }

}

module.exports = AlumnosContainer;
