import getCookie from '../tools.js'
import colors from '../vars.js'
let print = console.log


function getTextPoints(num) {
    const nn = num % 100
    if (nn >= 11 && nn <= 19) {
        return `${num} балів`
    }
    const n = nn % 10
    if (n === 1) {
        return `${num} бал`
    }
    if (n >= 2 && n <= 4) {
        return `${num} бали`
    }
    return `${num} балів`
}

const stepsContent = {
    $theory: undefined,
    $menuSteps: document.getElementById('steps'),
    $stepContent: document.querySelector('.step-content'),
    activeTeoryIttem: undefined,
    // menuSteps: undefined,
    // steps: [],
    init() {
        this.$theory = document.querySelector('.step-content')
        // this.menuSteps = menuSteps
    },
    createElement(nameElement, cssClass) {
        const elem = document.createElement(nameElement)
        elem.setAttribute('class', cssClass)
        return elem
    },
    renderContent(type, id) {
        print("type, id =>", type, id)
        const div = document.getElementById(type + id)
        if (div) {
            this.activeTeoryIttem.classList.add('hide')
            div.classList.remove('hide')
            this.activeTeoryIttem = div
        } else {
            fetch(`/api/step-item/${type}/${id}/?format=json`)
                .then(response => response.json())
                .then(step => {
                    switch (type) {
                        case 'text':
                            this.renderText(step, type, id)
                            break
                        case 'choice':
                            this.renderChoice(step, type, id)
                            break
                    }
                    print('fetch_step', step)
                    // menuSteps.renderMenuStep(lessons)
                })
        }
    },
    // https://learn.javascript.ru/decorators
    renderText(step, type, id) {
        const stepInner = this.createElement('div', 'step-inner')
        stepInner.setAttribute('id', type + id)
        stepInner.innerHTML = `
            5.1 Задача на программирование: основная информация 11 з 14 кроків пройдено 0 з 3 бали отримано
            <hr>
            ${step.text_html}
        `
        this.$theory.appendChild(stepInner)
        if (this.activeTeoryIttem) {
            this.activeTeoryIttem.classList.add('hide')
        }
        this.activeTeoryIttem = stepInner
    },
    renderChoice(step, type, id) {
        const stepInner = document.createElement('div')
        stepInner.classList.add('step-inner')
        stepInner.setAttribute('id', type + id)
        stepInner.innerHTML = `
            5.1 Задача на программирование: основная информация 11 з 14 кроків пройдено 0 з 3 бали отримано
            <hr>
            ${step.text_html}
        `

        if (step.is_multiple_choice) {
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
                <div class="task__points">${getTextPoints(step.points)} за розв’язок.</div>
            `
            const btnSubmit = this.createElement('button', 'button button-primary')
            btnSubmit.setAttribute('type', 'submit')
            btnSubmit.textContent = 'Надіслати'

            const btnChecedAgain = this.createElement('div', 'button button-secondary button-checed-again hide')
            btnChecedAgain.textContent = "Розв'язати знову"
            btnChecedAgain.onclick = () => {
                // розморозити
                this.toggleFrozen(id)
                print('btnChecedAgain.onclick')
            }

            customCheckbox.onsubmit = (event) => {
                event.preventDefault()
                const $checkboxAnsvers = customCheckbox.querySelectorAll('input[type="checkbox"]:checked')
                print('$checkboxAnsvers', $checkboxAnsvers)
                if ($checkboxAnsvers.length) {
                    // FIXED
                    const selected = []
                    // for (const $checkboxAnsver of $checkboxAnsvers) {
                    //     selected.push(+$checkboxAnsver.dataset.id)
                    // }
                    // const notSelected = []
                    // for (const $checkboxAnsver of customCheckbox.querySelectorAll('input[type="checkbox"]')) {
                    //     const id = +$checkboxAnsver.dataset.id
                    //     if (!selected.includes(id)) {
                    //         notSelected.push(id)
                    //     }
                    // }
                    const ansvers = []
                    for (const $checkboxAnsver of customCheckbox.querySelectorAll('input[type="checkbox"]')) {
                        ansvers.push(+$checkboxAnsver.dataset.id)
                        selected.push(+$checkboxAnsver.checked)
                    }

                    const csrftoken = getCookie('csrftoken')
                    const stepId = customCheckbox.dataset.id
                    const data = JSON.stringify({
                        selected: selected,
                        // not_selected: notSelected,
                        ansvers: ansvers,
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
                                $menuChoice.dataset.solved = true
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
            taskCheck.appendChild(btnChecedAgain)
            fieldset.appendChild(taskCheck)
            stepInner.appendChild(customCheckbox)


        } else {
            const customRadio = this.createElement('form', 'lesson-form custom-radio')
            customRadio.setAttribute('data-id', id)

            const fieldset = document.createElement('fieldset')
            const legend = this.createElement('legend', 'task__title')
            legend.textContent = "Виберіть один варіант зі списку"

            customRadio.appendChild(fieldset)
            fieldset.appendChild(legend)
            fieldset.appendChild(this.createElement('div', 'attempt__message'))

            for (const answer of step.answers) {
                const label = this.createElement('label', 'custom-radio__label')
                label.innerHTML = `
                    <input type="radio" name="answer${step.id}" id="answer${answer.id}" data-id="${answer.id}">
                    <span class="custom-radio__text">${answer.text}</span>
                `
                fieldset.appendChild(label)
            }
            const taskCheck = this.createElement('div', 'task__check')
            taskCheck.innerHTML = `
                <div class="task__points">${getTextPoints(step.points)} за розв’язок.</div>
            `
            const btnSubmit = this.createElement('button', 'button button-primary')

            btnSubmit.setAttribute('type', 'submit')
            btnSubmit.textContent = 'Надіслати'

            const btnChecedAgain = this.createElement('div', 'button button-secondary button-checed-again hide')
            btnChecedAgain.textContent = "Розв'язати знову"
            btnChecedAgain.onclick = () => {
                // розморозити
                this.toggleFrozen(id)
                print('btnChecedAgain.onclick')
            }

            // customRadio.onsubmit = async (event) => {
            customRadio.onsubmit = (event) => {
                event.preventDefault();
                const $radioAnsver = customRadio.querySelector('input[type="radio"]:checked')
                if ($radioAnsver) {
                    print('$radioAnsver', $radioAnsver)
                    const csrftoken = getCookie('csrftoken')
                    const stepId = customRadio.dataset.id
                    const data = JSON.stringify({
                        selected: +$radioAnsver.dataset.id,
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
                        // $stepMenuItem = document.querySelector('')
                        const $attemptMessage = customRadio.querySelector('.attempt__message')
                        // FIXED
                        if (data['solved']) {
                            $attemptMessage.innerHTML = this.getTemplateRes(true)
                            const $menuChoice = this.getMenuItem('choice', stepId)

                            if ($menuChoice) {
                                $menuChoice.dataset.points = data['points']
                                $menuChoice.dataset.solved = true
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
            taskCheck.appendChild(btnChecedAgain)


            // customRadio.appendChild(taskCheck)
            // stepInner.appendChild(customRadio)

            fieldset.appendChild(taskCheck)
            customRadio.appendChild(fieldset)
            stepInner.appendChild(customRadio)

        }
        this.$theory.appendChild(stepInner)
        // перемістити вниз після додавання чеків
        const $menuItem = this.getMenuItem(type, id)
        if ($menuItem.dataset.solved === 'true') {
            this.toggleFrozen(id)
        }


        if (this.activeTeoryIttem) {
            this.activeTeoryIttem.classList.add('hide')
        }
        this.activeTeoryIttem = stepInner
    },
    toggleFrozen(id) {
        const $form = this.$stepContent.querySelector(`form[data-id="${id}"]`)
        $form.classList.toggle('form-disabled')
        const $fieldset = $form.querySelector('fieldset')
        $fieldset.toggleAttribute("disabled")
        $fieldset.classList.toggle('form__fieldset')
        $fieldset.querySelector('.button-checed-again').classList.toggle('hide')
    },
    getMenuItem(type, stepId) {
        const menuChoices = stepsContent.$menuSteps.querySelectorAll(`a[data-type="${type}"]`)
        print('a', menuChoices)
        for (const menuChoice of menuChoices) {
            if (menuChoice.dataset.id == stepId) {
                return menuChoice
            }
        }
    },
    getTemplateRes(isTrue) {
        if (isTrue) {
            // додати молодець, так тримати
            return 'V Відмінно!'
        } else {
            return 'X Хибно!'
        }
    },
    // wrongAnswer() {},
}

export default stepsContent