import $ from 'jquery'
import 'datatables.net-bs5'
import 'datatables.net-responsive-bs5'
import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faTrashCan, faPlay } from '@fortawesome/free-solid-svg-icons'

const publicDomain = '{{public-domain}}'
library.add(faTrashCan, faPlay)

const play = icon({ prefix: 'fas', iconName: 'play' }).html
const trashCan = icon({ prefix: 'fas', iconName: 'trash-can' }).html

const setStatus = (data) => {
  console.log(data)
  const classes = 'p-4 fw-bold fs-5 text-center text-light bg-' + (data.status === 'success' ? 'success' : 'danger')
  const $status = $('#status')
  $status.removeClass().addClass(classes).text(data.message)
  if (data.action === 'create' && data.short) {
    $status.append(
      '<p class="mt-3 mb-0">Click to copy: <a href="https://' +
        publicDomain +
        '/' +
        data.short +
        '" title="Copy Short URL" class="copy link-light me-1">' +
        publicDomain +
        '/' +
        data.short +
        '</a></p>'
    )
  }
}

window.addEventListener('load', () => {
  $('main').on('click', 'a.copy', function (e) {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    navigator.clipboard.writeText($(this).prop('href'))
  })
  $('button[type="submit"]').html(play)
  $('#customShort').on('change', () => {
    $('#shortRow').toggleClass('d-none')
  })

  $('#addForm').on('submit', (e) => {
    e.preventDefault()
    $.ajax({
      url: 'create.php',
      method: 'POST',
      dataType: 'json',
      data: {
        s: $('#short').val(),
        l: $('#long').val()
      }
    })
      .done((d) => {
        setStatus(d)
        updateTable()
      })
      .fail((d) => {
        setStatus(JSON.parse(d.responseText))
      })
  })

  const listTable = $('#list').DataTable({
    ajax: 'list.php',
    columns: [{ data: 's' }, { data: 'l' }, { data: 'c' }],
    columnDefs: [
      {
        targets: 0,
        render: (data, type) => {
          if (type === 'display') {
            return (
              '<a class="btn btn-secondary" href="https://' +
              publicDomain +
              '/' +
              data +
              '" title="Copy Short URL" class="copy ms-1">' +
              data +
              '</a>'
            )
          }

          return data
        }
      },
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
          '<button class="btn btn-danger" title="Delete">' +
          trashCan +
          '<span class="d-none d-lg-inline-block ms-2">Delete</span></button>'
      }
    ],
    deferRender: true,
    dom: 'Blfrtip',
    lengthMenu: [5, 10, 25, 50, 100],
    pageLength: 5,
    responsive: true
  })

  const updateTable = () => {
    listTable.ajax.reload()
  }

  $('#list tbody').on('click', 'button', function () {
    const data = listTable.row($(this).parents('tr')[0]).data()
    if (window.confirm('Are you sure you want to delete short URL ' + data.s + ' => ' + data.l + '?')) {
      console.log('Delete ' + data.s)
      $.ajax({
        url: 'delete.php',
        method: 'POST',
        dataType: 'json',
        data: { s: data.s }
      })
        .done((d) => {
          setStatus(d)
          updateTable()
        })
        .fail((d) => {
          setStatus(JSON.parse(d.responseText))
        })
    } else {
      console.log("Don't delete")
    }
  })
})
