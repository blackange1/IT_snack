# views lessons choice

### GET

* `id` - ідентифікатор `Choice` 
* `text_html` - опис завдання у HTML форматі
* `is_html_enabled` - рендерети відповідь як HTML | `bool`
* `is_options_feedback` - показувати фідбек після відправки відповіді
* `points` - максимум балів за розв'язок | `int`

Якщо існує запис `progress.progresschoiceitem_set`

* `student_solved` - чи вірішено завданя item
* `repeat_task` - чи може юзер повторити завдання | `bool` 
* `answers_json` - відповіді користувача `[["Київ", "Харків", "Полтава"], 1]`
* `solved` - чи вирішено завдання | `bool`
* `has_progress` - чи відправляв юзер хочаб один раз свою відповідь | `bool` => `True`
* `student_points` - студенський бал
