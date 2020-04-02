from rest_framework import permissions


class UpdateOwnObject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        """Check if user is trying to edit their own object"""
        if request.method in permissions.SAFE_METHODS:
            return True

        else:
            return obj.created_by == str(request.user)
