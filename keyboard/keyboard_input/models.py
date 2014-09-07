from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Program(models.Model):
    name = models.CharField(max_length=40, null=False, blank=False)
    desc = models.TextField(blank=True, null=True)
    version = models.CharField(max_length=20, null=False, blank=False)
    image_url = models.CharField(max_length=150, blank=True, null=True)

    def __unicode__(self):
        return self.name + '' + self.version

    class Meta:
        unique_together = ('name', 'version',)


class Scheme(models.Model):
    name = models.CharField(max_length=55, null=False, blank=False)
    desc = models.TextField(blank=True, null=True)
    os = models.CharField(max_length=30)
    verified = models.IntegerField()
    program = models.ForeignKey(Program)
    user = models.ManyToManyField(User)
    #methods
    def __unicode__(self):
        return self.name


class Shortcut(models.Model):
    #add name = models.CharField(max_length=35)
    name = models.CharField(max_length=25, null=False, blank=False)#TODO: name max length should be longer
    keys = models.CharField(max_length=25, null=False, blank=False)
    desc = models.TextField(blank=True, null=True)
    image_url = models.CharField(max_length=150, blank=True, null=True)
    color = models.CharField(max_length=22, blank=True, null=True)
    activated_by = models.CharField(max_length=22, blank=True, null=True)
    scheme = models.ForeignKey(Scheme)
    #methods
    def __unicode_(self):
        return self.name