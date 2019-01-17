const { Container } = require('unstated');
const moment = require('moment');
import 'whatwg-fetch';

class SecurityContainer extends Container {
  constructor() {
    super();
  
    /**
     * Todos los campos del state son solamente para lectura. Si se quiere
     * modificar cualquier valor usar los métodos setter.
     */
    this.state = {
      user: null,
      pass: null,
      loginUser: null,
      isAuthenticated: false,
      offices: {
        value: '',
        loading: false,
        list: []
      },
      sesion: null,
      authUser: null
    };
  }

  login() {      
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        let authenticatedUser = data.filter(d => {
          return d.user === this.state.user && d.pass === this.state.pass
        });
        if (authenticatedUser.length > 0) {
          let sessionId = this.state.user + Math.random().toString().substring(2,12);
          let fechaHora = moment().format();

          let user = {
            _id: authenticatedUser[0]._id,
            user: authenticatedUser[0].user,
            name: authenticatedUser[0].name,
            lastname: authenticatedUser[0].lastname,
            role: authenticatedUser[0].role,
            office: authenticatedUser[0].office
          }
          const body = {
            user,
            sessionId: sessionId,
            fechaHora: fechaHora,
            enabled: true
          };
          fetch('/api/sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          }).then(res => res.json())
            .then(resp => {
              console.log("resp", resp);
              this.setState({
                isAuthenticated: true,
                authUser: resp.user,
                sesion: resp
              });
              this.setParams('offices', {value: resp.user.office})
              window.sessionStorage.setItem("session-promoda", sessionId);
            });
        }

        this.setState({
          isAuthenticated: authenticatedUser.length > 0 ? true : false
        });
      });
  }

  logout(callback) {
    const sessionId = window.sessionStorage.getItem("session-promoda");
    const body = {status: false};
    fetch(`/api/sessions_status/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(json => {
      console.log("respuesta logout", json);
      this.setState({
        user: '',
        isAuthenticated: false,
        authUser: null,
        sesion: null
      }, () => {
        this.setParams('offices', {value: ''});
        window.sessionStorage.removeItem("session-promoda");
        callback();
      })      
    });
  }

  setInputText(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  isSessionActive() {
    let sessionId = window.sessionStorage.getItem("session-promoda");
    console.log("sessionId", sessionId);
    fetch(`/api/sessions/active/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        console.log("session", data);
        if (data && data.enabled) {
          let now = moment();
          let fechaHora = moment(data.fechaHora);
          let diff = now.diff(fechaHora, 'hours');            
          if (diff <= 1) {
            this.setState({
              user: data.user.user,
              isAuthenticated: true,
              authUser: data.user,
              sesion: data
            })
            this.setParams('offices', {value: data.user.office})
          }
        } else {
          this.setState({
            user: '',
            isAuthenticated: false,
            authUser: null,
            sesion: null
          })
          this.setParams('offices', {value: ''})
        }
      });
  }

  onLoadOffices() {
    let list = fetch('/api/offices').then(res => res.json())
    Promise.resolve(list).then(values => {      
      const list = values;
      this.setParams('offices', {list});
    }).catch(error => {
      console.log("Error al obtener las oficinas", error)
      this.setParams('offices', {list: []});
    })
  }

  setParams(name, params) {
    let newState = state => {
      return {
        [name]: Object.assign({}, state[name], params)
      }
    }
    this.setState(newState);
  }
}

module.exports = new SecurityContainer();
