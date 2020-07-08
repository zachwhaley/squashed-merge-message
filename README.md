# <img src="https://user-images.githubusercontent.com/125105/85856240-fe0a0d00-b7fa-11ea-8dbc-a642dcbef613.png" width="25" height="25"> Squashed Merge Message

Use the Pull Request Title and Body as the [Squash] Merge commit message.

Fixes [isaacs/github#1025](https://github.com/isaacs/github/issues/1025)

## Install

[Chrome](https://chrome.google.com/webstore/detail/kgabfelbdpeifcemndligpdfddhbbmfm/)

[FireFox](https://addons.mozilla.org/en-US/firefox/addon/squashed-merge-message/)

## GitHub Enterprise
Click on the <img
src="https://user-images.githubusercontent.com/125105/85856240-fe0a0d00-b7fa-11ea-8dbc-a642dcbef613.png"
width="25" height="25"> icon and select *Enable Squashed Merge Message on this
domain* to enable the extension on your custom GitHub Enterprise domain.

## Details

When merging a PR with either the "Squash and merge" or "Create a merge commit"
buttons, the commit title and message will be copied from the Pull Request title
and body, respectively. The final commit on the base branch will look like:

```
PR Title (#1234)

PR Body
```

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
Icon made by [monkik](https://www.flaticon.com/authors/monkik) from [www.flaticon.com](https://www.flaticon.com)
