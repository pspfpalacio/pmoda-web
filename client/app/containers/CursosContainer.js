const { Container } = require('unstated')
const moment = require('moment')
// const CursoService = require('../../services/cursos');
const SecurityContainer = require('./SecurityContainer')
const UIContainer = require("./UIContainer")

import 'whatwg-fetch';

class CursosContainer extends Container {
  constructor() {
    super();

    /**
     * Todos los campos del state son solamente para lectura. Si se quiere
     * modificar cualquier valor usar los métodos setter.
     */
    this.state = {
      cursos: [],
      toActiveCursos: [],
      toDeactiveCursos: [],
      selectedCursos: [],
      configTitle: "",
      modalOpen: false,
      modalStatus: false,
      modalStatusTitle: '',
      toStatus: '',
      curso: null,
      nombre: "",
      cantHoras: "",
      duracionMeses: "",
      costoCurso: "",
      costoMatricula: "",
      errors: []
    };
  }

  setStateCurso(name, value) {
    this.setState({
      [name]: value
    })
  }

  onLoadCursos() {
    let listCursos = fetch('/api/cursos').then(res => res.json())
    Promise.all([listCursos]).then(values => {
      const cursos = values[0]
      this.setState({
        cursos
      })
    }).catch(error => {
      console.log("Error al obtener los cursos", error)
      this.setState({cursos: []})
    })
  }

  onCheck(event, curso) {
    let selectedCursos = this.state.selectedCursos
    let toDeactiveCursos = this.state.toDeactiveCursos
    let toActiveCursos = this.state.toActiveCursos
    if (event.target.checked) {
      if (curso.enabled) {
        toDeactiveCursos.push(curso)
      } else {
        toActiveCursos.push(curso)
      }
      selectedCursos.push(curso)
    } else {
      toDeactiveCursos = this.state.toDeactiveCursos.filter(row => row._id !== curso._id)
      toActiveCursos = this.state.toActiveCursos.filter(row => row._id !== curso._id)
      selectedCursos = this.state.selectedCursos.filter(row => row._id !== curso._id)
    }
    this.setState({toDeactiveCursos, toActiveCursos, selectedCursos})
  }

  isCheck(curso) {
    let listChecked = this.state.selectedCursos.filter(row => row._id === curso._id)
    return listChecked.length > 0
  }

  setCursos(cursos) {
    this.setState({
      cursos: cursos
    })
  }

