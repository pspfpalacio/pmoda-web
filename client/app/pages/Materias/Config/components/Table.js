const React = require('react');
const { Subscribe } = require('unstated');
const moment = require("moment");
require('moment/locale/es');

const MateriasContainer = require("../../../../containers/MateriasContainer");

const ReactTable = require("react-table").default;
const DatePicker = typeof window == "undefined" ? require("react-datepicker") : require("react-datepicker").default;

import Checkbox from 'material-ui/Checkbox';

const getColumns = (materiasContainer) => {
  return [
    {
      accessor: 'name',
      Cell: row => {
        return (
          <Checkbox             
            onCheck={(e) => materiasContainer.onCheckCommission(e, row.original)}
            checked={materiasContainer.isCheckCommission(row.original)} />
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
      Header: 'Día',
      accessor: 'day'
    },
    {
      Header: 'Desde (hs)',
      accessor: 'start',
      Cell: row => (
        <DatePicker 
          disabled={!materiasContainer.isCheckCommission(row.original)}
          selected={row.original.start ? moment(`2019-02-02T${row.original.start}:28-03:00`) : null}
          onChange={(d) => materiasContainer.onChangeComisionHour(row.original, 'start', d.format("HH:mm"))}
          showTimeSelect={true}
          showTimeSelectOnly={true}
          timeIntervals={15}
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          timeCaption="Desde"
        />
      )
    },
    {
      Header: 'Hasta (hs)',
      accessor: 'end',
      Cell: row => (
        <DatePicker
          disabled={!materiasContainer.isCheckCommission(row.original)}
          selected={row.original.end ? moment(`2019-02-02T${row.original.end}:28-03:00`) : null}
          onChange={(d) => materiasContainer.onChangeComisionHour(row.original, 'end', d.format("HH:mm"))}
          showTimeSelect={true}
          showTimeSelectOnly={true}
          timeIntervals={15}
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          timeCaption="Hasta"
        />
      )
    }
  ];
};

const Table = (props) => (
  <Subscribe
    to={[MateriasContainer]}>{(materiasContainer) => {
    // const { history } = props
    return (      
      <ReactTable        
        data={materiasContainer.state.materia.commissions}
        columns={getColumns(materiasContainer)}
        defaultPageSize={7} 
        showPagination={false}
        noDataText="No se encontraron días para configurar."
        className="-striped -highlight"
      />      
    )
  }}</Subscribe>
);

module.exports = Table;
