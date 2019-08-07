var squashMergeMessage = function() {
  var squashButton = document.querySelector('.merge-message .btn-group-squash');
  
  if (!squashButton) return;

  squashButton.addEventListener('click', function() {
    var description = document.querySelector('.comment-form-textarea[name="pull_request[body]"]');
    if (!description) return;

    var messageField = document.getElementById('merge_message_field');
    if (!messageField) return;

    messageField.value = description.textContent;
  });
}

document.addEventListener('pjax:end', squashMergeMessage);
squashMergeMessage();
