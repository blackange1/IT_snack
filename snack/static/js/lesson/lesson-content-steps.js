import getCookie from '../tools.js'
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
    activeTeoryIttem: undefined,
    // steps: [],
    inti() {
        this.$theory = document.querySelector('.step-content')
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
            const customRadio = document.createElement('div')
            const taskTitle = this.createElement('p', 'task__title')
            taskTitle.textContent = "Виберіть декілька відповідей"
            customRadio.appendChild(taskTitle)
            for (const answer of step.answers) {
                const label = this.createElement('label', 'container')
                label.innerHTML = `
                    <input type="checkbox" id="answer${answer.id}">
                    <span class="checkmark"></span>${answer.text}
                `
                customRadio.appendChild(label)
            }
            const taskCheck = this.createElement('div', 'task__check')
            taskCheck.innerHTML = `
                <div class="task__points">${getTextPoints(step.points)} за розв’язок.</div>
                <button type="button" class="button button-primary">Надіслати</button>
            `
            customRadio.appendChild(taskCheck)
            stepInner.appendChild(customRadio)
        } else {
            const customRadio = this.createElement('form', 'custom-radio')
            customRadio.setAttribute('data-id', id)
            // const customRadio = this.createElement('form', 'custom-radio')
            // customRadio.setAttribute('action', `/api/step-item/choice/1/`)
            customRadio.setAttribute('method', 'POST')
            const taskTitle = this.createElement('p', 'task__title')
            taskTitle.textContent = "Виберіть один варіант зі списку"
            customRadio.appendChild(taskTitle)
            for (const answer of step.answers) {
                const label = this.createElement('label', 'custom-radio__label')
                label.innerHTML = `
                    <input type="radio" name="answer${step.id}" id="answer${answer.id}" data-id="${answer.id}">
                    <span class="custom-radio__text">${answer.text}</span>
                `
                customRadio.appendChild(label)
            }
            const taskCheck = this.createElement('div', 'task__check')
            taskCheck.innerHTML = `
                <div class="task__points">${getTextPoints(step.points)} за розв’язок.</div>
            `
            const submit = this.createElement('button', 'button button-primary')

            submit.setAttribute('type', 'submit')
            submit.textContent = 'Надіслати'

            customRadio.onsubmit = async (event) => {
                event.preventDefault();
                const $radioAnsver = customRadio.querySelector('input[type="radio"]:checked')
                if ($radioAnsver) {
                    print('$radioAnsver', $radioAnsver)
                    const csrftoken = getCookie('csrftoken');
                    const data = JSON.stringify({
                        action: "check",
                        selected: $radioAnsver.dataset.id,
                        // FIXED
                    })
                    const stepId = customRadio.dataset.id
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
                    })
                } else {
                    alert('Ти не вибрав жодного елемента')
                }

            }

            taskCheck.appendChild(submit)
            customRadio.appendChild(taskCheck)
            stepInner.appendChild(customRadio)
        }


        this.$theory.appendChild(stepInner)
        if (this.activeTeoryIttem) {
            this.activeTeoryIttem.classList.add('hide')
        }
        this.activeTeoryIttem = stepInner
    },
}

export default stepsContent