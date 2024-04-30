import django_filters
from .models import User  # Kullanıcı modelinizin adına göre değiştirin

class UserFilter(django_filters.FilterSet):
    username = django_filters.CharFilter(field_name='username', lookup_expr='icontains')

    class Meta:
        model = User
        fields = ['username']
