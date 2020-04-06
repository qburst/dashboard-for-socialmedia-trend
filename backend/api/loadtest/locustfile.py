from locust import HttpLocust, TaskSet, between


def profile(l):
    l.client.get("/api/tweets")

class UserBehavior(TaskSet):
    tasks = {profile: 1}

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    wait_time = between(5.0, 9.0)
