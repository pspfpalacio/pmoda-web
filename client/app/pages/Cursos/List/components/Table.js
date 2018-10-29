const React = require('react')
const {Subscribe} = require('unstated')

const CursosContainer = require("../../../../containers/CursosContainer")

const navigate = require("../../../../../services/navigate")

const ReactTable = require("react-table").default
const {MdModeEdit, MdDelete} = require('react-icons/md')

const Status = require("./Status")

import Checkbox from 'material-ui/Checkbox';
import { withRouter } from 'react-router-dom';

const getColumns = (cursosContainer, history) => {
  return [
    {
      accessor: 'nombre',
      Cell: row => {
        return (
          <Checkbox 
            // className="checkbox-list" type="label-after"
            onCheck={(e) => cursosContainer.onCheck(e, row.original)}
            checked={cursosContainer.isCheck(row.original)} />
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
      accessor: 'nombre',
      filterable: true
    },
    {
      Header: 'Duración en Meses',
      accessor: 'duracionMeses'      
    },
    {
      Header: 'Costo del curso',
      accessor: 'costoCurso',
      Cell: row => (
        <span>$ {row.original.costoCurso}</span>
      )
    },
    {
      Header: 'Costo de matricula',
      accessor: 'costoMatricula',
      Cell: row => (
        <span>$ {row.original.costoMatricula}</span>
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
              cursosContainer.onEditCurso(row.original)
              navigate.to(history, "/cursos/config")
            }}
          />
          {/* <MdDelete /> */}
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

const CursosTable = (props) => (
  <Subscribe
    to={[CursosContainer]}>{(cursosContainer) => {
    const { history } = props
    return (
      <ReactTable
        // loading={configurationContainer.state.searchLoading}
        data={cursosContainer.state.cursos}
        columns={getColumns(cursosContainer, history)}
        // defaultPageSize={configurationContainer.state.teams.length} 
        defaultPageSize={10} 
        showPagination={true}
        noDataText="No se encontraron cursos."
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

module.exports = withRouter(CursosTable);
