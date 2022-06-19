import { DateTime } from 'luxon'
import $ from 'jquery'
import dt from 'datatables.net-bs5'

dt.datetime(DateTime.DATETIME_SHORT)

window.addEventListener('load', () => {
  $('#customShort').on('change', function () {
    $('#shortRow').toggleClass('d-none')
  })

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
