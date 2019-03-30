import React, { Component } from 'react';
import 'whatwg-fetch';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
const DatePicker = typeof window == "undefined" ? require("react-datepicker") : require("react-datepicker").default;
const Select = require("react-select").default;

const { Subscribe } = require("unstated");
const SecurityContainer = require('../../../containers/SecurityContainer');
const InscripcionContainer = require('../../../containers/InscripcionContainer');
const CursosContainer = require('../../../containers/CursosContainer');

class Inscripcion extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    // this.inscripcionContainer.onLoadInscriptions();
    this.cursosContainer.onLoadCursos();
  }

  render() {
    return (
      <Subscribe to={[InscripcionContainer, CursosContainer]}>
        {(inscripcionContainer, cursosContainer) => {
          this.inscripcionContainer = inscripcionContainer;
          this.cursosContainer = cursosContainer;

          return (
            <React.Fragment>
              <h4 className="ui-card__title">Solicitud de Inscripción</h4>
              <h5 style={{color: "#666", marginTop: "0", marginBottom: "0.5em"}}>Datos de inscripción</h5>
              <div className="content__inscription">
                <div className="subcontent">
                  <div className="ui-label__select">Fecha</div>
                  <DatePicker 
                    placeholder="Fecha"
                    selected={inscripcionContainer.state.inscription.date}
                    onChange={(d) => inscripcionContainer.setData('inscription.date', d)}
                    dateFormat="DD/MM/YYYY"
                  />
                </div>
                <div className="subcontent">
                  <div className="ui-label__select">Curso</div>
                  <div>
                    <Select
                      placeholder="Seleccione..."
                      options={cursosContainer.state.cursos}
                      getOptionLabel={(option) => option.nombre}
                      getOptionValue={(option) => option._id}
                      isClearable={true}
                      loadingPlaceholder="Cargando..."
                      noResultsText="No se encontraron cursos"
                      value={inscripcionContainer.state.inscription.curso}
                      onChange={value => inscripcionContainer.setData('inscription.curso', value)}
                    />
                  </div>
                </div>                
              </div>
              <div className="content">
                <div className="subcontent">
                  <div className="ui-label__select">Materia</div>
                </div>

              </div>

              {/* <CardTitle title="Inscripciones" subtitle="Inscripción" />
              <CardText>
                <TextField
                  name="alumno"
                  hintText="Alumno"
                  floatingLabelText="Alumno"
                />
              </CardText>
              <CardActions>
                <FlatButton label="Login" />
              </CardActions> */}
            </React.Fragment>
          )
        }}
      </Subscribe>

    );
  }
}

export default Inscripcion;
