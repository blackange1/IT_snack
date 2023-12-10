let print = console.log
const stepsContent = {
    $theory: undefined,
    activeTeoryIttem: undefined,
    // steps: [],
    inti() {
        this.$theory = document.querySelector('.step-content')
    },
    renderContent(type, id) {
        print(type, id)
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
                    print('fetch step', step)
                    // menuSteps.renderMenuStep(lessons)
                })
        }
    },
    // https://learn.javascript.ru/decorators
    renderText(step, type, id) {
        const div = document.createElement('div')
        div.classList.add('step-inner')
        div.setAttribute('id', type + id)
        div.innerHTML = `
            5.1 Задача на программирование: основная информация 11 з 14 кроків пройдено 0 з 3 бали отримано
            <hr>
            ${step.text_html}
        `
        this.$theory.appendChild(div)
        if (this.activeTeoryIttem) {
            this.activeTeoryIttem.classList.add('hide')
        }
        this.activeTeoryIttem = div
    },
    renderChoice(step, type, id) {
        const div = document.createElement('div')
        div.classList.add('step-inner')
        div.setAttribute('id', type + id)
        div.innerHTML = `
            5.1 Задача на программирование: основная информация 11 з 14 кроків пройдено 0 з 3 бали отримано
            <hr>
            ${step.text_html}
        `
        this.$theory.appendChild(div)
        if (this.activeTeoryIttem) {
            this.activeTeoryIttem.classList.add('hide')
        }
        this.activeTeoryIttem = div
    },
}

export default stepsContent