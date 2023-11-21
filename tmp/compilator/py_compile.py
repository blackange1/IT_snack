from chack_code import check_forbidden_libraries


class ValidateCodePython(object):
    def __init__(self, user_code: str, input_data="", output_data=""):
        self.user_code = user_code
        self.input_data = self.__get_data_list(input_data)
        self.output_data = self.__get_data_list(output_data)
        self.user_output_data = []

    @staticmethod
    def __get_data_list(string):
        # print(string.split('\n'))
        return string.split('\n')

    def get_func_input(self):
        def func(lst):
            for string in lst:
                yield string
            raise TimeoutError('EOFError: EOF when reading a line | очікує введення, а воно ен відбувається')

        gen = func(self.input_data)

        def _input(prom=None):
            return next(gen)

        return _input

    def get_func_print(self):
        def _print(*args, sep=' ', end='\n'):
            buffer = [str(item) for item in args]
            self.user_output_data.append(sep.join(buffer) + end)

        return _print

    def check_code(self):
        """
        :return: Повертає (res_check_code: bool, error_compilation: str)
        `res_check_code` - результат перевірки тестів
        `error_compilation` - помилка при виконанні
        """
        res_check_code = False
        error_compilation = ''
        try:
            # перестало працювати :(
            if not check_forbidden_libraries(self.user_code):
                print('ви використовуєте заборонені модулі')
            else:
                exec(self.user_code, {'input': self.get_func_input(), 'print': self.get_func_print()})
                print('self.output_data', self.output_data)
                str_output_data = '\n'.join(self.output_data)
                print('self.user_output_data', self.user_output_data)
                str_user_output_data = ''.join(self.user_output_data)
                # print('str_output_data =', str_output_data)
                # print('str_user_output_data=', str_user_output_data)
                if str_output_data == str_user_output_data:
                    res_check_code = True
        except SyntaxError as e:
            # 'add_note', 'args', 'end_lineno', 'end_offset', 'filename', 'lineno', 'msg', 'offset', 'print_file_and_line', 'text', 'with_traceback'
            print(e.args)
            error_compilation = f"SyntaxError: {e}"
        except ValueError as e:
            error_compilation = f"ValueError: {e}"
        except Exception as e:
            error_compilation = f"Exception: {e}"
        finally:
            print('res_check_code =', res_check_code)
            print('error_compilation =', error_compilation)
            return res_check_code, error_compilation
        # https://thepythonguru.com/media/uploads/2019/10/31/python-exception-classes.jpg

    def run_tests(self, tests: list):
        pass


code = r"""
a, b = input().split()
print(int(a) + int(b) + int(input()))
"""

# test = ValidateCodePython(
#     code,
#     [
#         '1 2',
#         '3'
#     ],
#     [
#         '6\n',
#     ]
# )
test = ValidateCodePython(
    code,
    '1 2\n3',
    '6\n',
)
test.check_code()
