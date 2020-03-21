from mongoengine import DynamicDocument, StringField, DateTimeField
# from mongoengine import *
import datetime


class TwitterData(DynamicDocument):
    text = StringField(required=True, max_length=200)
    created_at = DateTimeField(default=datetime.datetime.now())
    meta = {'allow_inheritance': True}

# class TwitterData(models.Model):   
#     _id = models.IntegerField(db_column='_id') 
#     _cls = models.CharField(max_length=100)
#     text = models.TextField()
#     created_at = models.DateTimeField(
#         default=datetime.datetime.now, editable=False,
#     )
#     hashtags = models.ListField(default=[])
#     country = models.CharField(max_length=100)
    # category = models.EmbeddedDictField(model_container=dict)
    # category = models.ListField(default=[])
    
    # class Meta:        
    #     abstract = True
