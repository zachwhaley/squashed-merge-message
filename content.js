function warn(message) {
  console.warn(`squashed-merge-message: ${message}`);
}

function debug(message) {
  console.debug(`squashed-merge-message: ${message}`);
}

async function copyPrDescription() {
  debug('copy PR description');

  const match = window.location.pathname.match('^/(?<repo>[^/]+/[^/]+)/pull/(?<pr_number>[0-9]+)$');
  if (!match) {
    warn('failed to find match for repo and PR number in URL');
    return;
  }
  const repo = match.groups['repo'];
  const prNumber = match.groups['pr_number'];

  let prMetadata = null;

  // For public repos, prefer the API.
  if (window.location.host === 'github.com') {
    prMetadata = await getPrMetadataFromApi(repo, prNumber);
  }

  // If that fails, try manipulating the document.
  if (!prMetadata) {
    prMetadata = await getPrMetadataFromDocument();
  }

  // If that fails... we fail!
  if (!prMetadata) {
    warn('failed to pull PR metadata from document or API');
    return;
  }

  // When using auto-merge, GitHub has two text fields with the same ID.
  const titleFields = document.querySelectorAll('[id=merge_title_field]');
  if (!titleFields.length) {
    warn('failed to find merge commit title field');
    return;
  }

  // When using auto-merge, GitHub has two text fields with the same ID.
  const messageFields = document.querySelectorAll('[id=merge_message_field]');
  if (!messageFields.length) {
    warn('failed to find merge commit body field');
    return;
  }

  const commitTitle = `${prMetadata.title} (#${prNumber})`;

  // Remove leading HTML comments
  let commitBody = prMetadata.body.replace(/^<!--.*?-->\n*/gs, '').trim();

  // Preserve and de-duplicate co-authors
  const coauthors = new Set(messageFields[0].value.match(/Co-authored-by: .*/g));
  if (coauthors.size > 0) {
    commitBody += '\n\n' + [...coauthors].join('\n');
  }

  titleFields.forEach(f => f.value = commitTitle);
  messageFields.forEach(f => f.value = commitBody);
}

async function getPrMetadataFromDocument() {
  await makePrDescriptionAppear();

  const prTitleEl = document.getElementById('issue_title');
  if (!prTitleEl) {
    warn('failed to find PR title element');
    return null;
  }

  let prBodyEl = document.querySelector('.comment-form-textarea[name="issue[body]"]');
  if (!prBodyEl) {
    prBodyEl = document.querySelector('.comment-form-textarea[name="pull_request[body]"]');
    if (!prBodyEl) {
      warn('failed to find PR body element');
      return null;
    }
  }

  return {
    title: prTitleEl.value,
    body: prBodyEl.textContent,
  };
}

async function getPrMetadataFromApi(repo, prNumber) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/pulls/${prNumber}`);
    if (!response.ok) {
      return null;
    }

    const prMetadata = await response.json();
    return {
      // These could be null in some cases, so replace nulls with empty strings.
      title: prMetadata.title || '',
      body: prMetadata.body || '',
    };
  } catch (error) {
    warn('failed to fetch PR metadata from API: ' + error);
    return null;
  }
}

async function makePrDescriptionAppear() {
  const detailsButton = document.querySelector('.timeline-comment-actions details:last-child summary[role="button"]');
  detailsButton.click();
  const editButton = await waitForElement('details-menu > button.dropdown-item.btn-link.js-comment-edit-button');
  editButton.click();
  const cancelButton = await waitForElement('button.js-comment-cancel-button.btn-danger.btn');
  cancelButton.click();
  const commitText = document.getElementById('merge_message_field');
  commitText.focus();
}

function waitForElement(selector) {
  debug(`wait for element ${selector}`);
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      debug(`found element ${selector}`);
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        debug(`found element ${selector}`);
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

async function addMergeListener() {
  debug('add merge listener');
  const prMergePanel = await waitForElement('.js-merge-pr:not(.is-rebasing)');
  if (!prMergePanel) {
    warn('failed to find PR merge panel');
    return;
  }

  prMergePanel.addEventListener('details:toggled', copyPrDescription);
}

async function addPjaxEndListener() {
  debug('add pjax:end listener');
  document.addEventListener('pjax:end', addMergeListener);
}

async function addCommentsListener() {
  debug('add comments listener');
  const comments = await waitForElement('.js-discussion');
  if (!comments) {
    warn('failed to find comments');
    return;
  }
  const observer = new MutationObserver(addMergeListener);
  observer.observe(comments, { childList: true });
}

function main() {
  debug('main');
  // Only run on PR pages
  if (!window.location.pathname.match('/pull/[0-9]+$')) return;

  // Add merge listeners on load
  addMergeListener();

  // And on AJAX events
  // (Happens when you switch from PR diff or commits back to merge)
  addPjaxEndListener();

  // And when new comments are added, removed, edited, etc.
  // (Something about how GitHub refreshes the comments discards all events ¯\_(ツ)_/¯)
  addCommentsListener();
}

main();
