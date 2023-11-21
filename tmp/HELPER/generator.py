from pathlib import Path
from time import sleep
import json

import markdown


class Generator(object):
    CURRENT_PATH = Path.cwd()
    JSON_FILE_NAME = 'models_TEST_DATA.json'

    def __init__(self):
        self.courses_path = {}  # {'1': Path}
        self.data = {'can_save': True}
        self.course_path = None  # Path

    @staticmethod
    def normalize_n(number) -> str:
        number = str(number)
        if len(number) == 1:
            return '0' + number
        return number

    @staticmethod
    def print_header(string):
        ch = '#'
        print()
        print(ch * (len(string) + 4))
        print(ch + ' ' + string.upper() + ' ' + ch)
        print(ch * (len(string) + 4))
        print()

    @staticmethod
    def print_error(string):
        print('*** ' + string.upper() + ' ***')
        sleep(1)

    def show_detail_course(self):
        def get_dump(path, step=False) -> list:
            dump = []
            if step:
                for item_path in path.iterdir():
                    if item_path.is_file():
                        name_folder = item_path.name
                        item_order, item_expansion = name_folder.split('.')
                        item_order = int(item_order)
                        dump.append((item_order, item_expansion, item_path))
            else:
                for item_path in path.iterdir():
                    if item_path.is_dir():
                        name_folder = item_path.name
                        if name_folder[2] == ' ':
                            item_order, item_name = name_folder.split(' ', 1)
                            item_order = int(item_order)
                            dump.append((item_order, item_name, item_path))
            dump.sort(key=lambda x: x[0])
            return dump

        self.print_header('Вміст курсу')
        dump_modules = get_dump(self.course_path)
        modules = []
        for dump_module in dump_modules:
            module_order, module_name, module_path = dump_module
            print('*', module_order, module_name)
            dump_lessons = get_dump(module_path)
            module = {
                'name': module_name,
                'order': module_order,
            }
            lessons = []
            for dump_lesson in dump_lessons:
                lesson_order, lesson_name, lesson_path = dump_lesson
                print('  |--', lesson_order, lesson_name)
                dump_steps = get_dump(lesson_path, True)
                lesson = {
                    'name': lesson_name,
                    'order': lesson_order,
                }
                steps = []
                for dump_step in dump_steps:
                    step_order, step_expansion, step_path = dump_step
                    print('  |-- |--', step_order, step_expansion)
                    if step_expansion in ('html', 'md'):
                        text_html = ''
                        if step_expansion == 'html':
                            with open(step_path, 'r', encoding='utf-8') as file:
                                text_html = file.read()
                        elif step_expansion == 'md':
                            with open(step_path, 'r', encoding='utf-8') as file:
                                text = file.read()
                                text_html = markdown.markdown(text)
                            # with open(step_path, 'w', encoding='utf-8') as file:
                            #     file.write(text_html)
                        step = {
                            'CLASS_NAME': 'Text',
                            'order': step_order,
                            'text_html': text_html
                        }
                    elif step_expansion == 'json':
                        with open(step_path, 'r') as file:
                            json_content = file.read()
                            data_dict = json.loads(json_content)
                            data_dict.update({'order': step_order})
                        step = data_dict
                    steps.append(step)
                lesson.update({'steps': steps})
                lessons.append(lesson)
            module.update({'lessons': lessons})
            modules.append(module)

        self.data.update({'modules': modules})
        print(f'courses = [{self.data}]')
        print()
        while True:
            # FIXED
            # ansvers = input('Зберегти дані курсу в JSON для подальшого мпорту в BD? [Y/n]: ').lower()
            ansvers = 'y'
            if ansvers == 'y':
                # FIXED перейменувати функцію в generate_json та зробити щоб зберігало
                self.generate_test_data_py()
                break
            elif ansvers == 'n':
                self.run()
                break
            self.print_error('Ти вів щось не зрозуміле')

    def generate_test_data_py(self):
        try:
            with open(self.course_path.joinpath(Generator.JSON_FILE_NAME), 'w') as file:
                # file.write(f'courses = [{self.data}]')
                json.dump(self.data, file, ensure_ascii=False)
        except Exception as e:
            print("Виникла помилка:", e)

    def generate_dirs(self):
        print(self.course_path)
        path_description = self.course_path.joinpath('description.md')
        try:
            with open(path_description, 'r') as file:
                current_module = '00 ops'
                index_module, index_lesson = 1, 1
                for line in file.readlines():
                    line = line.replace('\n', '')
                    if set(line) != set(' ') and len(line) > 0:
                        if len(line) > 2 and line[:2] == '* ':
                            line = line[2:]
                            current_lesson = self.normalize_n(index_lesson) + ' ' + line
                            self.course_path.joinpath(current_module).joinpath(current_lesson).mkdir()
                            print(f'* створено {line}')
                            index_lesson += 1
                        else:
                            current_module = self.normalize_n(index_module) + ' ' + line
                            self.course_path.joinpath(current_module).mkdir()
                            print(f'створено {line}')
                            index_module += 1
        except Exception as e:
            print("Виникла помилка:", e)

    def run(self):
        self.data = {'can_save': True}
        i = 1
        for path in Generator.CURRENT_PATH.iterdir():
            if path.is_dir():
                self.courses_path.update({str(i): path})
                i += 1

        if self.courses_path:
            while True:
                self.print_header('Перелік курсів:')
                print('*', Generator.CURRENT_PATH.name)
                for j in range(len(self.courses_path)):
                    print(f'  |-- {j + 1}: {self.courses_path.get(str(j + 1), "ERROR").name}')
                # FIXED
                # n = input('Обери курс для генерації ввівши його номер: ')
                n = '3'
                if n in self.courses_path:
                    course_path = self.courses_path.get(n)
                    self.course_path = course_path
                    self.data.update({'name': course_path.name})

                    self.print_header(f'{course_path.name} | Обери дію')

                    while True:
                        print('  1. Згенерувати папки модулів та уроки на основі description.md')
                        print(f'  2. Переглянути вміст курсу {course_path.name}')
                        m = input('  Обери дію: ')
                        if m == '1':
                            self.generate_dirs()
                            break
                        if m == '2':
                            self.show_detail_course()
                            break
                        self.print_error('Ти ввів невірни номер, спробуй ще раз')
                    break
                self.print_error('Ти ввів невірни номер, спробуй ще раз')
        else:
            print('Нажаль, курсів не знайдено, дивись документацію')


g = Generator()
g.run()
