const fs = require('fs')
const { Toolkit } = require('actions-toolkit')

const options = {
}

const envKeys = [
  'GITHUB_WORKFLOW',
  'GITHUB_ACTION',
  'GITHUB_ACTOR',
  'GITHUB_REPOSITORY',
  'GITHUB_EVENT_NAME',
  'GITHUB_EVENT_PATH',
  'GITHUB_WORKSPACE',
  'GITHUB_SHA',
  'GITHUB_REF',
  'GITHUB_TOKEN',
]

// Run your GitHub Action!
Toolkit.run(async tools => {
  const payload = require(process.env.GITHUB_EVENT_PATH, 'utf8')
  const eventRef = payload.ref
  const repo = {
    owner: payload.repository.owner.login,
    name: payload.repository.name
  }

  if (!eventRef.startsWith('refs/heads/')) {
    tools.exit.neutral(`Action not triggered by a branch ref (${eventRef})`)
  }

  const deleted = payload.deleted

  if (deleted) {
    tools.exit.neutral('Action triggered by a delete event')
  }

  const eventBranch = eventRef.replace('refs/heads/', '')

  const branches = tools.arguments._

  for (const branch of branches) {
    if (branch === eventBranch) {
      try {
        const tipOfBranchJson = await tools.github.git.getRef({
          owner: repo.owner,
          repo: repo.name,
          ref: `heads/${eventBranch}`
        })
        const tipOfBranchSha = tipOfBranchJson.object.sha
        if (tipOfBranchSha !== process.env.GITHUB_SHA) {
          tools.exit.neutral(`The commit that triggered this action is no longer at the tip of ${eventBranch}`)
        }
        tools.exit.success(`Branch '${eventBranch}' matches`)
      } catch (err) {
        tools.log(`Error getting tip of ref info for refs/${eventBranch}: ${err}`)
      }
    }
  }

  tools.exit.neutral(`Branch '${eventBranch}' did not match`)
}, options)
