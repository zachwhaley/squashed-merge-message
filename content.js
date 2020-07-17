function copyPrDescription(event) {
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

function addMergeListener(event) {
  if (!window.location.pathname.match("/pull/[0-9]+$")) return;

  const prMergePanel = document.querySelector('.js-merge-pr:not(.is-rebasing)');
  if (!prMergePanel) return;

  prMergePanel.addEventListener('details:toggled', copyPrDescription);
}

// Run on extension load.
addMergeListener();

// Run on AJAX.
document.addEventListener('pjax:end', addMergeListener);

// Run when new comments are added, removed, edited, etc.
const comments = document.querySelector('.js-discussion');
if (comments) {
  const observer = new MutationObserver(addMergeListener);
  observer.observe(comments, {childList: true});
}
