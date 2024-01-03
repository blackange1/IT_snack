import getCookie from '../tools.js'
import colors from '../vars.js'
import stepsContent from './lesson-content-steps.js'

let print = console.log
const menuSteps = {
    root: undefined,
    maxSteps: 15,
    activeElement: undefined,
    numberLesson: undefined,
    init(numberLesson) {
        if (!this.root) {
            // stepsContent.init(this)
            stepsContent.init()
            this.root = document.getElementById('steps')
        } else {
            this.root.innerHTML = ''
        }
        this.numberLesson = numberLesson
    },
    addEmptyElement(order) {
        const div = document.createElement('div')
        div.classList.add('step')
        div.classList.add('step-next')
        if (order % 2) {
            div.classList.add('step-bottom')
        }
        div.innerHTML = `
                <svg width="11.5256mm" height="9.9814596mm" viewBox="0 0 11.5256 9.9814596">
                    <g transform="translate(-47.980416,-108.30979)">
                        <path style="fill:#292c31;fill-opacity:1;stroke:none;stroke-width:0.147642;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 47.980416,113.30052 2.8814,-4.99073 h 5.7628 l 1.46806,2.54274 1.41334,2.44799 -1.4649,2.53729 -1.4165,2.45344 h -5.7628 z"></path>
                    </g>
                </svg>
            `
        this.root.appendChild(div)
    },
    // updateElement(menuItem, points=1) {
    updateElement(menuItem, attributes) {
        for (const [key, value] of Object.entries(attributes)) {
            menuItem.setAttribute(`data-${key}`, value)
        }
        // menuItem.dataset.points = points
        const $path = menuItem.querySelector('path')
        $path.style.fill = colors.blue
    },
    addElement(lesson, order) {
        const type = lesson.type
        const id = lesson.id
        const points = lesson.points
        let bgColor = colors.grey
        if (points) {
            bgColor = colors.blue
        }
        const div = document.createElement('div')
        div.classList.add('step')
        div.classList.add('step-next')
        if (order % 2) {
            div.classList.add('step-bottom')
        }
        const step = document.createElement('a')
        // step.setAttribute('href', `?type=${type}&id=${id}`)
        step.classList.add('step-link')

        // step.dataset.type = type
        // step.dataset.id = id
        // step.dataset.points = points
        for (const [key, value] of Object.entries(lesson)) {
            step.setAttribute(`data-${key}`, value)
        }
        switch (type) {
            // add type video
            case 'text':
                step.innerHTML = `
                    <svg width="11.5256mm" height="9.9814596mm" viewBox="0 0 11.5256 9.9814596">
                        <g transform="translate(-47.980416,-108.30979)">
                            <path style="fill:${bgColor};fill-opacity:1;stroke:none;stroke-width:0.147642;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 47.980416,113.30052 2.8814,-4.99073 h 5.7628 l 1.46806,2.54274 1.41334,2.44799 -1.4649,2.53729 -1.4165,2.45344 h -5.7628 z"></path>
                        </g>
                    </svg>
                `
                break
            case 'choice':
                step.innerHTML = `
                    <svg width="11.5256mm" height="9.9814596mm" viewBox="0 0 11.5256 9.9814596">
                        <g transform="translate(-47.980416,-108.30979)">
                            <path style="fill:${bgColor};fill-opacity:1;stroke:none;stroke-width:0.147642;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 47.980416,113.30052 2.8814,-4.99073 h 5.7628 l 1.46806,2.54274 1.41334,2.44799 -1.4649,2.53729 -1.4165,2.45344 h -5.7628 z"></path>
                                <text style="font-size:8.25679px;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:26.0056;stroke-linejoin:round" x="51.473404" y="116.30611">
                                    <tspan style="fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:26.0056" x="51.473404" y="116.30611">?</tspan>
                                </text>
                        </g>
                    </svg>
                `
                break
            case 'code':
                step.innerHTML = `
                    <svg width="11.5256mm" height="9.9814596mm" viewBox="0 0 11.5256 9.9814596">
                        <g transform="translate(-47.980416,-108.30979)">
                            <path style="fill:${bgColor};fill-opacity:1;stroke:none;stroke-width:0.147642;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 47.980416,113.30052 2.8814,-4.99073 h 5.7628 l 1.46806,2.54274 1.41334,2.44799 -1.4649,2.53729 -1.4165,2.45344 h -5.7628 z"></path>
                            <path style="fill:#232529;fill-opacity:1;stroke:#ffffff;stroke-width:0.4;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 50.181306,113.30052 1.780955,-3.0847 h 3.561909 l 0.907385,1.57163 0.87357,1.51307 -0.905438,1.56826 -0.875517,1.51644 h -3.561909 z"></path>
                            <path style="fill:#232529;fill-opacity:1;stroke:#ffffff;stroke-width:0.292629;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 51.936422,114.85288 h 3.680146"></path>
                            <path style="fill:#232529;fill-opacity:1;stroke:#ffffff;stroke-width:0.292629;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 51.936422,114.02244 1.281091,-0.95347"></path>
                            <path style="fill:#232529;fill-opacity:1;stroke:#ffffff;stroke-width:0.292629;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 51.936422,112.1155 1.281091,0.95347"></path>
                        </g>
                    </svg>
                `
                break
        }
        div.appendChild(step)
        // obj = this
        // const step = div.querySelector('a')
        step.onclick = function (event) {
            event.preventDefault();
            stepsContent.renderContent(type, id)
            switch (type) {
                case 'text':
                    if (this.dataset.points === '0') {
                        print('type', type)

                        // menuSteps.setPoint["text"](this, id)
                        const csrftoken = getCookie('csrftoken');
                        fetch(`/api/step-item/text/${id}/?format=json`, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json, text/plain, */*',
                                'Content-Type': 'application/json',
                                "X-CSRFToken": csrftoken
                            },
                            body: JSON.stringify({})
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.status === 'ok') {
                                    menuSteps.updateElement(this, { 'points': 1 })
                                }
                            })
                    }
                    break
                case 'choice':
                    print('choice')
                    break
            }

            if (menuSteps.activeElement === this) {
                return
            }
            menuSteps.changeStep(this, true)
            if (menuSteps.activeElement) {
                menuSteps.changeStep(menuSteps.activeElement, false)
            }
            menuSteps.activeElement = this
        }

        this.root.appendChild(div)
    },
    changeStep(obj, activate) {
        // active: bool | True - activate, false - deactivate
        let bgColor = obj.dataset.points > 0 ? colors.blue : colors.grey

        const $path = obj.querySelector('path')
        let style = `fill:${bgColor};`
        let d = ''
        if (activate) {
            style = style + `fill-opacity:1;stroke:${colors.orange};stroke-width:0.908896;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1`
            d = "m 48.505164,113.30029 2.618892,-4.53605 h 5.237786 l 1.334314,2.31109 1.28458,2.22496 -1.331442,2.30614 -1.287452,2.22991 h -5.237786 z"
        } else {
            style = style + 'fill-opacity:1;stroke:none;stroke-width:0.147642;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1'
            d = "m 47.980416,113.30052 2.8814,-4.99073 h 5.7628 l 1.46806,2.54274 1.41334,2.44799 -1.4649,2.53729 -1.4165,2.45344 h -5.7628 z"
        }
        $path.setAttribute('style', style)
        $path.setAttribute('d', d)
    },
    renderMenuStep(lessons) {
        let countSteps = 0
        let order = 0
        for (const lesson of lessons) {
            // this.addElement(lesson.type, lesson.id, lesson.points, order)
            this.addElement(lesson, order)
            order++
            countSteps++
        }
        while (countSteps < this.maxSteps) {
            this.addEmptyElement(order)
            order++
            countSteps++
        }
        const $a = this.root.querySelector('a')
        if ($a) {
            $a.click()
        }
    },
    run() {
        fetch(`/api/step-menu/${this.numberLesson}?format=json`)
            .then(response => response.json())
            .then(lessons => {
                print('lessons', lessons)
                menuSteps.renderMenuStep(lessons)
            })
    }
}

export default menuSteps