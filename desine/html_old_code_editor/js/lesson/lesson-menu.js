document.addEventListener("DOMContentLoaded", function () {
    let print = console.log

    let $stepActive = undefined
    let $steps = document.getElementById('steps').querySelectorAll('a');

    const changeStep = (obj, activate) => {
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
            d="m 48.505164,113.30029 2.618892,-4.53605 h 5.237786 l 1.334314,2.31109 1.28458,2.22496 -1.331442,2.30614 -1.287452,2.22991 h -5.237786 z"
        } else {
            style = style + 'fill-opacity:1;stroke:none;stroke-width:0.147642;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1'
            d="m 47.980416,113.30052 2.8814,-4.99073 h 5.7628 l 1.46806,2.54274 1.41334,2.44799 -1.4649,2.53729 -1.4165,2.45344 h -5.7628 z"
        }
        $path.setAttribute('style', style)
        $path.setAttribute('d', d)
    }

    for (const $step of $steps) {
        $step.onclick = function (event) {
            event.preventDefault();
            if ($stepActive == this) {
                return
            }
            changeStep(this, true)
            if ($stepActive) {
                changeStep($stepActive, false)
            }
            $stepActive = this
        }
    }
    
    $steps[0].click()
});