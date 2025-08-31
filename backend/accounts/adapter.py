from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings


class CustomAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        """
        Build the email confirmation link to point to the React app.
        The frontend will read the `key` param and POST it to backend `/api/verify-email/`.
        """
        key = emailconfirmation.key
        # Take the first configured React base URL
        react_bases = getattr(settings, 'REACT_DEV_SERVER', [])
        if react_bases:
            base = react_bases[0].rstrip('/')
        else:
            base = 'http://localhost:5173'

        # Place under /chat/verify-email/:key to match frontend route
        return f"{base}/verify-email/{key}"


