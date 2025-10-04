async function getAccessToken() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
  }

  const connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function createGitHubRepo() {
  try {
    const accessToken = await getAccessToken();

    // Create the repository using GitHub REST API directly
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'orderfi-restaurant-platform',
        description: 'OrderFi AI - Blockchain-first decentralized restaurant platform with conversational AI and Web3 integration',
        private: false,
        auto_init: false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      if (response.status === 422) {
        console.log('✅ Repository already exists at: https://github.com/samelliott25/orderfi-restaurant-platform');
        return;
      }
      throw new Error(error.message || 'Failed to create repository');
    }

    const data = await response.json();
    console.log('\n✅ SUCCESS! Repository created!');
    console.log('📦 Repository URL:', data.html_url);
    console.log('🔗 Git URL:', data.clone_url);
    console.log('\n📋 Run these commands to push your code:');
    console.log('git remote add origin', data.clone_url);
    console.log('git branch -M main');
    console.log('git add .');
    console.log('git commit -m "Initial commit - OrderFi restaurant platform"');
    console.log('git push -u origin main');
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

createGitHubRepo();
