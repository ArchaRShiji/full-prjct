from rest_framework import serializers
from .models import User,Movie,Watchlater,Watchhistory

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["email", "name", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields ='__all__'

class WatchListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Watchlater
        fields='__all__'

class WatchHistorySerializer(serializers.ModelSerializer):
    movie = serializers.PrimaryKeyRelatedField(queryset=Movie.objects.all())  # This will expect only the movie ID (integer)
    class Meta:
        model=Watchhistory
        fields=["id","user", "date", "movie"]

