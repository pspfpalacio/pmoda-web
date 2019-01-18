const React = require('react')
const { Subscribe } = require('unstated')

const MateriasContainer = require("../../../../containers/MateriasContainer")
const SecurityContainer = require("../../../../containers/SecurityContainer")

const navigate = require("../../../../../services/navigate")

const ReactTable = require("react-table").default
const { MdModeEdit } = require('react-icons/md')

const Status = require("./Status")

import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Autorenew from 'material-ui/svg-icons/action/autorenew';
import { withRouter } from 'react-router-dom';

const getColumns = (materiasContainer, securityContainer, history) => {
  return [
    {
      accessor: 'name',
      Cell: row => {
        return (
          <Checkbox             
            onCheck={(e) => materiasContainer.onCheck(e, row.original)}
            checked={materiasContainer.isCheck(row.original)} />
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
      Header: 'Nombre',
      accessor: 'name',
      filterable: true
    },
    {
      Header: 'Curso',
      accessor: 'curso',
      Cell: row => {        
        return (
          <span>{row.original.curso.nombre}</span>
        )
      }
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
              materiasContainer.onEdit(row.original, () => navigate.to(history, "/materias/config"));
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
    to={[MateriasContainer, SecurityContainer]}>{(materiasContainer, securityContainer) => {
    const { history } = props
    return (
      <React.Fragment>
        <div className="actions">
          <IconButton tooltip="Refrescar" onClick={() => materiasContainer.onLoadMaterias()}>
            <Autorenew />
          </IconButton>
        </div>
        <ReactTable        
          data={materiasContainer.state.materias}
          columns={getColumns(materiasContainer, securityContainer, history)}
          defaultPageSize={10} 
          showPagination={true}
          noDataText="No se encontraron materias."
          loadingText="Cargando..."
          previousText="Anterior"
          nextText="Siguiente"
          pageText="Página"
          ofText="de"
          rowsText="filas"
          pageSizeOptions={[10, 20, 25, 50]}
          className="-striped -highlight withdrawals-table"        
        />
      </React.Fragment>
    )
  }}</Subscribe>
);

module.exports = withRouter(Table);
