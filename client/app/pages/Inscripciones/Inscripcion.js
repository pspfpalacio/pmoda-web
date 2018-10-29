import React, { Component } from 'react';
import 'whatwg-fetch';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const { Subscribe } = require("unstated");
const SecurityContainer = require('../../containers/SecurityContainer');

class Inscripcion extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    console.log("this.props", this.props);

    return (
      <Subscribe to={[SecurityContainer]}>
        {(security) => {

          return (
            <Card>
              <CardHeader
                title="Inscripción"
              />
              <CardTitle title="Inscripciones" subtitle="Inscripción" />
              <CardText>
                <TextField
                  name="alumno"
                  hintText="Alumno"
                  floatingLabelText="Alumno"
                />
              </CardText>
              <CardActions>
                <FlatButton label="Login" />
              </CardActions>
            </Card>
          )
        }}
      </Subscribe>

    );
  }
}

export default Inscripcion;
