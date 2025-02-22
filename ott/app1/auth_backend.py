from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailAuthBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        if email is None or password is None:
            return None
        try:
            user = User.objects.get(email=email)  # Fetch user by email
            if user.check_password(password):  # Validate password
                return user
        except User.DoesNotExist:
            return None
