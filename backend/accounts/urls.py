from django.urls import path, re_path
from django.views.generic import TemplateView

from accounts.app_settings import api_settings

from accounts.views import (
    LoginView, LogoutView, PasswordChangeView, PasswordResetConfirmView,
    PasswordResetView, UserDetailsView,
    RegisterView, VerifyEmailView, ResendEmailVerificationView,
    TakenUsernameView, SearchUsersView
)


urlpatterns = [
    # URLs that do not require a session or valid token
    re_path(r'password/reset/?$', PasswordResetView.as_view(), name='rest_password_reset'),
    re_path(r'password/reset/confirm/?$', PasswordResetConfirmView.as_view(), name='rest_password_reset_confirm'),
    re_path(r'login/?$', LoginView.as_view(), name='rest_login'),
    # URLs that require a user to be logged in with a valid session / token.
    re_path(r'logout/?$', LogoutView.as_view(), name='rest_logout'),
    re_path(r'user/?$', UserDetailsView.as_view(), name='rest_user_details'),
    re_path(r'password/change/?$', PasswordChangeView.as_view(), name='rest_password_change'),

    #Registration and email verification
    path('', RegisterView.as_view(), name='rest_register'),
    re_path(r'check-username/?$', TakenUsernameView.as_view(), name='rest_user_name_exists'),
    re_path(r'search-users/?$', SearchUsersView.as_view(), name='rest_search_users'),
    re_path(r'verify-email/?$', VerifyEmailView.as_view(), name='rest_verify_email'),
    re_path(r'resend-email/?$', ResendEmailVerificationView.as_view(), name="rest_resend_email"),

    # This url is used by django-allauth and empty TemplateView is
    # defined just to allow reverse() call inside app, for example when email
    # with verification link is being sent, then it's required to render email
    # content.

    # account_confirm_email - You should override this view to handle it in
    # your API client somehow and then, send post to /verify-email/ endpoint
    # with proper key.
    # If you don't want to use API on that step, then just use ConfirmEmailView
    # view from:
    # django-allauth https://github.com/pennersr/django-allauth/blob/master/allauth/account/views.py
    re_path(
        r'^account-confirm-email/(?P<key>[-:\w]+)/$', TemplateView.as_view(template_name="account/email_confirm.html"),
        name='account_confirm_email',
    ),
    re_path(
        r'account-email-verification-sent/?$', TemplateView.as_view(),
        name='account_email_verification_sent',
    ),
]

if api_settings.USE_JWT:
    from rest_framework_simplejwt.views import TokenVerifyView

    from accounts.jwt_auth import get_refresh_view

    urlpatterns += [
        re_path(r'token/verify/?$', TokenVerifyView.as_view(), name='token_verify'),
        re_path(r'token/refresh/?$', get_refresh_view().as_view(), name='token_refresh'),
    ]
