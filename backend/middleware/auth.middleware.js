import { createClient } from '@supabase/supabase-js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = data.user;
    next();

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};