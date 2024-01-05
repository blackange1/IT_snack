import getCookie from '../tools.js'
import colors from '../vars.js'

let print = console.log


const stepsContent = {
    $theory: undefined,
    $menuSteps: document.getElementById('steps'),
    $stepContent: document.querySelector('.step-content'),
    activeTheoryItem: undefined,
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
        if (this.activeTheoryItem) {
            this.activeTheoryItem.classList.add('hide')
        }
        this.activeTheoryItem = stepInner
    },
    toggleFrozen(id, result='') {
        const $form = this.$stepContent.querySelector(`form[data-id="${id}"]`)
        const $btnCheckedAgain = $form.querySelector('.button-checked-again')
        $btnCheckedAgain.classList.toggle('hide')
        if (result) {
            $form.dataset.result = result
            // const $attemptMessage = $form.querySelector('.attempt__message')
            const message = (result === '1') ? '<i class="fa fa-check"></i> Відмінно!' : '<i class="fa fa-crosshairs"></i> Хибно!'
            const titleButton = (result === '1') ? "Розв’язати знову" : "Спробувати ще раз"
            $form.querySelector('.attempt__message').innerHTML = message
            $btnCheckedAgain.innerHTML = titleButton
        } else {
            $form.querySelector('.attempt__message').innerHTML = ''
        }
        // Розв’язати знову
        // Спробувати ще раз
        $form.classList.toggle('form-disabled')
        const cssClass = (Boolean(+$form.dataset.result)) ? 'form__fieldset-true': 'form__fieldset-wrong'
        const $fieldset = $form.querySelector('fieldset')
        $fieldset.toggleAttribute("disabled")
        $fieldset.classList.toggle(cssClass)
        $fieldset.querySelector('button[type="submit"]').classList.toggle('hide')
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
    // getTemplateRes(isTrue) {
    //     if (isTrue) {
    //         // додати молодець, так тримати
    //         return 'V Відмінно!'
    //     } else {
    //         return 'X Хибно!'
    //     }
    // },
    // wrongAnswer() {},
    getTextPoints(num) {
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
}

export default stepsContent