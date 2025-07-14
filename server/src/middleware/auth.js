import { supabaseAdmin } from '../lib/supabase-admin.js';

export async function requireAuth(req, res, next) {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) {
    return res.status(401).json({ 
      error: 'No token',
      message: 'Authorization header with Bearer token is required' 
    });
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(auth);
  if (error) {
    return res.status(401).json({ 
      error: 'Invalid token',
      message: error.message 
    });
  }
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Invalid token',
      message: 'Token is valid but user not found' 
    });
  }

  req.user = user;
  next();
}

