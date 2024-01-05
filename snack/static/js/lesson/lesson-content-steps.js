import getCookie from '../tools.js'
import colors from '../vars.js'
import stepsContent from './lesson-content-steps-choice-multi.js'

let print = console.log
// carcass => choice => choice-multi

stepsContent.renderContent = function (type, id) {
    print("type, id =>", type, id)
    const div = document.getElementById(type + id)
    if (div) {
        this.activeTheoryItem.classList.add('hide')
        div.classList.remove('hide')
        this.activeTheoryItem = div
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
}

export default stepsContent