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

  if (!eventRef.startsWith('refs/heads/')) {
    tools.exit.neutral(`Action not triggered by a branch ref (${eventRef})`)
  }

  const deleted = payload.deleted

  if (deleted) {
    tools.exit.neutral('Action triggered by a delete event')
  }

  const eventBranch = eventRef.replace('refs/heads/', '')

  const branches = tools.arguments._
  const useRegex = tools.arguments.regex
  const regexFlags = tools.arguments.flags || ''

  for (const branch of branches) {
    if (useRegex) {
      const regex = new RegExp(branch, regexFlags)
      if (regex.test(eventBranch)) {
        tools.exit.success(`Event branch ${eventBranch} matches pattern ${branch}`)
      }
    } else {
      if (branch === eventBranch) {
        tools.exit.success(`Event branch ${eventBranch} matches check ${branch}`)
      }
    }
  }

  tools.exit.neutral(`Event branch ${eventBranch} matched no given patterns`)
}, options)