  setInputText(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onNewCurse() {
    this.setState({
      curso: null,
      configTitle: "Nuevo curso",
      nombre: "",
      cantHoras: "",
      duracionMeses: "",
      costoCurso: "",
      costoMatricula: "",
      errors: []
    })
  }

  onEditCurso(curso) {
    this.setState({
      configTitle: "Modificar curso",
      curso,
      nombre: curso.nombre,
      cantHoras: curso.cantHoras,
      duracionMeses: curso.duracionMeses,
      costoCurso: curso.costoCurso,
      costoMatricula: curso.costoMatricula,
      errors: []
    })
  }

  closeModal() {
    this.setState({
      modalOpen: false
    })
  }

  onAcept() {
    const {
      nombre,
      cantHoras,
      duracionMeses,
      costoCurso,
      costoMatricula
    } = this.state;
    const errors = [];

    (nombre.length === 0) && errors.push('nombre');
    (cantHoras.length === 0) && errors.push('cantHoras');
    (duracionMeses.length === 0) && errors.push('duracionMeses');
    (costoCurso.length === 0) && errors.push('costoCurso');
    (costoMatricula.length === 0) && errors.push('costoMatricula');

    this.setState({ errors: errors });

    if (errors.length > 0) {
      UIContainer.Instance.showSnackbar("Revise los campos obligatorios", "error", "CERRAR")
    } else {
      this.setState({
        modalOpen: true,
        // modalTitle: '¿Está seguro que desea confirmar el nuevo curso?'
      }) 
    }
  }

  onConfirm(callback) {
    UIContainer.Instance.showSpinner()

    if (this.state.curso) {
      this.updateCurso(callback)
    } else {     
      this.createCurso(callback)
    }
  }

  createCurso(callback) {
    const body = {
      nombre: this.state.nombre,
      cantHoras: this.state.cantHoras,
      duracionMeses: this.state.duracionMeses,
      costoCurso: this.state.costoCurso,
      costoMatricula: this.state.cantHoras,
      userAlta: SecurityContainer.state.user,
      fechaAlta: moment().format()
    }

    fetch('/api/cursos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json._id) {
        this.setState({
          modalOpen: false,
          modalTitle: ''
        }, () => {
          this.onLoadCursos()
          callback
          UIContainer.Instance.closeSpinner()
          UIContainer.Instance.showSnackbar("Curso creado correctamente", "success", "CERRAR")          
        })
      } else {
        UIContainer.Instance.closeSpinner()      
        UIContainer.Instance.showSnackbar("Ocurrió un error al crear el curso", "error", "CERRAR")
      }      
    }).catch(error => {
      console.log("error", error)
      UIContainer.Instance.closeSpinner()      
      UIContainer.Instance.showSnackbar("Ocurrió un error al crear el curso", "error", "CERRAR")
    })
  }

  updateCurso(callback) {
    const body = {
      nombre: this.state.nombre,
      cantHoras: this.state.cantHoras,
      duracionMeses: this.state.duracionMeses,
      costoCurso: this.state.costoCurso,
      costoMatricula: this.state.costoMatricula,
      user_mod: SecurityContainer.state.user,
      fecha_mod: moment().format()
    }

    fetch(`/api/cursos/${this.state.curso._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json.ok >= 1) {
        this.setState({
          modalOpen: false,
          modalTitle: ''
        }, () => {
          this.onLoadCursos()
          callback
          UIContainer.Instance.closeSpinner()
          UIContainer.Instance.showSnackbar("Curso actualizado correctamente", "success", "CERRAR")            
        })
      } else {
        UIContainer.Instance.closeSpinner()
        UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el curso", "error", "CERRAR")
      }
    }).catch(error => {
      console.log("error", error)
      UIContainer.Instance.closeSpinner()      
      UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el curso", "error", "CERRAR")
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

  onActiveCursos() {
    if (this.state.toActiveCursos.length > 0) {
      this.setState({
        modalStatus: true,
        modalStatusTitle: '¿Está seguro que desea activar los cursos seleccionados?',
        toStatus: 'active'
      })
    }
  }

  onDeactiveCursos() {
    if (this.state.toDeactiveCursos.length > 0) {
      this.setState({
        modalStatus: true,
        modalStatusTitle: '¿Está seguro que desea desactivar los cursos seleccionados?',
        toStatus: 'deactive'
      })
    }
  }

  onConfirmStatus() {
    UIContainer.Instance.showSpinner()
    this.closeModalStatus()

    if (this.state.toStatus === 'active') {
      this.activeCursos()
    } else {      
      this.deactiveCursos()
    }
  }

  deactiveCursos() {
    let ids = this.state.toDeactiveCursos.map(it => it._id)    
    let body = {
      ids: ids,
      toStatus: false,
      user: SecurityContainer.state.user,
      fecha: moment().format()
    }

    fetch('/api/cursos_status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json.ok !== 0) {
        this.setState({
          toActiveCursos: [],
          toDeactiveCursos: [],
          selectedCursos: []
        }, () => {
          this.onLoadCursos()
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

  activeCursos() {
    let ids = this.state.toActiveCursos.map(it => it._id)    
    let body = {
      ids: ids,
      toStatus: true,
      user: SecurityContainer.state.user,
      fecha: moment().format()
    }

    fetch('/api/cursos_status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("json", json)
      if (json.ok !== 0) {
        this.setState({
          toActiveCursos: [],
          toDeactiveCursos: [],
          selectedCursos: []
        }, () => {
          this.onLoadCursos()
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
    this.setState({
      modalStatus: false,
      modalStatusTitle: '',
      toStatus: ''
    })
  }

}

module.exports = new CursosContainer();
