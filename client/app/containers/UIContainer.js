const { Container } = require('unstated')

let Instance = null

class UIContainer extends Container {
  constructor() {
    super();

    /**
     * Todos los campos del state son solamente para lectura. Si se quiere
     * modificar cualquier valor usar los métodos setter.
     */
    this.state = {
      snackbar: {
        open: false,
        message: '',
        action: 'CERRAR',
        // autoHideDuration: 0,
        modifier: ''
      },
      spinner: {
        size: 80,
        thickness: 7,
        show: false,
        modifier: 'fullscream',
        label: null
      }
    }

    Instance = this
  }

  static get Instance() {
    return Instance
  }

  showSnackbar(message, modifier, action) {
    const stateChange = state => {
      return {
        snackbar: Object.assign({}, state.snackbar, {
          open: true,
          message,
          modifier,
          action
        })
      }
    }
    this.setState(stateChange);
  }

  closeSnackbar() {
    const stateChange = state => {
      return {
        snackbar: Object.assign({}, state.snackbar, {
          open: false,
          message: '',
          action: 'CERRAR',
          // autoHideDuration: 0,
          modifier: ''
        })
      }
    }
    this.setState(stateChange);
  }

  showSpinner(size = 80, thickness = 7, modifier = 'fullscream', label = null) {
    const stateChange = state => {
      return {
        spinner: Object.assign({}, state.spinner, {
          size,
          thickness,
          show: true,
          modifier,
          label
        })
      };
    }
    this.setState(stateChange);
  }

  closeSpinner() {
    const stateChange = state => {
      return {
        spinner: Object.assign({}, state.spinner, {
          size: 80,
          thickness: 7,
          show: false,
          modifier: 'fullscream',
          label: null
        })
      };
    }
    this.setState(stateChange);
  }


}

module.exports = UIContainer