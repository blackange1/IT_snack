import getCookie from '../tools.js'
import colors from '../vars.js'
import stepsContent from './lesson-content-steps-carcass.js'

let print = console.log


// https://learn.javascript.ru/decorators
stepsContent.renderChoice = function (step, type, id) {
    const stepInner = document.createElement('div')
    stepInner.classList.add('step-inner')
    stepInner.setAttribute('id', type + id)
    stepInner.innerHTML = `
            5.1 Задача на программирование: основная информация 11 з 14 кроків пройдено 0 з 3 бали отримано
            <hr>
            ${step['text_html']}
        `

    const customRadio = this.createElement('form', 'lesson-form custom-radio')
    customRadio.setAttribute('data-id', id)
    // const stepId = customRadio.dataset.id

    const fieldset = document.createElement('fieldset')
    const legend = this.createElement('legend', 'task__title')
    legend.textContent = "Виберіть один варіант зі списку"

    customRadio.appendChild(fieldset)
    fieldset.appendChild(legend)
    fieldset.appendChild(this.createElement('div', 'attempt__message'))
    const answers = step['answers']
    const repeat_task = step['repeat_task']
    if (repeat_task) {
        for (const answer of answers) {
            const label = this.createElement('label', 'custom-radio__label')
            label.innerHTML = `
                    <input type="radio" name="answer${step.id}" id="answer${answer.id}" data-id="${answer.id}">
                    <span class="custom-radio__text">${answer.text}</span>
                `
            fieldset.appendChild(label)
        }
    } else {
        const orderAnswers = step['order_answers'].split('-')
        print('orderAnswers', orderAnswers)

        for (const index of orderAnswers) {
            const answer = answers[index]
            const label = this.createElement('label', 'custom-radio__label')
            label.innerHTML = `
                    <input type="radio" name="answer${step.id}" id="answer${answer.id}" data-id="${answer.id}">
                    <span class="custom-radio__text">${answer.text}</span>
                `
            fieldset.appendChild(label)
        }
        fieldset.querySelector(`#answer${step['select_answer']}`).checked = true
    }

    const taskCheck = this.createElement('div', 'task__check')
    taskCheck.innerHTML = `
                <div class="task__points">${this.getTextPoints(step.points)} за розв’язок.</div>
            `
    const btnSubmit = this.createElement('button', 'button button-primary')

    btnSubmit.setAttribute('type', 'submit')
    btnSubmit.textContent = 'Надіслати'

    const btnCheckedAgain = this.createElement('div', 'button button-secondary button-checked-again hide')
    btnCheckedAgain.textContent = "btnCheckedAgain"
    btnCheckedAgain.onclick = () => {
        // розморозити
        this.toggleFrozen(id)
        print('btnCheckedAgain.onclick')
        const csrftoken = getCookie('csrftoken')
        fetch(`/api/step-item/choice/${id}/`, {
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
            print('PATCHHH')
        })
    }

    // customRadio.onsubmit = async (event) => {
    customRadio.onsubmit = (event) => {
        event.preventDefault();
        const $radioAnswer = customRadio.querySelector('input[type="radio"]:checked')
        if ($radioAnswer) {
            print('$radioAnswer', $radioAnswer)
            const csrftoken = getCookie('csrftoken')
            const answers = []
            for (const $checkboxAnswer of customRadio.querySelectorAll('input[type="radio"]')) {
                answers.push(+$checkboxAnswer.dataset.id)
            }
            print('answers', answers)
            const orderAnswers = []
            for (const index in answers) {
                orderAnswers.push(-1)
            }
            for (const i in answers) {
                let minIndex = 0
                let bufferValue = Infinity
                for (const j in answers) {
                    const answerValue = answers[j]
                    if (bufferValue > answerValue) {
                        bufferValue = answerValue
                        minIndex = j
                    }
                }
                answers[minIndex] = Infinity
                orderAnswers[i] = minIndex
            }
            print('orderAnswers', orderAnswers)

            fetch(`/api/step-item/choice/${id}/`, {
                method: 'POST',
                body: JSON.stringify({
                    selected: +$radioAnswer.dataset.id,
                    order_answers: orderAnswers.join('-'),
                    action: "check",
                }),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken
                },
            }).then(response => response.json()
            ).then(data => {
                print('data', data)
                if (data['solved']) {
                    const $menuChoice = this.getMenuItem('choice', id)

                    if ($menuChoice) {
                        $menuChoice.dataset.points = data['points']
                        $menuChoice.dataset.solved = true
                        const $path = $menuChoice.querySelector('path')
                        $path.style.fill = colors.blue

                        // заморозити
                        this.toggleFrozen(id, '1')
                    }
                } else {
                    this.toggleFrozen(id, '0')
                }
            })
        } else {
            alert('Ти не вибрав жодного елемента')
            // звертатися залежно від статі
        }
    }

    taskCheck.appendChild(btnSubmit)
    taskCheck.appendChild(btnCheckedAgain)

    fieldset.appendChild(taskCheck)
    customRadio.appendChild(fieldset)
    stepInner.appendChild(customRadio)

    this.$theory.appendChild(stepInner)

    if (!repeat_task) {
        this.toggleFrozen(id, (step['solved_item']) ? '1' : '0')
    }


    if (this.activeTheoryItem) {
        this.activeTheoryItem.classList.add('hide')
    }
    this.activeTheoryItem = stepInner
}


export default stepsContent