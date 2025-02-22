from django.shortcuts import render, redirect,get_object_or_404
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token
from .serializers import LoginSerializer
from .serializers import SignupSerializer, MovieSerializer,WatchListSerializer,WatchHistorySerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Movie,Watchlater,Watchhistory
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model, authenticate, login
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash,logout
from django.contrib.auth.decorators import login_required
from .models import Movie

User = get_user_model() 

def login_page(request):
    if request.method == 'POST':
        email = request.POST.get('username') 
        password = request.POST.get('password')

        user = authenticate(request, email=email, password=password) 

        if user is not None:
            print("Authentication successful!")
            login(request, user)
            return redirect('MovieList')  
        else:
            print("Authentication failed!")
            messages.error(request, "Invalid email or password.")  # Show error message

    return render(request, 'login.html')

@login_required
def admin_logout(request):
    logout(request)
    return redirect('login_page')

@login_required
def changePsswd(request):
    current_password = request.POST.get('cPsswd')
    new_password = request.POST.get('nPsswd')
    confirm_password = request.POST.get('confPsswd')

    user = request.user  

    if not user.check_password(current_password):
        messages.error(request, "Current password is incorrect.")
    elif new_password != confirm_password:
            messages.error(request, "New passwords do not match.")
    else:
        user.set_password(new_password)  # Securely update password
        user.save()
        update_session_auth_hash(request, user)  # Prevent logout after password change
        messages.success(request, "Password successfully changed!")
        return redirect('login_page')  # Redirect to login or profile page

    return render(request, 'changePsswd.html')

@login_required
def MovieList(request):
    movies = Movie.objects.all()
    return render(request,'MovieListing.html',{'movies': movies})

def editPage(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)

    if request.method == 'POST':
        print("Received Data:", request.POST, request.FILES)  # Debugging

        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()

        if title:  # Update title only if provided
            movie.title = title
        if description :
            movie.description  = description 

        # Only update if a new file is uploaded
        if 'video' in request.FILES and request.FILES['video']:
            movie.video = request.FILES['video']
            print("Video Updated:", movie.video)

        if 'thumbnail' in request.FILES and request.FILES['thumbnail']:
            movie.thumb = request.FILES['thumbnail']
            print("Thumbnail Updated:", movie.thumbnail)

        movie.save()
        print("Movie saved successfully!")  # Debugging

        return redirect('MovieList')

    return render(request, 'edit.html', {'movie': movie})


def viewPage(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    return render(request,'view.html',{'movie': movie})

def createPage(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        desc = request.POST.get('desc')
        video = request.FILES.get('video')  # Use request.FILES for file uploads
        thumb = request.FILES.get('Thumb')

        if title and desc and video and thumb:
            movie = Movie.objects.create(
                title=title,
                description=desc,
                thumbnail=thumb,
                video=video
            )
            movie.save()
            return redirect('MovieList')  # Redirect to the movie listing page after submission

    return render(request, 'create.html')

def deleteMovie(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    movie.delete()
    return redirect('MovieList')

@login_required
def userListing(request):
    query = request.GET.get('q', '')
    users = User.objects.filter(is_admin=False) 
    if query:
        users = users.filter(email__icontains=query)
    return render(request, 'userList.html', {'users': users, 'query': query})

@login_required
def block_user(request, user_id):
    user = User.objects.get(id=user_id)
    user.is_active = False  # Deactivate user
    user.save()
    return redirect('userList')


@login_required
def unblock_user(request, user_id):
    user = User.objects.get(id=user_id)
    user.is_active = True  # Activate user
    user.save()
    return redirect('userList')

@login_required
def view_history(request, user_id):
    user = User.objects.get(id=user_id)
    history = Watchhistory.objects.filter(user=user).order_by('-date')
    return render(request, 'viewUserHistory.html', {'history': history, 'user': user})

def viewCount(request):
    movies = Movie.objects.all().order_by('-count')  # Order by count descending
    return render(request, 'viewcount.html', {'movies': movies})

@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login_api(request):
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    email = serializer.validated_data["email"]
    password = serializer.validated_data["password"]

    user = authenticate(username=email, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
         'user': {
            'id': user.id,  # Include user ID in the response
            'email': user.email
        }
        }, status=HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Account created successfully"}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def movie(request):
    try:
        movie=Movie.objects.all()
        serializer = MovieSerializer(movie,many=True)
        print(serializer.data)
        return Response(serializer.data)
    except Exception as e:
         return Response(
            {"error": "Something went wrong", "details": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def watchList_Add(request):
    serializer=WatchListSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "watchlist added successfully"}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def watchList(request):
    user_id = request.query_params.get('user_id')  # Retrieve the user_id from query parameters
    if user_id:  # Fetch the watchlist items based on user_id
        try:
            watchlist_items = Watchlater.objects.filter(user_id=user_id)
            if watchlist_items.exists():
                serializer = WatchListSerializer(watchlist_items, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No watchlist items found for this user"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Something went wrong", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:  # If no user_id is provided
        return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def watchHistory_Add(request):
    print("Request data:", request.data)
    serializer = WatchHistorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Watch history added successfully"}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def watchHistory(request):
    user_id = request.query_params.get('user_id') 
    if user_id: 
        try:
            history_items=Watchhistory.objects.filter(user_id=user_id)
            if history_items.exists():
                serializer = WatchHistorySerializer(history_items, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No watch history found for this user"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {"error": "Something went wrong", "details": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeleteHist(request):
    id = request.query_params.get('id') 
    print("id",id) # Retrieve the 'id' from query parameters
    if id:
        try:
            history_item = Watchhistory.objects.get(id=id)
            history_item.delete()
            return Response({"message": "Watch history deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Watchhistory.DoesNotExist:
            return Response({"error": "Watch history not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error": "ID parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeleteList(request):
    id = request.query_params.get('id')  # Retrieve the 'id' from query parameters
    if id:
        try:
            List_item = Watchlater.objects.get(id=id)
            List_item.delete()
            return Response({"message": "Watch later deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Watchlater.DoesNotExist:
            return Response({"error": "Watch later not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error": "ID parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def MovieDetails(request):
    id = request.query_params.get('id')
    
    if id:
        try:
            # Fetch the movie object
            movie = Movie.objects.get(id=id)
            
            # Increment the view count
            movie.count += 1
            
            #movie.save()  # Save the updated count
            movie.save(update_fields=['count'])
            # Serialize and return the updated movie details
            serializer = MovieSerializer(movie)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Movie.DoesNotExist:
            return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)
    
    else:  
        # Fetch all movies if no specific ID is provided
        movies = Movie.objects.all()
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@csrf_exempt    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ChangePsswd(request):
    user = request.user  # Get the authenticated user
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        new_password = serializer.validated_data.get('password')

        if new_password:
            user.password = make_password(new_password)  # Hash the new password
            user.save()
            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.authtoken.models import Token

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_api(request):
    try:
        request.user.auth_token.delete()  # Delete the token from the database
        return Response({"message": "Logged out successfully"}, status=200)
    except:
        return Response({"error": "Something went wrong"}, status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_movies_api(request):
    query = request.GET.get("q", "")
    results = Movie.objects.filter(title__icontains=query) if query else Movie.objects.all()
    serialized_data = MovieSerializer(results, many=True)
    return Response(serialized_data.data)