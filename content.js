const copyPrDescription = function() {
  const prTitleEl = document.getElementById("issue_title");
  if (!prTitleEl) return;

  const prNumberEl = document.querySelector(".gh-header-title .gh-header-number");
  if (!prNumberEl) return;

  const prBodyEl = document.querySelector('.comment-form-textarea[name="pull_request[body]"]');
  if (!prBodyEl) return;

  const titleField = document.getElementById('merge_title_field');
  if (!titleField) return;

  const messageField = document.getElementById('merge_message_field');
  if (!messageField) return;

  const commitTitle = `${prTitleEl.value} (${prNumberEl.textContent})`;
  const commitBody = prBodyEl.textContent;

  titleField.value = commitTitle;
  messageField.value = commitBody;
}

const addMergeListeners = function() {
  const squashButton = document.querySelector('.merge-message .btn-group-squash');
  const mergeButton = document.querySelector('.merge-message .btn-group-merge');

  if (squashButton) {
    squashButton.addEventListener('click', copyPrDescription);
  }
  if (mergeButton) {
    mergeButton.addEventListener('click', copyPrDescription);
  }

}

document.addEventListener('pjax:end', addMergeListeners);
addMergeListeners();
