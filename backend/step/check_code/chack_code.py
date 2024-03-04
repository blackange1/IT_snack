import ast


# перевіляє чи використовується функція open. Виклик OpenChecker().visit(ast.parse(code.json))
class OpenChecker(ast.NodeVisitor):
    def visit_Call(self, node):
        if isinstance(node.func, ast.Name) and node.func.id == 'open':
            raise ValueError('Use of open function is not allowed')
        if isinstance(node.func, ast.Name) and node.func.id == 'exec':
            raise ValueError('Use of exec function is not allowed')
        self.generic_visit(node)


def check_forbidden_libraries(code):
    # перевірка на заборонені модулі
    # перетворюємо код у AST
    tree = ast.parse(code)

    OpenChecker().visit(tree)

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
