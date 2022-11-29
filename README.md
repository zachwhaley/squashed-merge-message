# <img src="squash.svg" width="32" height="32"> Squashed Merge Message

Use Pull Request description as Squashed and Merged commit messages.

## ‼️ **Support for Squashed Merge Message has ended** ‼️

**GitHub has native support for controlling the default merge message** 🎉

See the GitHub [announcement](https://github.blog/changelog/2022-08-23-new-options-for-controlling-the-default-commit-message-when-merging-a-pull-request/) for details.

And the GitHub Enterprise [3.7 release notes](https://docs.github.com/enterprise-server@3.7/admin/release-notes#repositories)

I recommend all GitHub patrons use GitHub's [default merge message](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests) feature instead of this web extension to both take advantage of native feature support and avoid any compatibility issues between this web extension and GitHub's implementation.

Thank you all for your support and contributions! 💙

## Install

[**Chrome** extension ![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kgabfelbdpeifcemndligpdfddhbbmfm.svg?label=%20)](https://chrome.google.com/webstore/detail/kgabfelbdpeifcemndligpdfddhbbmfm/)

[**Firefox** add-on ![Mozilla Add-on](https://img.shields.io/amo/v/squashed-merge-message.svg?label=%20)](https://addons.mozilla.org/en-US/firefox/addon/squashed-merge-message/)

## Details

When merging a PR with either the "Squash and merge" or "Create a merge commit" buttons:

1. The commit title and message will be copied from the Pull Request.
2. Any leading HTML comments will be removed.
3. Co-authors will be de-duplicated and appended.

The final commit on the base branch will look something like:

    PR Title (#1234)

    PR Body

    Co-authored-by: ... (if multiple authors)

## GitHub Enterprise

Click on the <img src="squash.svg" width="24" height="24"> icon and select
*Enable Squashed Merge Message on this domain* to enable the extension on your
custom GitHub Enterprise domain.

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
