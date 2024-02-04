import {printf} from '../tools.js'
import stepsContent from './content-steps-code.js'

// carcass => choice => choice-multi => code
stepsContent.renderContent = function (type, id) {
    printf(`stepsContent.renderContent(type: ${type}, id:${id})`, 'yellow')
    const div = document.getElementById(type + id)
    if (div) {
        this.activeTheoryItem.classList.add('hide')
        div.classList.remove('hide')
        this.activeTheoryItem = div
    } else {
        printf(`=> GET /api/step-item/${type}/${id}`, "green")
        fetch(`/api/step-item/${type}/${id}/?format=json`)
            .then(response => response.json())
            .then(step => {
                switch (type) {
                    case 'text':
                        this.renderText(step, id)
                        break
                    case 'choice':
                        this.renderChoice(step, id)
                        break
                    case 'choice_multi':
                        this.renderChoiceMulti(step, id)
                        break
                    case 'code':
                        this.renderCode(step, id)
                        break
                }
                //TODO: запускати лише в необхідних місцях
                hljs.highlightAll()
                console.warn('fetch_step', step)
                // menuSteps.renderMenuStep(lessons)
            })
    }
}

export default stepsContent