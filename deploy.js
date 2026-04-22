const TOKEN = 'rnd_s1BJ736BHU4u3ExYFRLWYlcxMqSr';
const REPO = 'https://github.com/Abhisheks786/sms';
const MONGO_URI = 'mongodb+srv://reachabhisingh1235:1234test1234@cluster0.s9qbd7u.mongodb.net/sms_db?appName=Cluster0';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

async function deploy() {
  console.log("Fetching Render Account Details...");
  const ownerRes = await fetch('https://api.render.com/v1/owners', { headers });
  const owners = await ownerRes.json();
  
  if (!owners || owners.length === 0) {
      console.error("Could not find Render account. Is the token correct?");
      return;
  }
  const ownerId = owners[0].owner.id;

  console.log(`\nCreating Backend Web Service on Render...`);
  const backendPayload = {
    ownerId,
    type: 'web_service',
    name: 'sms-backend-api',
    repo: REPO,
    autoDeploy: 'yes',
    branch: 'main',
    rootDir: 'backend',
    serviceDetails: {
      env: 'node',
      plan: 'free',
      region: 'oregon',
      buildCommand: 'npm install',
      startCommand: 'node server.js',
      envVars: [
        { key: 'PORT', value: '10000' },
        { key: 'MONGO_URI', value: MONGO_URI },
        { key: 'JWT_SECRET', value: 'super_secret_jwt_key_123' },
        { key: 'FRONTEND_URL', value: 'https://placeholder.com' } // Will update in step 3
      ]
    }
  };

  const backendRes = await fetch('https://api.render.com/v1/services', {
    method: 'POST',
    headers,
    body: JSON.stringify(backendPayload)
  });
  
  const backendData = await backendRes.json();
  if (backendData.message) {
      console.error("Error creating backend:", backendData.message);
      return;
  }
  const backendId = backendData.service.id;
  const backendUrl = backendData.service.serviceDetails.url;
  console.log(`✅ Backend created successfully at: ${backendUrl}`);

  console.log(`\nCreating Frontend Static Site on Render...`);
  const frontendPayload = {
    ownerId,
    type: 'static_site',
    name: 'sms-frontend-ui',
    repo: REPO,
    autoDeploy: 'yes',
    branch: 'main',
    rootDir: 'frontend',
    serviceDetails: {
      buildCommand: 'npm install && npm run build',
      publishPath: 'dist',
      envVars: [
        { key: 'VITE_API_BASE_URL', value: backendUrl }
      ]
    }
  };

  const frontendRes = await fetch('https://api.render.com/v1/services', {
    method: 'POST',
    headers,
    body: JSON.stringify(frontendPayload)
  });
  
  const frontendData = await frontendRes.json();
  if (frontendData.message) {
      console.error("Error creating frontend:", frontendData.message);
      return;
  }
  const frontendUrl = frontendData.service.serviceDetails.url;
  console.log(`✅ Frontend created successfully at: ${frontendUrl}`);

  console.log(`\nLinking Backend CORS to Frontend URL...`);
  await fetch(`https://api.render.com/v1/services/${backendId}/env-vars`, {
    method: 'PUT',
    headers,
    body: JSON.stringify([
        { key: 'PORT', value: '10000' },
        { key: 'MONGO_URI', value: MONGO_URI },
        { key: 'JWT_SECRET', value: 'super_secret_jwt_key_123' },
        { key: 'FRONTEND_URL', value: frontendUrl }
    ])
  });
  console.log(`✅ Backend environment variables updated!`);

  console.log("\n🚀 DEPLOYMENT INITIATED!");
  console.log("Both services are now building on your Render account.");
  console.log(`Frontend Live Link: ${frontendUrl}`);
  console.log(`Backend Live Link:  ${backendUrl}`);
}

deploy().catch(console.error);
