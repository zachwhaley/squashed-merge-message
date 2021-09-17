function warn(message) {
  console.warn(`squashed-merge-message: ${message}`);
}

function copyPrDescription(event) {
  const prTitleEl = document.getElementById('issue_title');
  if (!prTitleEl) {
    warn('failed to find PR title element');
    return;
  };

  const prNumberMatch = window.location.pathname.match('/pull/(?<pr_number>[0-9]+)$');
  if (!prNumberMatch) {
    warn('failed to find match for PR number in URL');
    return;
  };

  const prBodyEl = document.querySelector('.comment-form-textarea[name="issue[body]"]');
  if (!prBodyEl) {
    warn('failed to find PR body element');
    return;
  };

  // When using auto-merge, GitHub has two text fields with the same ID.
  const titleFields = document.querySelectorAll('[id=merge_title_field]');
  if (!titleFields.length) {
    warn('failed to find merge commit title field');
    return;
  };

  // When using auto-merge, GitHub has two text fields with the same ID.
  const messageFields = document.querySelectorAll('[id=merge_message_field]');
  if (!messageFields.length) {
    warn('failed to find merge commit body field');
    return;
  };

  const commitTitle = `${prTitleEl.value} (#${prNumberMatch.groups['pr_number']})`;

  // Remove leading HTML comments
  let commitBody = prBodyEl.textContent.replace(/^<!--.*?-->\n*/gs, '');

  // Preserve and de-duplicate co-authors
  const coauthors = new Set(messageFields[0].value.match(/Co-authored-by: .*/g));
  if (coauthors.size > 0) {
    commitBody += '\n\n' + [...coauthors].join('\n');
  }

  titleFields.forEach(f => f.value = commitTitle);
  messageFields.forEach(f => f.value = commitBody);
}

function waitForElement(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
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

async function addMergeListener(event) {
  const prMergePanel = await waitForElement('.js-merge-pr:not(.is-rebasing)');
  if (!prMergePanel) {
    warn('failed to find PR merge panel');
    return;
  }

  prMergePanel.addEventListener('details:toggled', copyPrDescription);
}

function main() {
  // Only run on PR pages
  if (!window.location.pathname.match('/pull/[0-9]+$')) return;

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
    observer.observe(comments, { childList: true });
  }
}

main();
