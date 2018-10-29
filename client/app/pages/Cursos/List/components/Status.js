const React = require('react');

const Status = (props) => {
  const status = props.status ? <span style={{ color: "green" }}>Activo</span> : <span style={{ color: "red" }}>Inactivo</span>
  return (
    <React.Fragment>
      {status}
    </React.Fragment>
  )
}

module.exports = Status;
