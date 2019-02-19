const { Container } = require('unstated')
const moment = require('moment')
const SecurityContainer = require('./SecurityContainer')
const UIContainer = require("./UIContainer")

import 'whatwg-fetch';

const initCommissions = () => {
  return [
    {day: 'Lunes', start: null, end: null},
    {day: 'Martes', start: null, end: null},
    {day: 'Miercoles', start: null, end: null},
    {day: 'Jueves', start: null, end: null},
    {day: 'Viernes', start: null, end: null},
    {day: 'Sábado', start: null, end: null},
    {day: 'Domingo', start: null, end: null},
  ]
}

const initMateria = () => {
  
  return {
    name: '',
    curso: '',
    instructor_primary: '',
    instructor_alternate: '',
    commissions: initCommissions(),
    selectedCommissions: [],
    user_create: '',
    user_modify: '',
    date_create: '',
    last_modify: '',
    enabled: true
  }
}

class MateriasContainer extends Container {
  constructor() {
    super();

    /**
     * Todos los campos del state son solamente para lectura. Si se quiere
     * modificar cualquier valor usar los métodos setter.
     */
    this.state = {
      materias: [],
      selected: [],
      toActive: [],
      toDeactive: [],
      toStatus: '',
      materia: initMateria(),
      configTitle: '',
      modal: {
        confirm: false,
        status: false,
        statusTitle: ''
      },
      loading: {
        cursos: false,
        profesores: false
      },
      errors: [],
      cursos: [],
      profesores: []
    }
  }

  onLoadMaterias() {
    let office = SecurityContainer.state.offices.value;
    let list = fetch('/api/subjects').then(res => res.json())
    Promise.all([list]).then(values => {
      const materias = office.name === 'all' ? values[0] : values[0].filter(it => it.office.name === office.name);
      this.setState({
        materias
      })
    }).catch(error => {
      console.log("Error al obtener las materias", error)
      this.setState({materias: []})
    })
  }

  onLoadCursos() {
    this.setParams('loading', {cursos: true});
    let office = SecurityContainer.state.offices.value;
    let list = fetch('/api/cursos').then(res => res.json())
    Promise.all([list]).then(values => {
      const cursos = office.name === 'all' ? values[0] : values[0].filter(it => it.office.name === office.name || it.office.name === 'all');      
      this.setState({
        cursos
      }, () => this.setParams('loading', {cursos: false}))
    }).catch(error => {
      console.log("Error al obtener los cursos", error)
      this.setState({cursos: []}, () => this.setParams('loading', {cursos: false}))
    })
  }

  onLoadProfesores() {
    this.setParams('loading', {profesores: true})    
    let office = SecurityContainer.state.offices.value;
    let list = fetch('/api/instructors').then(res => res.json())
    Promise.all([list]).then(values => {      
      const profesores = office.name === 'all' ? values[0] : values[0].filter(it => it.office.name === office.name || it.office.name === 'all');
      this.setState({
        profesores
      }, () => this.setParams('loading', {profesores: false}))
    }).catch(error => {
      console.log("Error al obtener los profesores", error)
      this.setState({profesores: []}, () => this.setParams('loading', {profesores: false}))
    })
  }

  setParams(name, params, callback) {
    const newState = state => {
      return {
        [name]: Object.assign({}, state[name], params)
      }
    }
    if (callback) {
      this.setState(newState, callback)
    } else {
      this.setState(newState)
    }  
  }

  setStateParams(name, value) {
    this.setState({
      [name]: value
    })
  }

  onCheck(event, row) {
    let { selected, toDeactive, toActive } = this.state;
    if (event.target.checked) {
      if (row.enabled) {
        toDeactive.push(row)
      } else {
        toActive.push(row)
      }
      selected.push(row)
    } else {
      toDeactive = this.state.toDeactive.filter(data => data._id !== row._id)
      toActive = this.state.toActive.filter(data => data._id !== row._id)
      selected = this.state.selected.filter(data => data._id !== row._id)
    }
    this.setState({toDeactive, toActive, selected})
  }

