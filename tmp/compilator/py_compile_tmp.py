import ast


def check_code(code):
    # перетворюємо код у AST
    tree = ast.parse(code)

    # проходимо по всіх об'єктах у AST
    for node in ast.walk(tree):
        # якщо зустріли об'єкт з ім'ям "Import"
        if isinstance(node, ast.Import):
            # перевіряємо, чи не містить імпортована бібліотека заборонені модулі
            for alias in node.names:
                if alias.name in ['os', 'sys']:
                    return False
        # якщо зустріли об'єкт з ім'ям "ImportFrom"
        elif isinstance(node, ast.ImportFrom):
            # перевіряємо, чи не містить імпортована бібліотека заборонені модулі
            if node.module in ['os', 'sys']:
                return False
    # якщо всі перевірки виконані успішно, повертаємо True
    return True


try:
    res = check_code("""
for i in range(5):
    i
print(123)
""")
    print(res)
except SyntaxError as error:
    print(error)
except Exception as error:
    print(error)

try:
    exec(
        """
        pr int(200)
        """
    )
except Exception as e:
    # 'add_note', 'args', 'end_lineno', 'end_offset', 'filename', 'lineno', 'msg', 'offset', 'print_file_and_line', 'text', 'with_traceback
    print(dir(e))
    print(e.args)
    print(e.end_lineno)
    print(e.end_offset)
    print(e.filename)
    print(e.lineno)
    print(e.msg)
    print(e.offset)
    print(e.print_file_and_line)
    print(e.text)
    print(e.with_traceback)
    print("Помилка виконання коду:", e)

# import resource
# import time
#
#
# def run_test():
#     print(200)
#
#
# # Обмеження пам'яті до 512 МБ
# resource.setrlimit(resource.RLIMIT_AS, (512 * 1024 * 1024, -1))
#
# # Виконання тесту та обмеження часу на виконання до 1 секунди
# start_time = time.monotonic()
# test_result = run_test()  # ваша функція для виконання тесту
# end_time = time.monotonic()
#
# if end_time - start_time > 1:
#     print("Час виконання тесту перевищив 1 секунду")
# else:
#     print("Тест успішно виконаний за %s секунд" % (end_time - start_time))
