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
  tools.log('Printing environment variables:')
  for (const key of envKeys) {
    tools.log(`${key}: ${process.env[key]}`)
  }
  tools.log('\nPrinting event payload:')
  const payload = require(process.env.GITHUB_EVENT_PATH, 'utf8')
  tools.log(JSON.stringify(payload, null, '  '))

  tools.exit.success('We did it!')
}, options)
