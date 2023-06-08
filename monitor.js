const fs = require('fs');
const CDP = require('chrome-remote-interface');

CDP(async (client) => {
  // Enable required domains
  const { Network, Page } = client;
  await Promise.all([Network.enable(), Page.enable()]);

  const networkData = [];
  let firstRequestTimestamp = 0 ;
  // Set up event listeners
  Network.requestWillBeSent((params) => {
    const { requestId, request, timestamp } = params;
    const { url } = request;
   
    if (firstRequestTimestamp === 0) {
        firstRequestTimestamp = timestamp;
     }
    networkData.push({
      requestId,
      url,
      timestamp,
    });
  });
  
  Network.responseReceived((params) => {
    const { requestId, response } = params;
    const { url, timing, protocol, encodedDataLength } = response;
    console.log(`Protocol used: ${response.protocol}`);
    console.log(`response body size: ${response.encodedDataLength}`);
    const networkItem = networkData.find((item) => item.requestId === requestId);
 
    if (networkItem) {    
      networkItem.protocol = protocol ; 
      networkItem.dataLength = encodedDataLength ;  
      networkItem.responseUrl = url;
      networkItem.timing  = timing;
     
     // if(timing.receiveHeadersEnd && timing.sendStart){
//	      networkItem.RTT = timing.receiveHeadersEnd -timing.sendStart ; 
  //    }
     
    }                     
  });
   
     networkData.forEach(item => {
	     if(item.timing.receiveHeadersEnd && item.timing.sendStart){
		     const rtt = item.timing.receiveHeadersEnd -  item.timing.sendStart;
		     console.log(`RTT: ${rtt} ms`);
	     }
     }); 
    let lastRequestTimestamp = 0;
    let totalDataReceived = 0;
    Network.loadingFinished(params => {
      const { timestamp, encodedDataLength } = params;

      // Update the timestamp of the last completed request
      lastRequestTimestamp = timestamp;
      totalDataReceived += encodedDataLength;
    });
                          
  // Navigate to the desi red website
  await Page.navigate({ url: 'https://10.10.1.2:4433/' }); //https://10.10.1.2:4433/
  await Page.loadEventFired();

    const totalTimeElapsed = lastRequestTimestamp - firstRequestTimestamp;
    const throughput  = ( totalDataReceived/totalTimeElapsed)*1000 ; 
    console.log('Total time elapsed (ms):', totalTimeElapsed);
    console.log('Total data received:', totalDataReceived);   
    console.log('Network throughput (bytes/s):', throughput);
    networkData.push({
       totalTimeElapsed , 
       totalDataReceived,
	    throughput, 
    });
  // Write network data to a file
  const fileName = 'network_inspect_quic_nyu.json';
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
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
                          
