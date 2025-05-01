
# Deploying DailyGreen to Vercel

This guide explains how to deploy the DailyGreen application to Vercel.

## Prerequisites

1. A GitHub account with your DailyGreen repository
2. A Vercel account (you can sign up at https://vercel.com)

## Deployment Steps

1. Go to [Vercel](https://vercel.com) and log in with your GitHub account
2. Click "Add New..." and select "Project"
3. Import your DailyGreen repository from GitHub
4. Configure the project:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: npm run build (default)
   - Output Directory: dist (default)
5. Environment Variables:
   - If using Supabase, add the following environment variables:
     - VITE_SUPABASE_URL: Your Supabase project URL
     - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous key
6. Click "Deploy"

## Important Settings

The `vercel.json` file in the root directory contains configuration for proper routing in this single-page application. This ensures that all routes are directed to index.html, allowing React Router to handle client-side routing.

## After Deployment

1. Set up your custom domain if desired
2. Update your Supabase authentication settings with your new domain for redirect URLs

## Redeployment

Any pushes to your main branch will trigger automatic redeployments on Vercel.
