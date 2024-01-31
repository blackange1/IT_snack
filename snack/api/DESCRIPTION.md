# views lessons choice

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
* `student_points` - студенський бал

В іншому випадку
* `id` - ідентифікатор `Choice` 
* `text_html` - опис завдання у HTML форматі
* `is_html_enabled` - рендерети відповідь як HTML | `bool`
* `is_options_feedback` - показувати фідбек після відправки відповіді
* `points` - максимум балів за розв'язок | `int`
---
* `answers` - відповіді [{'id': 1, 'text':'Київ'}, {'id': 2, 'text':'Харків'}]
* `repeat_task` - чи може юзер повторити завдання | `bool`
* `has_progress` - чи відправляв юзер хочаб один раз свою відповідь | `bool`
* `student_points` - студенський бал

