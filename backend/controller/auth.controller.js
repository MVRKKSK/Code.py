import supabase from '../supabase.js';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('Registering user:', { email, name }); // Debug log

    // ✅ validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Name, email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    // 🔐 create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      return res.status(400).json({
        success: false,
        error: error?.message || 'Signup failed',
      });
    }

    // 🧠 insert profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          email: data.user.email,
          name: name, // ✅ now using name
        },
      ]);

    if (profileError) {
      return res.status(400).json({
        success: false,
        error: 'User created but profile failed',
      });
    }

    // ✅ return token (auto-login)
    return res.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name,
      },
      token: data.session?.access_token || null,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password required',
      });
    }

    // 🔐 authenticate
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // 🔍 fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return res.status(400).json({
        success: false,
        error: 'Profile not found',
      });
    }

    // ✅ final response
    return res.json({
      success: true,
      user: profile,
      token: data.session.access_token,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};