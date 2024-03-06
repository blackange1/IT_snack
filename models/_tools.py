class VerboseName(object):
    def __init__(self, verbose_name_plural):
        self.verbose_name_plural = verbose_name_plural
        self.MAX_LEN_KEY = max(*[len(key) for key in verbose_name_plural.keys()])

    def get_verbose_name(self, key):
        value = self.verbose_name_plural.get(key, None)
        if value:
            return f'{value + " " + ("_" * (self.MAX_LEN_KEY - len(value)))} | {key}'
        return f"Not key {key}"


step_verbose_name = VerboseName({
    "Text": "Текст",
    "Video": "Відео",
    "Choice": "Тест",
    "ChoiceMulti": "Тест Мульти",
    "Code": "Код",
})