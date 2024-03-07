from .abstract import BaseStep, Order
from django.db import models
from step.check_code.py_compile import ValidateCodePython


## знак консолі
class Code(BaseStep):
    TYPE = 'code'

    class Meta:
        verbose_name_plural = "Код ________ | Code"

    count_show_test = models.SmallIntegerField(default=1)
    points = models.SmallIntegerField(default=1)

    def get_solved(self, user):
        progress = self.progresscode_set.filter(user=user).first()
        if progress:
            return progress.solved
        return False

    @staticmethod
    def run_code(user_code, data_input):
        test = ValidateCodePython(user_code, data_input)
        res, error = test.run_code()
        print('res, error', (res, error))
        if not error:
            return res
        return 'error'

    def check_code(self, user_code, user):
        print('ValidateCodePython', ValidateCodePython)

        tests = []
        for testcase in self.testcase_set.all():
            # print(testcase)
            test = ValidateCodePython(user_code, testcase.input, testcase.output)
            res, error = test.check_code()
            # print('res, error', res, error)
            tests.append(res)

        progress = self.progresscode_set.filter(user=user).first()
        print(' - progress', progress)
        solved = all(tests)
        points = self.points if solved else 0
        if progress:
            return progress, points, solved, tests
        return None, points, solved, tests


class TestCase(Order):
    class Meta:
        ordering = ['order']

    code = models.ForeignKey(Code, on_delete=models.CASCADE)
    input = models.TextField(blank=True, null=True)
    output = models.TextField(blank=True, null=True)
