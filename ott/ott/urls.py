"""
URL configuration for ott project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from app1 import views
urlpatterns = [
  path('', views.login_page,name="login_page"),
  path('changePsswd',views.changePsswd,name='change_admin_psswd'),
  path('MovieListing',views.MovieList,name='MovieList'),
  path('edit/<int:movie_id>/',views.editPage,name="edit_movie"),
  path('view/<int:movie_id>/',views.viewPage,name="view_movie"),
  path('create',views.createPage),
  path('userList',views.userListing,name='userList'),
  path('viewhist/<int:user_id>/', views.view_history, name='viewhist'),  # Route for viewing history  
  path('viewCount',views.viewCount ,name='report'),
  path('delete/<int:movie_id>/', views.deleteMovie, name='delete_movie'),
  path('userList/', views.userListing, name='userList'),
  path('block_user/<int:user_id>/', views.block_user, name='block_user'),
  path('unblock_user/<int:user_id>/', views.unblock_user, name='unblock_user'),
  path('adminlogout/', views.admin_logout, name='adminlogout'),

  path('apiLogin',views.login_api,name='apiLogin'),
  path('apiSignup',views.signup,name='Signup'),
  path('apiMovie',views.movie,name='Movie'),
  path('apiwatchListAdd',views.watchList_Add,name='Add_watchList'),
  path('apiWatchList',views.watchList,name='watchList'),
  path('watchHistory_add',views.watchHistory_Add,name='watchHistory_Add'),
  path('apiwatchHistory',views.watchHistory,name='watchHistory'),
  path('apiDeleteHist',views.DeleteHist,name='delhist'),
  path('apiDeleteList',views.DeleteList,name='delList'),
  path('apiMovieDetails',views.MovieDetails,name='moviedetails'),
  path('ChangePsswd',views.ChangePsswd,name='changepsswd'),
  path('logout_api',views.logout_api,name='logout'),
  path('search',views.search_movies_api,name='search'),
]
