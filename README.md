# tip-of-branch GitHub Action

This action acts as a filter for `push`-based actions that ensures that the commit that triggered the action meets the following qualifications:

* The branch the commit was pushed to matches one of the branches listed in the arguments
* The commit that was pushed is the head of that branch at the time the action runs

This helps prevent situations where multiple PRs are merged to master and workflows that trigger deploys or similar tasks are triggered for each one.

## Usage

In your workflow:

```workflow
action "your-action" {
  uses = "BinaryMuse/tip-of-branch@1.0.0"
  args = "master"
  secrets = [ "GITHUB_TOKEN" ]
}
```

`args` can be a single branch, or can be multiple branches if you want to match any of them:

```workflow
action "your-action" {
  uses = "BinaryMuse/tip-of-branch@1.0.0"
  args = [ "master", "some-other-branch" ]
  secrets = [ "GITHUB_TOKEN" ]
}
```

You must include the `GITHUB_TOKEN` secret in order for the action to ensure that the commit is still at the head of the branch
