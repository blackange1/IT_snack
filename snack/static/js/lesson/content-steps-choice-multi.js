import getCookie from '../tools.js'
import colors from '../vars.js'
import stepsContent from './content-steps-choice.js'

let print = console.log

// https://learn.javascript.ru/decorators
stepsContent.updateChoiceMulti = function (step, id) {
    const $form = document.querySelector(`#choice_multi${id} form`)
    const wrapperLabel = $form.querySelector('.wrapper_label')
    wrapperLabel.innerHTML = ''
    for (const answer of step['answers']) {

        const label = this.createElement('label', 'container', `
                <input type="checkbox" name="answer${step.id}"  id="answer${answer.id}" data-id="${answer.id}">
                <span class="checkmark"></span>${answer.text}`, true)
            wrapperLabel.appendChild(label)
        wrapperLabel.appendChild(label)
    }
    const btnNextStep = $form.querySelector('.button-next-step')
    if (!btnNextStep.classList.contains('hide')) {
        btnNextStep.classList.add('hide')
    }
}

stepsContent.renderChoiceMulti = function (step, id) {
    const stepInner = this.createElement('div', {'class': 'step-inner', 'id': 'choice_multi' + id}, `
        5.1 Задача на программирование: основная информация 11 з 14 кроків пройдено 0 з 3 бали отримано
        <hr>${step['text_html']}`, true)

    // CREATE FORM
    const mainForm = this.createElement('form', {'class': 'lesson-form', 'data-id': id})
    const isMultipleChoice = true
    const fieldset = document.createElement('fieldset')
    const legend = this.createElement('legend', 'task__title',
        (isMultipleChoice) ? "Виберіть декілька відповідей" : "Виберіть один варіант зі списку")

    mainForm.appendChild(fieldset)
    fieldset.appendChild(legend)
    fieldset.appendChild(this.createElement('div', 'attempt__message'))
    const answers = step['answers']
    const repeat_task = step['repeat_task']
    const wrapperLabel = this.createElement('div', 'wrapper_label')
    if (repeat_task) {
        for (const answer of answers) {
            const label = this.createElement('label', 'container', `
                <input type="checkbox" name="answer${step.id}"  id="answer${answer.id}" data-id="${answer.id}">
                <span class="checkmark"></span>${answer.text}`, true)
            wrapperLabel.appendChild(label)
        }
        fieldset.appendChild(wrapperLabel)
    } else {
        // FIXED
        const wrapperLabel = this.createElement('div', 'wrapper_label')
        let j = 0
        print("", step['answers_json'])
        const index = step['answers_json'][1]
        for (const answer of step["answers_json"][0]) {
            const label = this.createElement('label', 'container')
            const input = this.createElement('input', {type: 'checkbox'})
            const span = this.createElement('span', 'checkmark')
            label.appendChild(input)
            label.appendChild(span)
            label.appendChild(this.createElement('span', '', answer))
            if (index.includes(j)) {
                input.checked = true
            }
            j++
            wrapperLabel.appendChild(label)
        }
        fieldset.appendChild(wrapperLabel)
    }

    const taskCheck = this.createElement('div', 'task__check')
    const taskPoints = this.createElement('div', 'task__points hide')
    if (!step['has_progress']) {
        taskPoints.classList.remove('hide')
        taskPoints.textContent = `${this.getTextPoints(step.points)} за розв’язок.`
    }
    taskCheck.appendChild(taskPoints)
    // BUTTON
    const btnSubmit = this.createElement('button',
        {'class': 'button button-primary', type: 'submit'}, 'Надіслати')
    taskCheck.appendChild(btnSubmit)

    const btnNextStep = this.createElement('div',
        'button button-primary button-next-step hide', 'Наступний крок')
    btnNextStep.onclick = () => {
        print('btnNextStep.onclick')
    }
    taskCheck.appendChild(btnNextStep)

    const btnCheckedAgain = this.createElement('div',
        'button button-secondary button-checked-again hide', "btnCheckedAgain")
    btnCheckedAgain.onclick = () => {
        // розморозити
        this.toggleFrozen(mainForm)
        const csrftoken = getCookie('csrftoken')
        fetch(`/api/step-item/choice_multi/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({
                repeat_task: true,
            }),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken
            },
        }).then(response => response.json()
        ).then(data => {
            print('data PATCH: ', data)
            this.updateChoiceMulti(data, id)
        })
    }
    taskCheck.appendChild(btnCheckedAgain)
    // END BUTTON

    fieldset.appendChild(taskCheck)

    const formFooter = this.createElement('div', 'form__footer hide')

    if (step['has_progress']) {
        formFooter.classList.remove('hide')
        formFooter.innerHTML = `
                <a href="#">Розв'язки</a> Ви отримали <span class="student_points">${this.getTextPoints(step['student_points'])}</span> з ${step['points']}
        `
    }
    fieldset.appendChild(formFooter)
    mainForm.appendChild(fieldset)
    stepInner.appendChild(mainForm)
    this.$theory.appendChild(stepInner)

    if (!repeat_task) {
        if (step['student_solved']) {
            this.toggleFrozen(mainForm, '1', false)
            btnNextStep.classList.remove('hide')
        } else {
            this.toggleFrozen(mainForm, '0', false)
        }
        // this.toggleFrozen(mainForm, (step['student_solved']) ? '1' : '0')
    }
    if (this.activeTheoryItem) {
        this.activeTheoryItem.classList.add('hide')
    }
    this.activeTheoryItem = stepInner

    // mainForm.onsubmit = async (event) => {
    mainForm.onsubmit = (event) => {
        event.preventDefault();
        let listAnswerId = []
        let selectedIndexes
        let selected = []
        const listCheckboxAnswer = mainForm.querySelectorAll('input[type="checkbox"]')
        selectedIndexes = []
        let i = 0
        for (const checkboxAnswer of listCheckboxAnswer) {
            listAnswerId.push(checkboxAnswer.dataset.id)
            if (checkboxAnswer.checked) {
                selected.push(checkboxAnswer.dataset.id)
                selectedIndexes.push(i)
            }
            i++
        }

        // const $radioAnswer = mainForm.querySelector('input[type="radio"]:checked')
        if (selected.length) {
            const csrftoken = getCookie('csrftoken')

            fetch(`/api/step-item/choice_multi/${id}/`, {
                method: 'POST',
                body: JSON.stringify({
                    // selected: (isMultipleChoice) ? selected : selected[0],
                    selected_indexes: selectedIndexes,
                    answer_ids: listAnswerId
                }),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken
                },
            }).then(response => response.json()
            ).then(data => {
                print('data POST:', data)
                if (formFooter.classList.contains('hide')) {
                    formFooter.classList.remove('hide')
                }

                if (!taskPoints.classList.contains('hide')) {
                    taskPoints.classList.add('hide')
                }
                // mainForm.querySelector('.task__points').textContent = ''

                if (!step['has_progress']) {
                    step['has_progress'] = true
                    mainForm.querySelector('.form__footer').innerHTML = `
                        <a href="#">Розв'язки</a> Ви отримали <span class="student_points">${this.getTextPoints(data['student_points'])}</span> з ${step['points']}`
                }
                if (data['solved']) {
                    mainForm.querySelector('.form__footer .student_points').textContent = this.getTextPoints(data['student_points'])
                    btnNextStep.classList.remove('hide')
                    const $menuChoice = this.getMenuItem('choice_multi', id)
                    if ($menuChoice) {
                        // $menuChoice.dataset.points = data['student_points']
                        $menuChoice.dataset.solved = 'true'
                        const $path = $menuChoice.querySelector('path')
                        $path.style.fill = colors.blue

                        // заморозити
                        this.toggleFrozen(mainForm, '1')
                    }
                } else {
                    this.toggleFrozen(mainForm, '0')
                }
            })
        } else {
            alert('Ти не вибрав жодного елемента')
            // звертатися залежно від статі
        }
    }
}


export default stepsContent