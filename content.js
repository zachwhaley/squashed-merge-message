function uniqueLines(arr) {
  return arr.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

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

  const coauthors = uniqueLines(messageField.value.match(/(Co-authored-by: .*)/g));

  const commitTitle = `${prTitleEl.value} (${prNumberEl.textContent})`;
  const commitBody = prBodyEl.textContent + '\n\n' + coauthors.join('\n');

  titleField.value = commitTitle;
  messageField.value = commitBody;
}

function addMergeListener(event) {
  const prMergePanel = document.querySelector('.js-merge-pr:not(.is-rebasing)');
  if (!prMergePanel) return;

  prMergePanel.addEventListener('details:toggled', copyPrDescription);
}

function main() {
  // Only run on PR pages
  if (!window.location.pathname.match("/pull/[0-9]+$")) return;

  // Add merge listeners on load
  addMergeListener();

  // And on AJAX events
  // (Happens when you switch from PR diff or commits back to merge)
  document.addEventListener('pjax:end', addMergeListener);

  // And when new comments are added, removed, edited, etc.
  // (Something about how GitHub refreshes the comments discards all events ¯\_(ツ)_/¯)
  const comments = document.querySelector('.js-discussion');
  if (comments) {
    const observer = new MutationObserver(addMergeListener);
    observer.observe(comments, {childList: true});
  }
}

main();
