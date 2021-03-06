# tip-of-branch GitHub Action

This action acts as a filter for `push`-based actions to ensure that the triggering event meets the following qualifications:

* The event was not generated by a branch deletion
* The branch the triggering commit was pushed to matches one of the branches listed in the arguments
* The triggering commit is the head of that branch at the time the action runs

This helps prevent subtle race conditions when multiple commits or PRs are committed or merged to master and multiple workflows that automatically deploy changes run simultaneously, since only the most recently created commit will pass the check.

## Usage

In your workflow:

```workflow
action "your-action" {
  uses = "BinaryMuse/tip-of-branch@master"
  args = "master"
  secrets = [ "GITHUB_TOKEN" ]
}
```

`args` can be a single branch, or can be multiple branches if you want to match any of them:

```workflow
action "your-action" {
  uses = "BinaryMuse/tip-of-branch@master"
  args = [ "master", "some-other-branch" ]
  secrets = [ "GITHUB_TOKEN" ]
}
```

You must include the `GITHUB_TOKEN` secret in order for the action to reach the API and ensure that the commit is still at the head of the branch.
