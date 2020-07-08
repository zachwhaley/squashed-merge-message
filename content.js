var copyPrDescription = function() {
  var prTitleEl = document.getElementById("issue_title");
  if (!prTitleEl) return;

  var prNumberEl = document.querySelector(".gh-header-title .gh-header-number");
  if (!prNumberEl) return;

  var prBodyEl = document.querySelector('.comment-form-textarea[name="pull_request[body]"]');
  if (!prBodyEl) return;

  var titleField = document.getElementById('merge_title_field');
  if (!titleField) return;

  var messageField = document.getElementById('merge_message_field');
  if (!messageField) return;

  var commitTitle = `${prTitleEl.value} (${prNumberEl.textContent})`;
  var commitBody = prBodyEl.textContent;

  titleField.value = commitTitle;
  messageField.value = commitBody;
}

var addMergeListeners = function() {
  var squashButton = document.querySelector('.merge-message .btn-group-squash');
  var mergeButton = document.querySelector('.merge-message .btn-group-merge');

  if (squashButton) {
    squashButton.addEventListener('click', copyPrDescription);
  }
  if (mergeButton) {
    mergeButton.addEventListener('click', copyPrDescription);
  }

}

document.addEventListener('pjax:end', addMergeListeners);
addMergeListeners();
