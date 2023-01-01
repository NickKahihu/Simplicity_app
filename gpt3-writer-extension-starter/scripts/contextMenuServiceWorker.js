const getKey = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['openai-key'], (result) => {
        if (result['openai-key']) {
          const decodedKey = atob(result['openai-key']);
          resolve(decodedKey);
        }
      });
    });
  };





const generate = async (prompt) => {
    // Get your API key from storage
    const key = await getKey();
    const url = 'https://api.openai.com/v1/completions';

}

// New function here
const generateCompletionAction = async (info) => {
    try {
      const { selectionText } = info;
      const basePromptPrefix = `
        Write me a detailed notes in point form with the title below.
              
        Title:
        `;
  
      const baseCompletion = await generate(
        `${basePromptPrefix}${selectionText}`
      );
  
      // Add your second prompt here
      const secondPrompt = `
        Take the detailed notes in point form and title of the  post below and Write me a 150 word count summary that summarizes the title  below and helps the people understand the contents of the title with accurate precise information
        
        Title: ${selectionText}
        
        Table of Contents: ${baseCompletion.text}
        
        Summary:
        `;
  
      // Call your second prompt
      const secondPromptCompletion = await generate(secondPrompt);
    } catch (error) {
      console.log(error);
      // Add this here as well to see if we run into any errors!
      sendMessage(error.toString());
    }
  };



// Add this in scripts/contextMenuServiceWorker.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'context-run',
      title: 'Simplify highlighted text',
      contexts: ['selection'],
    });
  });
  
  // Add listener
  chrome.contextMenus.onClicked.addListener(generateCompletionAction);


  const sendMessage = (content) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0].id;
  
      chrome.tabs.sendMessage(
        activeTab,
        { message: 'inject', content },
        (response) => {
          if (response.status === 'failed') {
            console.log('injection failed.');
          }
        }
      );
    });
  };

