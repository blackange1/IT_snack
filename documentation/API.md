#[Всі посилання для api](http://localhost:8000/api/)

## Views Lessons Text

### url `api/step-item/text/int:step_id`

### GET

* `text_html` - опис теорії у HTML форматі

### POST

* `status` - статус повідомлення => `'ok'`

## Views Lessons Choice

### url `api/step-item/choice/int:step_id`

### GET

Якщо існує запис `progress.progresschoiceitem_set`

* `id` - ідентифікатор `Choice`
* `text_html` - опис завдання у HTML форматі
* `is_html_enabled` - рендерети відповідь як HTML | `bool`
* `is_options_feedback` - показувати фідбек після відправки відповіді
* `points` - максимум балів за розв'язок | `int`

---

* `repeat_task` - чи може юзер повторити завдання | `bool`
* `solved` - чи вирішено завдання | `bool`
* `student_solved` - чи вірішено завданя item
* `answers_json` - відповіді користувача `[["Київ", "Харків", "Полтава"], 1]`
* `has_progress` - чи відправляв юзер хочаб один раз свою відповідь | `bool` => `True`
* `student_points` - студенський бал | `int`

В іншому випадку

* `id` - ідентифікатор `Choice`
* `text_html` - опис завдання у HTML форматі
* `is_html_enabled` - рендерети відповідь як HTML | `bool`
* `is_options_feedback` - показувати фідбек після відправки відповіді
* `points` - максимум балів за розв'язок | `int`

---

* `answers` - варіанти відповіді `[{'id': 1, 'text':'Київ'}, {'id': 2, 'text':'Харків'}]`
* `repeat_task` - чи може юзер повторити завдання | `bool`
* `has_progress` - чи відправляв юзер хочаб один раз свою відповідь | `bool`
* `student_points` - студенський бал | `int`

### POST

* `status` - статус повідомлення => `'ok'`
* `student_points` - студенський бал | `int`
* `solved` - чи вирішено завдання | `bool`

### PATCH

* `is_html_enabled` - рендерети відповідь як HTML | `bool`
* `is_options_feedback` - показувати фідбек після відправки відповіді
* `points` - максимум балів за розв'язок | `int`
* `answers` - варіанти відповіді `[{'id': 1, 'text':'Київ'}, {'id': 2, 'text':'Харків'}]`
* `repeat_task` - чи може юзер повторити завдання | `bool` => `True`

## Views Lessons Choice Multi

### url `api/step-item/choice_multi/int:step_id`

### GET

Якщо існує запис `progress.progresschoicemultiitem_set`

* `id` - ідентифікатор `ChoiceMulti`
* `text_html` - опис завдання у HTML форматі
* `is_html_enabled` - рендерети відповідь як HTML | `bool`
* `is_options_feedback` - показувати фідбек після відправки відповіді
* `points` - максимум балів за розв'язок | `int`

---

* `repeat_task` - чи може юзер повторити завдання | `bool`
* `solved` - чи вирішено завдання | `bool`
* `student_solved` - чи вірішено завданя item
* `answers_json` - відповіді користувача `[["Іо", "Європа"], [0, 1]]`
* `has_progress` - чи відправляв юзер хочаб один раз свою відповідь | `bool` => `True`
* `student_points` - студенський бал | `float`

В іншому випадку

* `id` - ідентифікатор `ChoiceMulti`
* `text_html` - опис завдання у HTML форматі
* `is_html_enabled` - рендерети відповідь як HTML | `bool`
* `is_options_feedback` - показувати фідбек після відправки відповіді
* `points` - максимум балів за розв'язок | `int`

---

* `answers` - варіанти відповіді `[{'id': 1, 'text':'Іо'}, {'id': 2, 'text':'Європа'}]`
* `repeat_task` - чи може юзер повторити завдання | `bool`
* `has_progress` - чи відправляв юзер хочаб один раз свою відповідь | `bool`
* `student_points` - студенський бал | `float`

### POST

* `status` - статус повідомлення => `'ok'`
* `student_points` - студенський бал | `float`
* `solved` - чи вирішено завдання | `bool`

### PATCH

* `is_html_enabled` - рендерети відповідь як HTML | `bool`
* `is_options_feedback` - показувати фідбек після відправки відповіді
* `points` - максимум балів за розв'язок | `int`
* `answers` - варіанти відповіді `[{'id': 1, 'text':'Іо'}, {'id': 2, 'text':'Європа'}]`
* `repeat_task` - чи може юзер повторити завдання | `bool` => `True`