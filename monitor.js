const fs = require('fs');
const CDP = require('chrome-remote-interface');

CDP(async (client) => {
  // Enable required domains
  const { Network, Page } = client;
  await Promise.all([Network.enable(), Page.enable()]);

  const networkData = [];

  // Set up event listeners
  Network.requestWillBeSent((params) => {
    const { requestId, request, timestamp } = params;
    const { url } = request;

    networkData.push({
      requestId,
      url,
      timestamp,
    });
  });

  Network.responseReceived((params) => {
    const { requestId, response } = params;
    const { url, timing, protocol } = response;  
    console.log(`Protocol used: ${response.protocol}`);
    const networkItem = networkData.find((item) => item.requestId === requestId);
    if (networkItem) {    
       
      networkItem.responseUrl = url;
      networkItem.timing  = timing;
      networkItem.protocol = protocol ; 
    }                     
  });                     
                          
  // Navigate to the desi red website
  await Page.navigate({ url: 'https://10.10.1.2:8000/' }); //https://10.10.1.2:4433/
  await Page.loadEventFired();
                          
  // Write network data to a file
  const fileName = 'network_inspect_disable_quic_tc5g5g70ms.json';
  fs.writeFile(fileName,  JSON.stringify(networkData, null, 2), (err) => {
    if (err) {            
      console.error('Error writing network data:', err);
    } else {              
      console.log(`Network data saved to ${fileName}`);
    }                     
  });                     
                          
  // Close the connection 
  await client.close();   
}).on('error', (err) => { 
  console.error('Error:',  err);
});                       
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
