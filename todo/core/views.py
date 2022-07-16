from django.shortcuts import render
from django.http.response import JsonResponse
from .models import *
from .serializer import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


# Create your views here.


class TodoView(APIView):
    serializer_class = TodoItemSerializer

    # Get data from the serializer
    def get(self, request):
        data = [{"title": data.title, "description": data.description, 'completed': data.completed, 'pk': data.pk}
                for data in TodoItem.objects.all()]
        return Response(data)

    # Post new data to the serializer
    def post(self, request):
        serializer = TodoItemSerializer(data=request.data)
        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response(serializer.data)

    def put(self, request, pk):
        item = TodoItem.objects.get(pk=pk)
        serializer = TodoItemSerializer(item, data=request.data)
        if (serializer.is_valid(raise_exception=True)):
            serializer.save()
            return Response(serializer.data)

    def delete(self, request, pk):
        item = TodoItem.objects.get(pk=pk)
        item.delete()
        return JsonResponse({'message': 'Item was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
