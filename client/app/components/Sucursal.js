import React from 'react';
const { Subscribe } = require("unstated");

const Select = require("react-select").default;

const SecurityContainer = require('../containers/SecurityContainer');

class Sucursal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    SecurityContainer.onLoadOffices();
  }

  render() {
    return (
      <Subscribe to={[SecurityContainer]}>{(securityContainer) => (
        <div className="content__sucursal">
          <span>Sucursal:</span>          
          {securityContainer.state.authUser && securityContainer.state.authUser.office.name !== 'all' ?
          <div className="label-sucursal">
            {securityContainer.state.authUser.office.description}
          </div>
          : 
          <div className="select-sucursal">
            <Select              
              placeholder="Seleccione..."
              options={securityContainer.state.offices.list}
              getOptionLabel={(option) => option.description}
              getOptionValue={(option) => option.name}
              isClearable={false}
              loadingPlaceholder="Cargando..."
              noResultsText="No se encontraron oficinas"
              isLoading={securityContainer.state.offices.loading}
              value={securityContainer.state.offices.value}
              onChange={value => securityContainer.setParams('offices', {value})}
            />
          </div>
          }         
        </div>
      )}    
      </Subscribe>
    )
  }
};

module.exports = Sucursal;
