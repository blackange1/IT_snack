import {printFun, printReq} from "../tools.js";


const stepsContent = {
    $theory: undefined,
    $menuSteps: document.getElementById('steps'),
    $stepContent: document.querySelector('.step-content'),
    activeTheoryItem: undefined,
    // menuSteps: undefined,
    // steps: [],
    init() {
        printFun('stepsContent.init()')
        this.$theory = document.querySelector('.step-content')
        // this.menuSteps = menuSteps
    },
    createElement(nameElement, data, content = '', isHTML = false) {
        const elem = document.createElement(nameElement)
        // data is cssClass or objectAttribute
        if (typeof data === 'string') {
            elem.setAttribute('class', data)
        } else {
            for (const key in data) {
                elem.setAttribute(key, data[key])
            }
        }
        if (content) {
            if (isHTML) {
                elem.innerHTML = content
            } else {
                elem.textContent = content
            }
        }
        return elem
    },
    // https://learn.javascript.ru/decorators
    renderText(step, id) {
        printFun(`stepsContent.renderText(step: ..., id: ${id})`, step)
        const stepInner = this.createElement('div', 'step-inner')
        stepInner.setAttribute('id', 'text' + id)
        stepInner.innerHTML = `
            5.1 Задача на программирование: основная информация 11 з 14 кроків пройдено 0 з 3 бали отримано
            <hr>
            ${step["text_html"]}
        `
        this.$theory.appendChild(stepInner)
        if (this.activeTheoryItem) {
            this.activeTheoryItem.classList.add('hide')
        }
        this.activeTheoryItem = stepInner
    },
    toggleFrozen(mainForm, result = '', isMessage = true, type = '') {
        // const $form = this.$stepContent.querySelector(`form[data-id="${id}"]`)
        const $form = mainForm
        const $btnCheckedAgain = $form.querySelector('.button-checked-again')
        $btnCheckedAgain.classList.toggle('hide')
        if (result) {
            $form.dataset.result = result
            // const $attemptMessage = $form.querySelector('.attempt__message')
            if (isMessage) {
                // додати привітальні фрази
                $form.querySelector('.attempt__message').innerHTML = (result === '1') ? '<i class="fa fa-check"></i> Відмінно!' : '<i class="fa fa-crosshairs"></i> Хибно!'
            }
            $btnCheckedAgain.innerHTML = (result === '1') ? "Розв’язати знову" : "Спробувати ще раз"
        } else {
            $form.querySelector('.attempt__message').innerHTML = ''
        }
        // Розв’язати знову
        // Спробувати ще раз
        $form.classList.toggle('form-disabled')
        let cssClass = ''
        if (type === 'code') {
            cssClass = (Boolean(+$form.dataset.result)) ? 'form__code-true' : 'form__code-wrong'
        } else {
            cssClass = (Boolean(+$form.dataset.result)) ? 'form__fieldset-true' : 'form__fieldset-wrong'
        }
        const $fieldset = $form.querySelector('fieldset')
        $fieldset.toggleAttribute("disabled")
        $fieldset.classList.toggle(cssClass)
        $fieldset.querySelector('button[type="submit"]').classList.toggle('hide')
    },
    getMenuItem(type, stepId) {
        printFun(`stepsContent.getMenuItem(type: ${type}, stepId: ${stepId})`)
        const menuTasks = stepsContent.$menuSteps.querySelectorAll(`a[data-type="${type}"]`)
        for (const menuTask of menuTasks) {
            if (menuTask.dataset.id == stepId) {
                return menuTask
            }
        }
    },

    getTextPoints(num) {
        // const text = (bonusText) ? " за розв'язок" : ''
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
    },
    goToNextStep() {
        const $activeStepMenu = document.getElementById('steps').querySelector('.active')
        const $nextStepMenu = $activeStepMenu.nextElementSibling
        if ($nextStepMenu) {
            const $nextStepMenuLink = $nextStepMenu.querySelector('a')
            if ($nextStepMenuLink) {
                $nextStepMenuLink.click()
                return
            }
        }
        const $lessonActive = document.querySelector('.lesson-active')
        const $nextLesson = $lessonActive.parentElement.nextElementSibling
        if ($nextLesson) {
            $nextLesson.click()
        }
    }
}

export default stepsContent