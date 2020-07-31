# <img src="squash.svg" width="32" height="32"> Squashed Merge Message

Use Pull Request description as Squashed and Merged commit messages.

Fixes [isaacs/github#1025](https://github.com/isaacs/github/issues/1025)

## Install

[**Chrome** extension ![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kgabfelbdpeifcemndligpdfddhbbmfm.svg?label=%20)](https://chrome.google.com/webstore/detail/kgabfelbdpeifcemndligpdfddhbbmfm/)

[**Firefox** add-on ![Mozilla Add-on](https://img.shields.io/amo/v/squashed-merge-message.svg?label=%20)](https://addons.mozilla.org/en-US/firefox/addon/squashed-merge-message/)

## GitHub Enterprise

Click on the <img src="squash.svg" width="24" height="24"> icon and select
*Enable Squashed Merge Message on this domain* to enable the extension on your
custom GitHub Enterprise domain.

## Details

When merging a PR with either the "Squash and merge" or "Create a merge commit"
buttons, the commit title and message will be copied from the Pull Request title
and body, respectively, and any leading HTML comments will be removed.

The final commit on the base branch will look like:

    PR Title (#1234)

    PR Body

    Co-authored-by: ... (if multiple authors)

## Refined GitHub Compatibility

In order for this extension to work with Refined GitHub you need to disable the
`clear-pr-merge-commit-message` feature.

To disable in Chrome

1. Go to [chrome://extensions](chrome://extensions)
2. Open Details for Refined GitHub
3. Open Extension options
4. Search for and disable `clear-pr-merge-commit-message`

To disable in Firefox

1. Go to [about:addons](about:addons)
2. Open Refined Github
3. Open Preferences
4. Search for and disable `clear-pr-merge-commit-message`

## Attributions
Icons made by <a href="https://www.flaticon.com/authors/monkik" title="monkik">monkik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
