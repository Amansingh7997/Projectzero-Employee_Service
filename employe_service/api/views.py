from django.shortcuts import render 
from rest_framework import viewsets
from .models import Employee
from .serializer import EmployeeSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset=Employee.objects.all()
    serializer_class=EmployeeSerializer

# Create your views here.
