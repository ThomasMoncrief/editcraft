from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("signup", views.signup, name="signup"),
    path("about", views.about, name="about"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("settings", views.settings, name="settings"),
    path("uploader", views.uploader, name="uploader"),
    path("workshop", views.workshop, name="workshop"),
    path("workshop/<str:id>", views.workshop_render, name="workshop_render"),
    path("workshop/<str:id>/download", views.workshop_download, name="workshop_download"),
    path("api/workshop_api/<str:id>", views.workshop_api, name="workshop_api"),
]