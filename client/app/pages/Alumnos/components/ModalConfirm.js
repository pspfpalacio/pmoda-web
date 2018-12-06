import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const { Subscribe } = require("unstated");
const AlumnosContainer = require('../../../containers/AlumnosContainer');

const navigate = require("../../../../services/navigate")

const ModalConfirm = (props) => (
  <Subscribe to={[AlumnosContainer]}>{(alumnosContainer) => {
    const { history } = props
    return (            
      <Dialog 
        open={alumnosContainer.state.modal.confirm}
        contentStyle={{height: "80%"}}
        autoScrollBodyContent={true} >            
        <h2 align="center">¿Está seguro que desea confirmar el alumno?</h2>

        <div className="modal__action-buttons">                        
          <FlatButton
            className="button__confirm"
            label="Confirmar"
            primary={true}                            
            onClick={() => alumnosContainer.onConfirm(() => navigate.to(history, "/alumnos/list"))}
          />
          <FlatButton
            label="Cerrar"
            primary={true}
            onClick={() => alumnosContainer.closeModal()}
          />
        </div>
      </Dialog>
    )}
  }</Subscribe>
)

// class ModalConfirm extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {}
//   }

//   render() {
//     const { history } = this.props

//     return (
//       <Subscribe to={[CursosContainer]}>
//         {(curso) => (            
//           <Dialog 
//             open={curso.state.modalOpen}
//             contentStyle={{height: "80%"}}
//             autoScrollBodyContent={true} >            
//             <h2 align="center">¿Está seguro que desea confirmar el curso?</h2>

//             <div className="modal__action-buttons">                        
//               <FlatButton
//                 className="button__confirm"
//                 label="Confirmar"
//                 primary={true}                            
//                 onClick={() => curso.onConfirm(navigate.to(history, "/cursos/list"))}
//               />
//               <FlatButton
//                 label="Cerrar"
//                 primary={true}
//                 onClick={() => curso.closeModal()}
//               />
//             </div>
//           </Dialog>
//         )}
//       </Subscribe>
//     );
//   }
// }

module.exports = withRouter(ModalConfirm)
