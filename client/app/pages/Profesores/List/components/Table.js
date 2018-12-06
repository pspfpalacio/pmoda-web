const React = require('react')
const { Subscribe } = require('unstated')

const ProfesoresContainer = require("../../../../containers/ProfesoresContainer")

const navigate = require("../../../../../services/navigate")

const ReactTable = require("react-table").default
const { MdModeEdit } = require('react-icons/md')

const Status = require("./Status")

import Checkbox from 'material-ui/Checkbox';
import { withRouter } from 'react-router-dom';

const getColumns = (profesoresContainer, history) => {
  return [
    {
      accessor: 'name',
      Cell: row => {
        return (
          <Checkbox             
            onCheck={(e) => profesoresContainer.onCheck(e, row.original)}
            checked={profesoresContainer.isCheck(row.original)} />
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
      Header: 'DNI',
      accessor: 'dni',
      filterable: true
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
      Header: 'Tel. Cel.',
      accessor: 'cell_phone'
    },
    {
      Header: 'Tel. Fijo',
      accessor: 'home_phone'
    },
    {
      Header: 'Correo',
      accessor: 'email'
    },
    {
      Header: 'Dirección',
      accessor: 'address_street',
      Cell: row => {
        const completeAddress = `${row.original.address_street} ${row.original.address_number}`
        return (
          <span>{completeAddress}</span>
        )
      }
    },
    {
      Header: 'Localidad',
      accessor: 'location',
      Cell: row => {
        // const completeAddress = `${row.original.address_street} ${row.original.address_number}`
        return (
          <span>{row.original.location.name}</span>
        )
      }
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
              profesoresContainer.onEditProfesor(row.original, () => navigate.to(history, "/profesors/config"));
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
    to={[ProfesoresContainer]}>{(profesoresContainer) => {
    const { history } = props
    return (
      <ReactTable        
        data={profesoresContainer.state.profesores}
        columns={getColumns(profesoresContainer, history)}
        defaultPageSize={10} 
        showPagination={true}
        noDataText="No se encontraron profesores."
        loadingText="Cargando..."
        previousText="Anterior"
        nextText="Siguiente"
        pageText="Página"
        ofText="de"
        rowsText="filas"
        pageSizeOptions={[10, 20, 25, 50]}
        className="-striped -highlight withdrawals-table"        
      />
    )
  }}</Subscribe>
);

module.exports = withRouter(Table);
