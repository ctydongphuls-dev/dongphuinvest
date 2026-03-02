# Deployment Guide for Đồng Phú Lạng Sơn Website

## Prerequisites

1. **GitHub Account**: You need a GitHub account. The script is configured for the `ctydongphuls-dev` account.
2. **Personal Access Token (PAT)**: Generate a PAT with the following scopes:
   - `repo` - Full control of private repositories
   - `workflow` - Update GitHub Action workflows

## Generating a Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" (classic)
3. Enter a note like "Deployment token for Đồng Phú Lạng Sơn website"
4. Set expiration date (recommended: set to "No expiration" if you want long-term access)
5. Select the required scopes:
   - Under "repo" section: select all 5 scopes
   - Under "workflow" section: select the workflow scope
6. Click "Generate token"
7. **Copy the token immediately** - you won't see it again!

## Using the Deployment Script

### Basic Usage

```bash
./deploy.sh YOUR_GITHUB_PAT
```

### Example

```bash
./deploy.sh ghp_abc123def456ghi789jkl012mno345pqr678stu901
```

## What the Script Does

1. **Configuration Check**: Verifies dependencies (git, npm) are installed
2. **Git Setup**: Configures git user identity to "Đồng Phú Lạng Sơn" / "ctydongphuls@gmail.com"
3. **Build**: Runs `npm run build` to create production build
4. **Git Remote**: Sets up remote repository with PAT for authentication
5. **Commit Changes**: Commits any unstaged changes with timestamp
6. **Push to GitHub**: Pushes changes to main branch
7. **Deploy to GitHub Pages**: Uses `gh-pages` package to deploy to gh-pages branch
8. **Cleanup**: Removes PAT from remote URL for security

## Important Notes

### Security Considerations

- **Never commit your PAT**: The script removes the PAT from git config after deployment
- **PAT Expiration**: If your PAT expires, you'll need to generate a new one
- **Scope Permissions**: The script only asks for necessary permissions

### Troubleshooting

#### Permission Denied
```
ERROR: Push to remote failed
```
- Check if your PAT is valid and has the correct scopes
- Verify you have access to the `ctydongphuls-dev/dongphuinvest` repository

#### Build Failures
```
ERROR: Build failed
```
- Check for TypeScript errors
- Verify dependencies are installed (`npm install`)

#### Authentication Errors
```
fatal: could not read Password for 'https://--help@github.com'
```
- Make sure you're passing the PAT as the first argument
- Check if your PAT contains special characters that need escaping

## Verification

After deployment, your website should be available at:
`https://ctydongphuls-dev.github.io/dongphuinvest/`

## Manual Deployment (Alternative)

If the script fails, you can deploy manually:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy:
   ```bash
   npm run deploy
   ```

3. Configure GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch

