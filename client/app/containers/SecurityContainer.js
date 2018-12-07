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
      isAuthenticated: false
    };
  }

    login() {      
      fetch('/api/users')
        .then(res => res.json())
        .then(data => {
          console.log("data", data)
          let authenticated = data.filter(d => {
            return d.user === this.state.user && d.pass === this.state.pass
          });

          if (authenticated.length > 0) {
            let sessionId = this.state.user + Math.random().toString().substring(2,12);
            let fechaHora = moment().format();
            console.log("sessionId", sessionId);
            console.log("fechaHora", fechaHora);
            const body = {
              user: this.state.user,
              sessionId: sessionId,
              fechaHora: fechaHora,
              enabled: true
            };
//            window.sessionStorage.setItem("session-promoda", sessionId);
            fetch('/api/sessions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
            }).then(res => res.json())
              .then(json => {                
                window.sessionStorage.setItem("session-promoda", sessionId);
              });
          }

          this.setState({
            isAuthenticated: authenticated.length > 0 ? true : false
          });
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
          if (data) {
            let now = moment();
            let fechaHora = moment(data.fechaHora);
            let diff = now.diff(fechaHora, 'hours');            
            if (diff <= 1) {
              this.setState({
                isAuthenticated: true,
                user: data.user,
                office: data.user.office
              })
            }
          }
        });
    }
}

module.exports = new SecurityContainer();
