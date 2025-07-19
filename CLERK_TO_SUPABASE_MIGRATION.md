# Clerk to Supabase Authentication Migration Guide

This guide will help you complete the migration from Clerk to Supabase authentication for your VaultX AI Tools project.

## ✅ What's Been Completed

1. **Replaced Clerk Sign-In Page** - Custom Supabase-based sign-in page with social login support
2. **Replaced Clerk Sign-Up Page** - Custom Supabase-based sign-up page with validation
3. **Updated Middleware** - Replaced Clerk middleware with Supabase-based route protection
4. **Removed Clerk Dependencies** - Removed `@clerk/nextjs` from package.json
5. **Created Database Schema** - User roles table for admin management
6. **Created Admin Setup Script** - Script to promote users to admin role

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Database

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run the SQL script from `supabase-user-roles-setup.sql`

### 3. Configure Environment Variables

Make sure your `.env.local` file has these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. Set Up OAuth Providers (Optional)

To enable social login (Google, GitHub):

1. Go to **Authentication > Providers** in your Supabase dashboard
2. Configure Google OAuth:
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

3. Configure GitHub OAuth:
   - Enable GitHub provider
   - Add your GitHub OAuth credentials
   - Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 5. Create Admin User

1. First, sign up a user through your application
2. Run the admin setup script:

```bash
node scripts/setup-admin.js your-admin-email@example.com
```

### 6. Test the Migration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the following flows:
   - Sign up with email/password
   - Sign in with email/password
   - Social login (if configured)
   - Password reset
   - Admin access
   - Protected routes

## 🔄 Migration Checklist

- [ ] Run the SQL script in Supabase
- [ ] Configure environment variables
- [ ] Set up OAuth providers (optional)
- [ ] Create admin user
- [ ] Test sign-up flow
- [ ] Test sign-in flow
- [ ] Test password reset
- [ ] Test admin access
- [ ] Test protected routes
- [ ] Test social login (if enabled)

## 🚀 Features Available

### Authentication Features
- ✅ Email/password authentication
- ✅ Social login (Google, GitHub)
- ✅ Password reset
- ✅ Email confirmation
- ✅ Session management
- ✅ Route protection

### Admin Features
- ✅ Admin role management
- ✅ Protected admin routes
- ✅ Admin dashboard access
- ✅ User role checking

### User Management
- ✅ User registration
- ✅ User login/logout
- ✅ User profile management
- ✅ Role-based access control

## 🔧 Troubleshooting

### Common Issues

1. **"User not found" error when setting up admin**
   - Make sure the user has signed up first
   - Check that the email is correct

2. **OAuth not working**
   - Verify OAuth credentials in Supabase dashboard
   - Check redirect URLs are correct
   - Ensure OAuth providers are enabled

3. **Middleware not working**
   - Check environment variables are set correctly
   - Verify Supabase project URL and keys
   - Check that the user_roles table exists

4. **Admin access not working**
   - Run the admin setup script
   - Check user_roles table has the correct entry
   - Verify the user is confirmed in Supabase

### Getting Help

If you encounter issues:

1. Check the Supabase dashboard logs
2. Verify environment variables
3. Test with a fresh user account
4. Check browser console for errors

## 🎉 Migration Complete!

Once you've completed all the steps above, your application will be fully migrated from Clerk to Supabase authentication. You'll have:

- Unified authentication system
- Better integration with your database
- More control over user management
- Cost-effective solution
- Simplified architecture

## 📝 Next Steps

After migration, consider:

1. **Customizing the UI** - Update colors, branding, etc.
2. **Adding more social providers** - Twitter, Discord, etc.
3. **Implementing user profiles** - Add profile pages, avatars, etc.
4. **Adding email templates** - Customize confirmation emails
5. **Setting up analytics** - Track user behavior

## 🔒 Security Notes

- Keep your service role key secure
- Regularly rotate API keys
- Monitor authentication logs
- Set up proper RLS policies
- Use HTTPS in production 