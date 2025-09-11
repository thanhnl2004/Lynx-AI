# Environment Setup

## Required Environment Variables

### Server (.env)
Create a `.env` file in the `server/` directory with the following variables:

```bash
# Composio API Configuration
COMPOSIO_API_KEY=your_composio_api_key_here

# Gmail Auth Config ID from Composio Dashboard
COMPOSIO_GMAIL_AUTH_CONFIG_ID=your_gmail_auth_config_id_here

# Server Configuration
PORT=4000
VERCEL_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=your_database_url_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### Client (.env.local)
Create a `.env.local` file in the `client/` directory with the following variables:

```bash
# Backend Server URL
SERVER_URL=http://localhost:4000

# Composio Auth Config IDs (must start with NEXT_PUBLIC_)
NEXT_PUBLIC_GMAIL_AUTH_CONFIG_ID=your_gmail_auth_config_id_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Setup Instructions

1. **Get Composio API Key**: 
   - Visit [Composio Dashboard](https://app.composio.dev)
   - Create an account and get your API key

2. **Create Gmail Auth Config**:
   - In Composio Dashboard, go to "Auth Configs"
   - Create a new auth config for Gmail
   - Copy the auth config ID

3. **Setup Database**:
   - Configure your database URL (PostgreSQL recommended)
   - Run database migrations if needed

4. **Setup Supabase** (if using for authentication):
   - Create a Supabase project
   - Get your project URL and anon key
   - Configure authentication providers

5. **Start the applications**:
   ```bash
   # Start server
   cd server && npm run dev
   
   # Start client (in another terminal)
   cd client && npm run dev
   ```

## Testing the Gmail Integration

1. Ensure both server and client are running
2. Navigate to the chat interface
3. Click "Connect Gmail" in the chat header
4. Complete the OAuth flow
5. Send a message like "Send an email to test@example.com with subject 'Test' and body 'Hello world'"
6. The AI should use the Gmail tool to send the email
