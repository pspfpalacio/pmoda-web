import React, { Component } from 'react';
import 'whatwg-fetch';

import {
  Redirect
} from "react-router-dom";

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const { Subscribe } = require("unstated")
const SecurityContainer = require('../../containers/SecurityContainer');

class Login extends Component {
    constructor(props) {
      super(props);

      SecurityContainer.isSessionActive();
  
      this.state = {}
    }
  
    render() {
      // console.log("this.props", this.props);

      const { from } = this.props.location.state || { from: { pathname: "/" } };

      // if (SecurityContainer.state.isAuthenticated) {
      //   return <Redirect to={from} />;
      // }

      return (        
        <Subscribe to={[SecurityContainer]}>
        {(security) => {

          if (security.state.isAuthenticated) {
            return <Redirect to={from} />;
          }
  
          return (
            <Card>
                <CardHeader
                    title="Login"
                />
                <CardTitle title="Card title" subtitle="Card subtitle" />
              <div style={{textAlign: "right"}}>
              <CardText>
                  <TextField
                    name="user"
                    hintText="Usuario"
                    floatingLabelText="Usuario"
                    onChange={(e) => security.setInputText(e)}
                  />
              </CardText>
              <CardText>
                  <TextField
                    name="pass"
                    hintText="Password"
                    floatingLabelText="Password"
                    type="password"
                    onChange={(e) => security.setInputText(e)}
                  />
              </CardText>
                <CardActions style={{textAlign: "right"}}>
                  <FlatButton label="Login" keyboardFocused={true} onClick={(e) => {
                    console.log("e", e)
                    security.login()
                  }} />
                </CardActions>
              </div>

            </Card>
          )
        }}
        </Subscribe>
        
      );
    }
}

export default Login;
