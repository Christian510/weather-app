
$('#editModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var recipient = button.data('edit') // Extract info from data-* attributes
  console.log("recipient: ", recipient);
  var id = button.data('id');
  console.log("id: ", id);
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this);
  // modal.find('.modal-title').text('New message to ' + recipient)
  modal.find('#edit-id-input').val(id);
  modal.find('.modal-title input').val(recipient);
  modal.find('.modal-title ').text("Edit " + recipient );
});

  $('#deleteModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('delete') // Extract info from data-* attributes
    var id = button.data('id')
    // console.log(id)

    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    // modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-title').text("Delete " + recipient + "?");
    modal.find('#del-id-input').val(id)
    modal.find('#del-name-input').val(recipient);
  });