import getCookie from '../tools.js'
import colors from '../vars.js'
import stepsContent from './lesson-content-steps-choice.js'

let print = console.log


// https://learn.javascript.ru/decorators
stepsContent.renderChoiceMulti = function (step, type, id) {
    const stepInner = document.createElement('div')
    stepInner.classList.add('step-inner')
    stepInner.setAttribute('id', type + id)
    stepInner.innerHTML = `
            5.1 Задача на программирование: основная информация 11 з 14 кроків пройдено 0 з 3 бали отримано
            <hr>
            ${step.text_html}
        `

        print('is_multiple_choice')
        const customCheckbox = this.createElement('form', 'lesson-form')
        customCheckbox.setAttribute('data-id', id)

        const fieldset = document.createElement('fieldset')
        const legend = this.createElement('legend', 'task__title')
        legend.textContent = "Виберіть декілька відповідей"

        customCheckbox.appendChild(fieldset)
        fieldset.appendChild(legend)
        // add to css
        fieldset.appendChild(this.createElement('div', 'attempt__message'))

        for (const answer of step.answers) {
            const label = this.createElement('label', 'container')
            label.innerHTML = `
                    <input type="checkbox" id="answer${answer.id}" data-id="${answer.id}">
                    <span class="checkmark"></span>${answer.text}
                `
            fieldset.appendChild(label)
        }
        const taskCheck = this.createElement('div', 'task__check')
        taskCheck.innerHTML = `
                <div class="task__points">${this.getTextPoints(step.points)} за розв’язок.</div>
            `
        const btnSubmit = this.createElement('button', 'button button-primary')
        btnSubmit.setAttribute('type', 'submit')
        btnSubmit.textContent = 'Надіслати'

        const btnCheckedAgain = this.createElement('div', 'button button-secondary button-checked-again hide')
        btnCheckedAgain.textContent = "Розв'язати знову"
        btnCheckedAgain.onclick = () => {
            // розморозити
            this.toggleFrozen(id)
            print('btnCheckedAgain.onclick')
        }

        customCheckbox.onsubmit = (event) => {
            event.preventDefault()
            const $checkboxAnswers = customCheckbox.querySelectorAll('input[type="checkbox"]:checked')
            print('$checkboxAnswers', $checkboxAnswers)
            if ($checkboxAnswers.length) {
                // FIXED
                const selected = []
                // for (const $checkboxAnsver of $checkboxAnswers) {
                //     selected.push(+$checkboxAnsver.dataset.id)
                // }
                // const notSelected = []
                // for (const $checkboxAnsver of customCheckbox.querySelectorAll('input[type="checkbox"]')) {
                //     const id = +$checkboxAnsver.dataset.id
                //     if (!selected.includes(id)) {
                //         notSelected.push(id)
                //     }
                // }
                const answers = []
                for (const $checkboxAnsver of customCheckbox.querySelectorAll('input[type="checkbox"]')) {
                    answers.push(+$checkboxAnsver.dataset.id)
                    selected.push(+$checkboxAnsver.checked)
                }

                const csrftoken = getCookie('csrftoken')
                const stepId = customCheckbox.dataset.id
                const data = JSON.stringify({
                    selected: selected,
                    // not_selected: notSelected,
                    answers: answers,
                    action: "check",
                })
                fetch(`/api/step-item/choice/${stepId}/`, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        "X-CSRFToken": csrftoken
                    },
                }).then(response => response.json()
                ).then(data => {
                    print('data', data)

                    const $attemptMessage = customCheckbox.querySelector('.attempt__message')
                    if (data['solved']) {
                        $attemptMessage.innerHTML = this.getTemplateRes(true)
                        const $menuChoice = this.getMenuItem('choice', stepId)
                        if ($menuChoice) {
                            $menuChoice.dataset.points = data['points']
                            $menuChoice.dataset.solved = 'true'
                            const $path = $menuChoice.querySelector('path')
                            $path.style.fill = colors.blue

                            // заморозити
                            this.toggleFrozen(stepId)
                        }
                    } else {
                        $attemptMessage.innerHTML = this.getTemplateRes(false)
                    }
                })
            } else {
                alert('Ти не вибрав жодного елемента')
            }
        }
        taskCheck.appendChild(btnSubmit)
        taskCheck.appendChild(btnCheckedAgain)
        fieldset.appendChild(taskCheck)
        stepInner.appendChild(customCheckbox)

    this.$theory.appendChild(stepInner)
    // перемістити вниз після додавання чеків
    const $menuItem = this.getMenuItem(type, id)
    if ($menuItem.dataset.solved === 'true') {
        this.toggleFrozen(id)
    }

    if (this.activeTheoryItem) {
        this.activeTheoryItem.classList.add('hide')
    }
    this.activeTheoryItem = stepInner
}


export default stepsContent