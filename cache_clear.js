const CDP = require('chrome-remote-interface');

async function clearCache() {
  const client = await CDP();

  const { Network, Page } = client;

  await Promise.all([Network.enable(), Page.enable()]);

  await Network.clearBrowserCache();

  client.close();
}

clearCache();

