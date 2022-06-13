import { DateTime } from 'luxon'
const $ = require('jquery')
const dt = require('datatables.net-dt')(window, $)

dt.datetime(DateTime.DATETIME_SHORT)

$(function () {
  $('#list').DataTable({
    ajax: 'list.php',
    columns: [{ data: 's' }, { data: 'l' }, { data: 'c' }],
    columnDefs: [
      {
        targets: 3,
        render: dt.render.datetime(DateTime.DATETIME_SHORT)
      }
    ],
    deferRender: true,
    dom: 'BLfrtip',
    lengthMenu: [5, 10, 25, 50, 100],
    pageLength: 10,
    responsive: true
  })
})
