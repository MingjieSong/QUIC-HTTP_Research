const CDP = require('chrome-remote-interface');

async function clearNetworkCache() {
  const client = await CDP();

  const { Network } = client;

  // Enable the Network domain
  await Network.enable();

  // Clear cache
  await Network.clearBrowserCache();

  // Disable the Network domain
  await Network.disable();

  // Close the connection
  await client.close();
}

// Call the function to clear the network cache
clearNetworkCache()
  .then(() => console.log('Network cache cleared.'))
  .catch(err => console.error('Error:', err));

