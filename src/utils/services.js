import axios from 'axios'

/**
 * CMS API
 * Get and update content for the dashboard
 */
export var cms

export async function configure(config) {
  const { server, secure } = config
  const httpProtocol = secure ? 'https' : 'http'

  const cmsServer = config.cms.server || `cms.${server}`
  const cmsUrl = `${httpProtocol}://${cmsServer}`
  if (config.cms.username && config.cms.password) {
    const { data: { jwt } } = await axios.post(`${cmsUrl}/auth/local`, {
      identifier: config.cms.username,
      password: config.cms.password
    })
    cms = axios.create({
      baseURL: cmsUrl,
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
  }
  else {
    cms = axios.create({ baseURL: cmsUrl })
  }
}
