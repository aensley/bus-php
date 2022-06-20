import { DateTime } from 'luxon'
import $ from 'jquery'
import dt from 'datatables.net-bs5'

dt.datetime(DateTime.DATETIME_SHORT)

const setStatus = (data) => {
  const classes = 'text-light bg-' + (data.status === 'success' ? 'success' : 'danger')
  $('#status').removeClass().addClass(classes).text(data.message)
}

window.addEventListener('load', () => {
  $('#customShort').on('change', () => {
    $('#shortRow').toggleClass('d-none')
  })

  $('#addForm').on('submit', (e) => {
    e.preventDefault()
    $.post('create.php', {
      s: $('#short').val(),
      l: $('#long').val()
    })
      .done((d) => {
        setStatus(d)
      })
      .fail((d) => {
        setStatus(d)
      })
      .always((d) => {
        setStatus(d)
      })
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
