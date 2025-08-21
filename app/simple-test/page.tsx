export default function SimpleTestPage() {
  return (
    <html>
      <body>
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1>✅ Simple Test Page Working!</h1>
          <p>If you can see this, the routing and page loading is working correctly.</p>
          
          <div style={{ 
            background: '#f0f0f0', 
            padding: '15px', 
            margin: '20px 0', 
            borderRadius: '5px' 
          }}>
            <h2>Quick Tests:</h2>
            <ul>
              <li><a href="/api/admin/users" target="_blank">Test Users API</a></li>
              <li><a href="/api/admin/automation" target="_blank">Test Automation API</a></li>
              <li><a href="/admin" target="_blank">Try Admin Page</a></li>
            </ul>
          </div>

          <div style={{ 
            background: '#e8f5e8', 
            padding: '15px', 
            margin: '20px 0', 
            borderRadius: '5px' 
          }}>
            <h3>Terminal Commands to Try:</h3>
            <code style={{ display: 'block', background: '#fff', padding: '10px', margin: '5px 0' }}>
              npm run grant-admin asjames18@gmail.com
            </code>
            <code style={{ display: 'block', background: '#fff', padding: '10px', margin: '5px 0' }}>
              npm run grant-admin --list
            </code>
            <code style={{ display: 'block', background: '#fff', padding: '10px', margin: '5px 0' }}>
              npm run refresh:data
            </code>
          </div>
        </div>
      </body>
    </html>
  );
} 