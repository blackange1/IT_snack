document.addEventListener("DOMContentLoaded", function () {
    let print = console.log
    const menuSteps = {
        root: document.getElementById('steps'),
        maxSteps: 15,
        activeElement: undefined,
        // listA: undefined,
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
        addElement(type, id, order, solved = false) {
            let bgColor = '#605f62'
            if (solved) {
                bgColor = '#235ecd'
            }
            const div = document.createElement('div')
            div.classList.add('step')
            div.classList.add('step-next')
            if (order % 2) {
                div.classList.add('step-bottom')
            }

            switch (type) {
                // add type video
                case 'text':
                    div.innerHTML = `
                        <a href="?type=${type}&id=${id}" data-solved="${+solved}">
                            <svg width="11.5256mm" height="9.9814596mm" viewBox="0 0 11.5256 9.9814596">
                                <g transform="translate(-47.980416,-108.30979)">
                                    <path style="fill:${bgColor};fill-opacity:1;stroke:none;stroke-width:0.147642;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 47.980416,113.30052 2.8814,-4.99073 h 5.7628 l 1.46806,2.54274 1.41334,2.44799 -1.4649,2.53729 -1.4165,2.45344 h -5.7628 z"></path>
                                </g>
                            </svg>
                        </a>
                    `
                    break
                case 'choice':
                    div.innerHTML = `
                        <a href="?type=${type}&id=${id}" data-solved="${+solved}">
                            <svg width="11.5256mm" height="9.9814596mm" viewBox="0 0 11.5256 9.9814596">
                                <g transform="translate(-47.980416,-108.30979)">
                                    <path style="fill:${bgColor};fill-opacity:1;stroke:none;stroke-width:0.147642;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 47.980416,113.30052 2.8814,-4.99073 h 5.7628 l 1.46806,2.54274 1.41334,2.44799 -1.4649,2.53729 -1.4165,2.45344 h -5.7628 z"></path>
                                    <text style="font-size:8.25679px;font-family:Arial;-inkscape-font-specification:Arial;fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:26.0056;stroke-linejoin:round" x="51.473404" y="116.30611">
                                        <tspan style="fill:#ffffff;fill-opacity:1;stroke:none;stroke-width:26.0056" x="51.473404" y="116.30611">?
                                        </tspan>
                                    </text>
                                </g>
                            </svg>
                        </a>
                    `
                    break
                case 'code':
                    div.innerHTML = `
                        <a href="?type=${type}&id=${id}" data-solved="${+solved}">
                            <svg width="11.5256mm" height="9.9814596mm" viewBox="0 0 11.5256 9.9814596">
                                <g transform="translate(-47.980416,-108.30979)">
                                    <path style="fill:${bgColor};fill-opacity:1;stroke:none;stroke-width:0.147642;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 47.980416,113.30052 2.8814,-4.99073 h 5.7628 l 1.46806,2.54274 1.41334,2.44799 -1.4649,2.53729 -1.4165,2.45344 h -5.7628 z"></path>
                                    <path style="fill:#232529;fill-opacity:1;stroke:#ffffff;stroke-width:0.4;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 50.181306,113.30052 1.780955,-3.0847 h 3.561909 l 0.907385,1.57163 0.87357,1.51307 -0.905438,1.56826 -0.875517,1.51644 h -3.561909 z"></path>
                                    <path style="fill:#232529;fill-opacity:1;stroke:#ffffff;stroke-width:0.292629;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 51.936422,114.85288 h 3.680146"></path>
                                    <path style="fill:#232529;fill-opacity:1;stroke:#ffffff;stroke-width:0.292629;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 51.936422,114.02244 1.281091,-0.95347"></path>
                                    <path style="fill:#232529;fill-opacity:1;stroke:#ffffff;stroke-width:0.292629;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="m 51.936422,112.1155 1.281091,0.95347"></path>
                                </g>
                            </svg>
                        </a>
                    `
                    break

            }
            // obj = this
            step = div.querySelector('a')
            step.onclick = function (event) {
                event.preventDefault();
                print(this)
                print(menuSteps)
                
                print(menuSteps.activeElement == this)
                if (menuSteps.activeElement == this) {
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
            let bgColor = '#605f62'
            if (obj.dataset.solved == "1") {
                bgColor = '#235ecd'
            }
            const $path = obj.querySelector('path')
            let style = `fill:${bgColor};`
            let d = ''
            if (activate) {
                style = style + 'fill-opacity:1;stroke:#ffbd00;stroke-width:0.908896;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1'
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
            order = 0
            for (const lesson of lessons) {
                this.addElement(lesson.type, lesson.id, order, solved = false,)
                order++
                countSteps++
            }
            while (countSteps < this.maxSteps) {
                this.addEmptyElement(order)
                order++
                countSteps++
            }
            this.root.querySelector('a').click()
        },
    }


    let numberLesson = 3
    // FWXED delete step-next class first elemet
    // let $steps = document.getElementById('steps')
    // print($steps)
    fetch(`/api/step-menu/${numberLesson}?format=json`)
        .then(response => response.json())
        .then(lessons => {
            print('lessons', lessons)
            menuSteps.renderMenuStep(lessons)
        })


    // let $stepActive = undefined
    // arrSteps = document.getElementById('steps').querySelectorAll('a');
    // print('arrSteps', arrSteps)

    // const changeStep = (obj, activate) => {
    //     // active: bool | True - activate, false - deactivate
    //     let bgColor = '#605f62'
    //     if (obj.dataset.solved == "1") {
    //         bgColor = '#235ecd'
    //     }
    //     const $path = obj.querySelector('path')
    //     let style = `fill:${bgColor};`
    //     let d = ''
    //     if (activate) {
    //         style = style + 'fill-opacity:1;stroke:#ffbd00;stroke-width:0.908896;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1'
    //         d = "m 48.505164,113.30029 2.618892,-4.53605 h 5.237786 l 1.334314,2.31109 1.28458,2.22496 -1.331442,2.30614 -1.287452,2.22991 h -5.237786 z"
    //     } else {
    //         style = style + 'fill-opacity:1;stroke:none;stroke-width:0.147642;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1'
    //         d = "m 47.980416,113.30052 2.8814,-4.99073 h 5.7628 l 1.46806,2.54274 1.41334,2.44799 -1.4649,2.53729 -1.4165,2.45344 h -5.7628 z"
    //     }
    //     $path.setAttribute('style', style)
    //     $path.setAttribute('d', d)
    // }

    // for (const $step of arrSteps) {
    //     $step.onclick = function (event) {
    //         event.preventDefault();
    //         if ($stepActive == this) {
    //             return
    //         }
    //         changeStep(this, true)
    //         if ($stepActive) {
    //             changeStep($stepActive, false)
    //         }
    //         $stepActive = this
    //     }
    // }

    // arrSteps[0].click()
});