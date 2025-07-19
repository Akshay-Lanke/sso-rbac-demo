Step 1: Create RBAC Groups
In the Okta Admin Console, navigate to Directory → Groups.

Click Add Group.

Enter the group name (e.g., admin, editor, user).

Click Save.

Repeat for each role/group you want to use for RBAC.

Step 2: Create an OIDC Web Application
Go to Applications → Applications → Create App Integration.

Select OIDC - OpenID Connect and Web Application.

Click Next.

Fill out the application details:

App name: e.g., Okta SSO RBAC Demo

Sign-in redirect URI:
http://localhost:3000/callback

Sign-out redirect URI:
http://localhost:3001/

Under Assignments, choose which groups/users can access the app.

Click Save.

Step 3: Note Client ID and Client Secret
After creating the application, click into your new app.

Go to the General tab.

Copy the Client ID and Client Secret.

You’ll need these values for your backend .env file.

Step 4: Add “groups” Claim to Tokens (For RBAC)
Navigate to Security → API → Authorization Servers.

Click on default (or your custom Authorization Server if used).

Go to the Claims tab.

Click Add Claim.

Name: groups

Include in token type: ID Token, Access Token

Value type: Groups

Filter: .*

Include in: Any scope requested

Always include in token: Yes

Click Create.

Step 5: Enable Multi-Factor Authentication (MFA/2FA)
Go to Security → Multifactor.

Enable your preferred factors (e.g., Okta Verify, SMS, Google Authenticator, WebAuthn, etc.).

For each factor, click in, enable for your organization, and configure any necessary policies.

Go to Security → Authentication → Sign-On Policies.

Click your existing policy or create a new one.

Add Rule:

Name: Require MFA

Set Prompt for factor to Every sign-in

Assign this rule to your OIDC app (under "Applications").

Click Save.

Step 6: Assign Groups/Users to Your OIDC App
Go to Applications → Applications → [Your App] → Assignments.

Click Assign → Assign to Groups.

Select your groups (e.g., admin/editor/user) or specific users.

Click Assign, then Done.

Step 7 (Optional): Create/Test Users
Go to Directory → People.

Click Add Person.

Fill out user information and assign to the appropriate groups (admin, editor, etc.).

Users will be prompted to set up their password and MFA on first login.

Step 8: Update Your Backend .env File
Copy the following values from Okta (from your OIDC application and Authorization Server):

ini
Copy
Edit
OKTA_ISSUER=https://YOUR_OKTA_DOMAIN.okta.com/oauth2/default
OKTA_CLIENT_ID=your_client_id
OKTA_CLIENT_SECRET=your_client_secret
OKTA_REDIRECT_URI=http://localhost:3000/callback
SESSION_SECRET=your_custom_session_secret
