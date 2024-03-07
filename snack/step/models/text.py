from .abstract import BaseStep

class Text(BaseStep):
    TYPE = 'text'

    def get_solved(self, user):
        return bool(self.progresstext_set.filter(user=user).first())

    def get_points(self, user):
        progress = self.progresstext_set.filter(user=user).first()
        if progress:
            return 1
        return 0

    class Meta:
        verbose_name_plural = "Текст ______ | Text"