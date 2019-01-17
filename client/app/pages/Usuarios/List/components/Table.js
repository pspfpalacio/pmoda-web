const React = require('react')
const { Subscribe } = require('unstated')

const UsuariosContainer = require("../../../../containers/UsuariosContainer")
const SecurityContainer = require("../../../../containers/SecurityContainer")

const navigate = require("../../../../../services/navigate")

const ReactTable = require("react-table").default
const { MdModeEdit } = require('react-icons/md')

const Status = require("./Status")

import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Autorenew from 'material-ui/svg-icons/action/autorenew';
import { withRouter } from 'react-router-dom';

const getColumns = (usuariosContainer, securityContainer, history) => {
  return [
    {
      accessor: 'name',
      Cell: row => {
        return (
          <Checkbox             
            onCheck={(e) => usuariosContainer.onCheck(e, row.original)}
            checked={usuariosContainer.isCheck(row.original)} />
        )
      },
      style: {
        padding: "5px 5px 5px 15px"
      },
      width: 50,
      sortable: false,
      resizable: false
    },
    {
      Header: 'Username',
      accessor: 'user'
    },
    {
      Header: 'Apellido y Nombre',
      accessor: 'name',
      Cell: row => {
        let completeName = `${row.original.lastname}, ${row.original.name}`
        return (
          <span>{completeName}</span>
        )
      }      
    },
    {
      Header: 'Correo',
      accessor: 'email'
    },
    {
      Header: 'Rol',
      accessor: 'role',
      Cell: row => <span>{row.value.description}</span>
    },
    {
      Header: 'Sucursal',
      accessor: 'office',
      show: (securityContainer.state.authUser.office.name === 'all') ? true : false,
      Cell: row => (
        <span>{row.original.office.description}</span>
      )
    },
    {
      Header: () => "Estado",
      getHeaderProps: (state, rowInfo, column) => {
        return {
          style: {
            overflow: "unset"
          }
        }
      },
      accessor: "enabled",
      filterable: true,
      Cell: row => <Status status={row.original.enabled} />
    },
    {
      Header: '',
      id: 'actions',
      Cell: row => (        
        <span style={{cursor: 'pointer'}}>
          <MdModeEdit 
            onClick={() => {              
              usuariosContainer.onEditUsuario(row.original, () => navigate.to(history, "/usuarios/config"));
            }}
          />
        </span>
      ),
      width: 60,
      style: {
        fontSize: 18,
        padding: "0 16px",
        textAlign: "right",
        userSelect: "none",
        lineHeight: "30px"
      }
    }
  ];
};

const Table = (props) => (
  <Subscribe
    to={[UsuariosContainer, SecurityContainer]}>{(usuariosContainer, securityContainer) => {
    const { history } = props
    return (
      <React.Fragment>
        <div className="actions">
          <IconButton tooltip="Refrescar" onClick={() => usuariosContainer.onLoadUsuarios()}>
            <Autorenew />
          </IconButton>
        </div>
        <ReactTable        
          data={usuariosContainer.state.usuarios}
          columns={getColumns(usuariosContainer, securityContainer, history)}
          defaultPageSize={10} 
          showPagination={true}
          noDataText="No se encontraron usuarios."
          loadingText="Cargando..."
          previousText="Anterior"
          nextText="Siguiente"
          pageText="Página"
          ofText="de"
          rowsText="filas"
          pageSizeOptions={[10, 20, 25, 50]}
          className="-striped -highlight"        
        />
      </React.Fragment>
    )
  }}</Subscribe>
);

module.exports = withRouter(Table);
