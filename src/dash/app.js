import $ from 'jquery'
import 'datatables.net-bs5'
import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faPencil, faTrashCan, faPlay } from '@fortawesome/free-solid-svg-icons'

library.add(faPencil, faTrashCan, faPlay)

const play = icon({ prefix: 'fas', iconName: 'play' }).html
const pencil = icon({ prefix: 'fas', iconName: 'pencil' }).html
const trashCan = icon({ prefix: 'fas', iconName: 'trash-can' }).html

const setStatus = (data) => {
  const classes = 'text-light bg-' + (data.status === 'success' ? 'success' : 'danger')
  $('#status').removeClass().addClass(classes).text(data.message)
}

window.addEventListener('load', () => {
  $('button[type="submit"]').html(play)
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

  const listTable = $('#list').DataTable({
    ajax: 'list.php',
    columns: [{ data: 's' }, { data: 'l' }, { data: 'c' }],
    columnDefs: [
      {
        targets: 2,
        render: (data, type) => {
          if (type === 'display') {
            return new Date(data * 1000).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
          }

          return data
        }
      },
      {
        targets: 3,
        className: 'text-center',
        data: null,
        defaultContent:
          '<button class="btn btn-warning">' +
          pencil +
          ' Edit</button> <button class="btn btn-danger">' +
          trashCan +
          ' Delete</button>'
      }
    ],
    deferRender: true,
    dom: 'BLfrtip',
    lengthMenu: [5, 10, 25, 50, 100],
    pageLength: 10,
    responsive: true
  })

  $('#list tbody').on('click', 'button', function () {
    const data = listTable.row($(this).parents('tr')[0]).data()
    if ($.trim($(this).text()) === 'Delete') {
      if (window.confirm('Are you sure you want to delete short URL "' + data.s + '" => "' + data.l + '"?')) {
        console.log('Delete ' + data.s)
      } else {
        console.log("Don't delete")
      }
    } else {
      console.log('Edit ' + data.s + ' => ' + data.l)
    }
  })
})