  isCheck(row) {
    let listChecked = this.state.selected.filter(data => data._id === row._id)
    return listChecked.length > 0
  }

  onNew() {
    this.setState({
      materia: initMateria(),
      configTitle: 'Nueva Materia',
      errors: []
    })
  }

  onEdit(row, callback) {
    let commissions = initCommissions();
    let defCommissions = commissions.map(data => {
      let commision = null;
      row.commissions.map(sRow => {
        if (sRow.day === data.day) {
          commision = sRow;
        }
      });
      if (commision) {
        return commision;
      } else {
        return data;
      }
    });
    let materia = row;
    materia.selectedCommissions = row.commissions;
    materia.commissions = defCommissions;
    this.setState({
      materia,
      configTitle: 'Modificar Materia',
      errors: []
    }, () => {
      SecurityContainer.setParams('offices', {value: row.office});
      this.onLoadCursos();
      this.onLoadProfesores();
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
    if (this.state.toActive.length > 0) {
      this.setState(state => {
        return {
          modal: Object.assign({}, state.modal, {
            status: true,
            statusTitle: '¿Está seguro que desea activar las materias seleccionadas?'
          }),
          toStatus: 'active'
        }
      })
    }
  }
  
  onDeactive() {
    if (this.state.toDeactive.length > 0) {
      this.setState(state => {
        return {
          modal: Object.assign({}, state.modal, {
            status: true,
            statusTitle: '¿Está seguro que desea desactivar las materias seleccionadas?'
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
      this.active()
    } else {      
      this.deactive()
    }
  }

  active() {
    let ids = this.state.toActive.map(it => it._id)    
    let body = {
      ids: ids,
      toStatus: true,
      user: SecurityContainer.state.user,
      fecha: moment().format()
    }

    fetch('/api/subjects_status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {      
      if (json.ok !== 0) {
        this.setState({
          toActive: [],
          toDeactive: [],
          selected: []
        }, () => {
          this.onLoadMaterias();
          UIContainer.Instance.closeSpinner();
          UIContainer.Instance.showSnackbar("Estado actualizado correctamente", "success", "CERRAR");
        })
      }
    }).catch(error => {
      console.log("error", error);
      UIContainer.Instance.closeSpinner();
      UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el estado", "error", "CERRAR");
    })
  }

  deactive() {
    let ids = this.state.toDeactive.map(it => it._id)    
    let body = {
      ids: ids,
      toStatus: false,
      user: SecurityContainer.state.user,
      fecha: moment().format()
    }

    fetch('/api/subjects_status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {      
      if (json.ok !== 0) {
        this.setState({
          toActive: [],
          toDeactive: [],
          selected: []
        }, () => {
          this.onLoadMaterias();
          UIContainer.Instance.closeSpinner();
          UIContainer.Instance.showSnackbar("Estado actualizado correctamente", "success", "CERRAR");
        })
      }
    }).catch(error => {
      console.log("error", error);
      UIContainer.Instance.closeSpinner();
      UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar el estado", "error", "CERRAR");
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
      curso,
      instructor_primary,
      instructor_alternate,
      selectedCommissions
    } = this.state.materia;
    
    const errors = [];
    (name.length === 0) && errors.push('name');
    (curso.length === 0) && errors.push('curso');
    (instructor_primary.length === 0) && errors.push('instructor_primary');
    (instructor_alternate.length === 0) && errors.push('instructor_alternate');
    (selectedCommissions.length === 0) && errors.push('commissions');
    this.setState({ errors: errors });

    if (errors.length > 0) {
      UIContainer.Instance.showSnackbar("Revise los campos obligatorios", "error", "CERRAR")
    } else {
      this.setParams('modal', {confirm: true});
      // this.setStateModal({confirm: true})
    }
  }

  closeModal() {
    this.setParams('modal', {confirm: false});
    // this.setStateModal({confirm: false})
  }

  onConfirm(callback) {
    UIContainer.Instance.showSpinner()

    if (this.state.materia._id) {
      this.update(callback)
    } else {     
      this.create(callback)
    }
  }

  create(callback) {
    const body = { 
      name: this.state.materia.name,
      curso: this.state.materia.curso,
      instructor_primary: this.state.materia.instructor_primary,
      instructor_alternate: this.state.materia.instructor_alternate,
      commissions: this.state.materia.selectedCommissions,
      office: SecurityContainer.state.offices.value,
      user_create: SecurityContainer.state.user,
      date_create: moment().format()
    }
    console.log("body", body)

    fetch('/api/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {      
      if (json._id) {
        this.onLoadMaterias();
        callback();
        this.setParams('modal', {confirm: false});
        // this.setStateModal({confirm: false});
        UIContainer.Instance.closeSpinner();
        UIContainer.Instance.showSnackbar("Materia creada correctamente", "success", "CERRAR");
      } else {
        this.setParams('modal', {confirm: false});
        // this.setStateModal({confirm: false});
        UIContainer.Instance.closeSpinner();
        UIContainer.Instance.showSnackbar("Ocurrió un error al crear la materia", "error", "CERRAR");
      }      
    }).catch(error => {
      console.log("error", error);
      this.setParams('modal', {confirm: false});
      // this.setStateModal({confirm: false});
      UIContainer.Instance.closeSpinner();
      UIContainer.Instance.showSnackbar("Ocurrió un error al crear la materia", "error", "CERRAR");
    })
  }

  update(callback) {
    const body = { 
      name: this.state.materia.name,
      curso: this.state.materia.curso,
      instructor_primary: this.state.materia.instructor_primary,
      instructor_alternate: this.state.materia.instructor_alternate,
      commissions: this.state.materia.selectedCommissions,
      office: SecurityContainer.state.offices.value,
      user_modify: SecurityContainer.state.user,
      last_modify: moment().format()
    };

    fetch(`/api/subjects/${this.state.materia._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {      
      if (json.ok >= 1) {
        this.onLoadMaterias();
        callback();
        this.setParams('modal', {confirm: false});
        // this.setStateModal({confirm: false});
        UIContainer.Instance.closeSpinner();
        UIContainer.Instance.showSnackbar("Materia actualizada correctamente", "success", "CERRAR");
      } else {
        this.setParams('modal', {confirm: false});
        // this.setStateModal({confirm: false});
        UIContainer.Instance.closeSpinner();
        UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar la materia", "error", "CERRAR");
      }
    }).catch(error => {
      this.setParams('modal', {confirm: false});
      // this.setStateModal({confirm: false});
      console.log("error", error);
      UIContainer.Instance.closeSpinner();
      UIContainer.Instance.showSnackbar("Ocurrió un error al actualizar la materia", "error", "CERRAR");
    })
  }

  onCheckCommission(event, row) {
    if (event.target.checked) {
      if (this.state.materia.selectedCommissions.filter(it => JSON.stringify(it) === JSON.stringify(row)).length === 0) {
        this.setParams('materia', {selectedCommissions: this.state.materia.selectedCommissions.concat(row)})
      }
    } else {
      if (this.state.materia.selectedCommissions.filter(it => JSON.stringify(it) === JSON.stringify(row)).length > 0) {
        const commissions = this.state.materia.commissions.map(it => {
          if (JSON.stringify(it) === JSON.stringify(row)) {
            it.start = null;
            it.end = null;
          }
          return it;
        })
        this.setParams('materia', {
          selectedCommissions: this.state.materia.selectedCommissions.filter(it => JSON.stringify(it) !== JSON.stringify(row)),
          commissions
        })
      }
    }

  }

  isCheckCommission(row) {
    return this.state.materia.selectedCommissions.filter(it => JSON.stringify(it) === JSON.stringify(row)).length > 0;
  }

  onChangeComisionHour(row, name, value) {    
    let commissions = this.state.materia.commissions.map(data => {
      if (data.day === row.day) {
        data[name] = value;
      }
      return data;
    });
    this.setParams('materia', {commissions});
  }

}

module.exports = new MateriasContainer();
