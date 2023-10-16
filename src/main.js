const core = require('@actions/core')
const { Client } = require('@notionhq/client')

async function run() {
  await updateNotionDatabase()
}

async function updateNotionDatabase() {
  try {
    const notion = new Client({
      auth: core.getInput('notion-secret', { required: true })
    })
    const releaseNotes = process.env.GITHUB_EVENT.release.body
    const version = process.env.GITHUB_EVENT.release.tag_name

    // Update Notion database
    const response = await notion.databases.update({
      database_id: process.env.NOTION_DATABASE_ID,
      properties: {
        'Release Notes': {
          rich_text: [{ text: { content: releaseNotes } }]
        },
        Version: {
          rich_text: [{ text: { content: version } }]
        }
      }
    })

    core.debug(`Notion database updated successfully:${response}`)
  } catch (error) {
    core.error('Error updating Notion database:')
    core.error(error)
  }
}

module.exports = {
  run
}
