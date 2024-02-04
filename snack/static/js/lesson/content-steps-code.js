import getCookie, {printf} from '../tools.js'
import colors from '../vars.js'
import stepsContent from "./content-steps-choice-multi.js";



const coefficientProportionality = 0.09257

class CodeEditor {
    constructor(elem, codeText) {
        this.countParagraphs = 0  // 3
        this.spaceParagraphs = {} // {2: 3}  12***3

        elem.innerHTML = `
            <div class="code__wraper">
                <ul class="code__number" data-row="10"></ul>
                <div class="wrapper__usercode">
                    <div class="usercode">
                        <pre><code class="language-python hljs" data-highlighted=""></code></pre>
                        <textarea name="code" class="usercode_main">${codeText}</textarea>
                    </div>
                </div>
            </div>
            `
        const $wrappeUsercode = elem.querySelector('.wrapper__usercode')
        this.$code = $wrappeUsercode.querySelector('code.hljs')
        $wrappeUsercode.style.backgroundColor = window.getComputedStyle(this.$code, null).getPropertyValue('background-color')
        this.maxCountCharsOfLine = Math.floor(this.$code.offsetWidth * coefficientProportionality)
        // this.maxCountCharsOfLine = Math.round(this.$code.offsetWidth * coefficientProportionality)

        this.$textarea = elem.querySelector('textarea')

        // this.$textarea.onclick = () => {
        //     console.log("$textarea.onclick")
        // }

        this.$textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault()
                const selectionStart = this.$textarea.selectionStart
                const selectionEnd = this.$textarea.selectionEnd
                let value = this.$textarea.value
                if (selectionStart === selectionEnd) {
                    this.$textarea.value = value.substring(0, selectionStart) + '    ' + value.substring(selectionStart)
                    this.inputCode()
                    this.$textarea.selectionStart = selectionStart + 4
                    this.$textarea.selectionEnd = selectionStart + 4
                } else {
                    let startParagraph = []
                    let position = selectionStart
                    while (0 < position) {
                        if (value[position] === '\n') {
                            break
                        }
                        position--
                    }
                    startParagraph.push(position)
                    position = selectionStart + 1
                    while (position < selectionEnd) {
                        if (value[position] === '\n') {
                            startParagraph.push(position)
                        }
                        position++
                    }
                    let landslide = 0
                    startParagraph[0] = startParagraph[0] === 0 ? -1 : startParagraph[0]
                    for (const start of startParagraph) {
                        value = value.substring(0, start + landslide + 1) + '    ' + value.substring(start + landslide + 1)
                        landslide += 4
                    }
                    this.$textarea.value = value
                    this.inputCode()
                    this.$textarea.selectionStart = selectionStart + 4
                    this.$textarea.selectionEnd = selectionEnd + landslide
                }
            }
            // if (35 <= e.keyCode && e.keyCode <= 40) {
            //     console.log("e.keyCode", e.keyCode)
            // }
        })

        this.$codeEditorNumber = elem.querySelector('.code__number')
        this.inputCode()

        this.addEventListenerInput()
    }

    appendNumberItem(n) {
        const numberItem = document.createElement('li')
        numberItem.innerHTML = n
        this.$codeEditorNumber.appendChild(numberItem)
    }

    sliceSpace(string) {
        const setTail = new Set(string.slice(this.maxCountCharsOfLine))
        if (setTail.size === 1 && setTail.has(' ')) {
            return string.slice(0, this.maxCountCharsOfLine)
        }
        return string
    }

    calculationLongString(row, i) {
        const string = row[i]
        if (string.length > this.maxCountCharsOfLine) {
            const words = []
            let start = 0
            let preparationClose = false
            for (const index in string) {
                const ch = string[index]
                if (ch === " ") {
                    preparationClose = true
                } else {
                    if (preparationClose) {
                        words.push(string.slice(start, index))
                        start = index
                        preparationClose = false
                    }
                }
            }
            // console.clear()
            words.push(string.slice(start))
            // console.log(words)

            const paragraphs = []
            let line = words[0]
            let index = 1
            while (index < words.length) {
                const word = words[index]
                let newLine = line + word

                // обрізання пробідів
                newLine = this.sliceSpace(newLine)

                if (newLine.length > this.maxCountCharsOfLine) {

                    if (line.slice(this.maxCountCharsOfLine).length) {
                        // перевірка на пробіли
                        line = this.sliceSpace(line)
                        paragraphs.push(line.slice(0, this.maxCountCharsOfLine))
                        line = line.slice(this.maxCountCharsOfLine)
                        continue
                    } else {
                        paragraphs.push(line)
                        line = word
                    }
                } else {
                    line = newLine
                }
                index++
            }
            while (true) {
                if (line.slice(this.maxCountCharsOfLine).length) {
                    line = this.sliceSpace(line)
                    paragraphs.push(line.slice(0, this.maxCountCharsOfLine))
                    line = line.slice(this.maxCountCharsOfLine)
                } else {
                    paragraphs.push(line)
                    break
                }
            }
            // console.log(paragraphs)
            this.spaceParagraphs[i + 1] = paragraphs.length - 1
        }
    }

    inputCode() {
        this.$code.innerHTML = hljs.highlight(this.$textarea.value, {language: 'python'}).value
        const code = this.$textarea.value
        let row = code.split('\n')
        const oldCountParagraphs = this.countParagraphs
        const oldSpaceParagraphs = this.spaceParagraphs
        this.countParagraphs = 0
        this.spaceParagraphs = {}

        const rewLength = row.length

        for (let i = 0; i < rewLength; i++) {
            this.calculationLongString(row, i)
            this.countParagraphs++
        }
        // console.log(this.countParagraphs, oldCountParagraphs)
        // console.log(this.spaceParagraphs, oldSpaceParagraphs)
        // console.log(JSON.stringify(this.spaceParagraphs) !== JSON.stringify(oldSpaceParagraphs))
        // console.log(this.countParagraphs !== oldCountParagraphs)

        if (JSON.stringify(this.spaceParagraphs) !== JSON.stringify(oldSpaceParagraphs) || this.countParagraphs !== oldCountParagraphs) {
            // console.log('RENDER UL')
            this.$codeEditorNumber.innerHTML = ''
            for (let i = 1; i <= this.countParagraphs; i++) {
                this.appendNumberItem(i)
                if (this.spaceParagraphs.hasOwnProperty(i)) {
                    for (let j = 0; j < this.spaceParagraphs[i]; j++) {
                        this.appendNumberItem('<span class="not_color">*</span>')
                    }
                }
            }
        }
    }

    addEventListenerInput() {
        this.$textarea.addEventListener('input', () => {
                this.inputCode()
            }
        )
    }

    clearCode(defaultCode) {
        this.$textarea.value = defaultCode
        this.$code.innerHTML = hljs.highlight(defaultCode, {language: 'python'}).value
        const code = this.$textarea.value
        let row = code.split('\n')
        const oldCountParagraphs = this.countParagraphs
        const oldSpaceParagraphs = this.spaceParagraphs
        this.countParagraphs = 0
        this.spaceParagraphs = {}

        const rewLength = row.length

        for (let i = 0; i < rewLength; i++) {
            this.calculationLongString(row, i)
            this.countParagraphs++
        }
        // console.log(this.countParagraphs, oldCountParagraphs)
        // console.log(this.spaceParagraphs, oldSpaceParagraphs)
        // console.log(JSON.stringify(this.spaceParagraphs) !== JSON.stringify(oldSpaceParagraphs))
        // console.log(this.countParagraphs !== oldCountParagraphs)

        if (JSON.stringify(this.spaceParagraphs) !== JSON.stringify(oldSpaceParagraphs) || this.countParagraphs !== oldCountParagraphs) {
            // console.log('RENDER UL')
            this.$codeEditorNumber.innerHTML = ''
            for (let i = 1; i <= this.countParagraphs; i++) {
                this.appendNumberItem(i)
                if (this.spaceParagraphs.hasOwnProperty(i)) {
                    for (let j = 0; j < this.spaceParagraphs[i]; j++) {
                        this.appendNumberItem('<span class="not_color">*</span>')
                    }
                }
            }
        }
    }

    updateWidth() {
        const $code = this.$code
        this.maxCountCharsOfLine = Math.floor($code.offsetWidth * coefficientProportionality)
        // console.log($code.offsetWidth)
        // console.log(this.maxCountCharsOfLine)
        // console.log(Math.floor($code.offsetWidth * coefficientProportionality))
        this.inputCode()
    }
}

// const codeEditor = new CodeEditor(document.querySelector('.code-editor'), 'class Car(object):\n    def __init__(self, name, year):\n        self.name = name\n        self.year = year\n\n    def show_info(self):\n        console.log(f\'name: {self.name} year:{self.year}\')')
// console.log(codeEditor)
// window.addEventListener("resize", () => {
//     codeEditor.updateWidth()
//     // 100 - 9 == 0.09
//     // 600 - 55 == 0.0916
//     // 806 -
//     // 1000 - 92 == 0.092
//     // 1405 - 130 == 0.09253
//     // 1210 - 112 /111
// })

stepsContent.updateCode = function (step, id) {
    // const $form = document.querySelector(`#choice_multi${id} form`)
    // const wrapperLabel = $form.querySelector('.wrapper_label')
    // wrapperLabel.innerHTML = ''
    // for (const answer of step['answers']) {
    //
    //     const label = this.createElement('label', 'container', `
    //             <input type="checkbox" name="answer${step.id}"  id="answer${answer.id}" data-id="${answer.id}">
    //             <span class="checkmark"></span>${answer.text}`, true)
    //     wrapperLabel.appendChild(label)
    //     wrapperLabel.appendChild(label)
    // }
    // const btnNextStep = $form.querySelector('.button-next-step')
    // if (!btnNextStep.classList.contains('hide')) {
    //     btnNextStep.classList.add('hide')
    // }
}

stepsContent.renderCode = function (step, id) {
    const stepInner = this.createElement('div', {'class': 'step-inner', 'id': 'code' + id}, `
        5.1 Задача на программирование: основная информация 11 з 14 кроків пройдено 0 з 3 бали отримано
        <hr>${step['text_html']}`, true)

    const codeExemple = this.createElement('div', 'code__exemple')
    for (const exemple of step["code_examples"]) {
        const itemExemple = this.createElement('div', 'code__exemple', `
            <span>input:</span>
            <pre><code class="hljs language-plaintext">${exemple[0]}</code></pre>
            <span>output:</span>
            <pre><code class="hljs language-plaintext">${exemple[1]}</code></pre>
        `, true)
        codeExemple.appendChild(itemExemple)
    }
    stepInner.appendChild(codeExemple)

    const $testInfo = this.createElement('div', "test__info hide",
        `<pre><code class="hljs language-plaintext">test-info</code></pre>`, true)
    stepInner.appendChild($testInfo)
    const $testInfoCode = $testInfo.querySelector('code')
    // CREATE FORM
    const mainForm = this.createElement('form', {'class': 'lesson-form', 'data-id': id})

    const fieldset = this.createElement('fieldset', 'fieldset__default')

    mainForm.appendChild(fieldset)
    const repeatTask = step['repeat_task']

    const formFooter = this.createElement('div', 'form__footer')

    if (step['has_progress']) {
        // formFooter.classList.remove('hide')
        formFooter.innerHTML = `
                <a href="#">Розв'язки</a> Ви отримали <span class="student_points">${this.getTextPoints(step['student_points'])}</span> з ${step['points']}
        `
    } else {
        formFooter.innerHTML = `${this.getTextPoints(step.points)} за розв’язок.`
    }

    mainForm.appendChild(fieldset)
    stepInner.appendChild(mainForm)

    this.$theory.appendChild(stepInner)

    const codeEditor = new CodeEditor(fieldset, step["user_code"])
    fieldset.insertBefore(
        this.createElement('div', 'attempt__message'),
        fieldset.firstChild)

    if (repeatTask) {

    } else {
        // fieldset.toggleAttribute("disabled")
    }


    // if (!step['has_progress']) {
    //     taskPoints.classList.remove('hide')
    //     taskPoints.textContent = `${this.getTextPoints(step.points)} за розв’язок.`
    // }
    let firstInput = ''
    if (step.hasOwnProperty('code_examples')) {
        if (step['code_examples'].length > 0) {
            firstInput = step['code_examples'][0][0]
        }
    }

    const $codePrinter = this.createElement("div", "code__console.loger hide")
    $codePrinter.innerHTML = `
        <label for="code_input_${id}" class="test_title">Test input:</label>
            <div class="test__block">
                <textarea id="code_input_${id}" class="block__input" rows="3">${firstInput}</textarea>
            </div>
            <div class="test__footer">
                <div class="footer__title">Test output:</div>
                <div class="footer__output">
<pre><code class="hljs language-plaintext">
</code></pre>
                </div>
            </div>
            `
    fieldset.appendChild($codePrinter)

    // BUTTON
    const $codeCheck = this.createElement('div', 'code__check')
    const $codeButtons = this.createElement('div', 'code_buttons')
    const btnSubmit = this.createElement('button', {'class': 'button button-primary', 'type': 'submit'}, 'Надіслати')
    const btnNextStep = this.createElement('div', 'button button-primary button-next-step hide', 'Наступний крок')
    const btnCheckedAgain = this.createElement('div', 'button button-secondary button-checked-again hide', "btnCheckedAgain")
    const btnRunCode = this.createElement('div', {'class': 'button button-secondary button-run-code'}, 'Запустити')
    $codeButtons.appendChild(btnSubmit)
    $codeButtons.appendChild(btnNextStep)
    $codeButtons.appendChild(btnCheckedAgain)

    $codeCheck.appendChild($codeButtons)
    $codeCheck.appendChild(btnRunCode)

    fieldset.appendChild($codeCheck)

    btnNextStep.onclick = () => {
        console.log('btnNextStep.onclick')
    }

    btnRunCode.onclick = () => {
        if ($codePrinter.classList.contains('hide')) {
            $codePrinter.classList.remove('hide')
            $codePrinter.querySelector(".test__block").appendChild(btnRunCode)
        }
        // console.log(mainForm.querySelector('textarea').value)
        const code = mainForm.querySelector('textarea').value
        const input = mainForm.querySelector('.test__block textarea').value
        // console.log('input', input)
        const csrftoken = getCookie('csrftoken')
        fetch(`/api/step-item/code/${id}/`, {
            method: 'POST',
            body: JSON.stringify({
                run_code: true,
                code: code,
                input: input
            }),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken
            },
        }).then(response => response.json()
        ).then(data => {
            printf(`=> POST:/api/step-item/code/${id}/`, "green")
            console.log('btnRunCode.onclick', data)
            const $footerOutput = mainForm.querySelector('.footer__output pre code')
            const codePrint = data["print"] !== "" ? data["print"] : "¯\\_(ツ)_/¯"
            $footerOutput.textContent = codePrint
            // console.log('$footerOutput', $footerOutput)
            // this.updateCode(data, id)
        })
    }

    btnCheckedAgain.onclick = () => {
        // розморозити
        this.toggleFrozen(mainForm, '', true, "code")
        btnNextStep.classList.add('hide')
        btnRunCode.classList.remove('hide')

        codeEditor.clearCode('# write code\n\n\n\n\n\n\n\n\n')
        const csrftoken = getCookie('csrftoken')
        fetch(`/api/step-item/code/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({
                repeat_task: true,
            }),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken
            },
        }).then(response => response.json()
        ).then(data => {
            printf(`=> PATCH:/api/step-item/code/${id}/`, "green")
            console.log("btnCheckedAgain.onclick.data", data)
            if (!$testInfo.classList.contains('hide')) {
                $testInfo.classList.add('hide')
            }
        })
    }
    // taskCheck.appendChild(btnCheckedAgain)
    // END BUTTON

    if (step['has_progress']) {
        formFooter.innerHTML = `
                <a href="#">Розв'язки</a> Ви отримали <span class="student_points">${this.getTextPoints(step['student_points'])}</span> з ${step['points']}
        `
    } else {
        formFooter.innerHTML = `${this.getTextPoints(step.points)} за розв’язок.`
    }
    fieldset.appendChild(formFooter)

    if (!repeatTask) {
        if (step['student_solved']) {
            this.toggleFrozen(mainForm, '1', false, "code")
            btnNextStep.classList.remove('hide')
        } else {
            this.toggleFrozen(mainForm, '0', false, "code")
        }
        btnRunCode.classList.add('hide')
        // fieldset.setAttribute("disabled", true)
        fieldset.toggleAttribute("disabled", true)
    }

    // changeActiveTheoryItem
    if (this.activeTheoryItem) {
        this.activeTheoryItem.classList.add('hide')
    }
    this.activeTheoryItem = stepInner

    // mainForm.onsubmit = async (event) => {
    mainForm.onsubmit = (event) => {
        event.preventDefault();
        // console.log(mainForm.querySelector('textarea').value)
        const csrftoken = getCookie('csrftoken')
        fetch(`/api/step-item/code/${id}/`, {
            method: 'POST',
            body: JSON.stringify({
                // selected: (isMultipleChoice) ? selected : selected[0],
                // selected_indexes: selectedIndexes,
                // answer_ids: listAnswerId
                code: mainForm.querySelector('textarea').value
            }),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken
            },
        }).then(response => response.json()
        ).then(data => {
            printf(`=> POST /api/step-item/code/${id}/`, "green")
            console.log('mainForm.onsubmit', data)
            btnRunCode.classList.add('hide')
            if ($testInfo.classList.contains("hide")) {
                $testInfo.classList.remove("hide")
            }

            const testInfo = data['test_info']
            const textContent = []
            for (let i = 0; i < testInfo.length; i++) {
                textContent.push(`test ${i} ${testInfo[i]}`)
            }
            $testInfoCode.textContent = textContent.join('\n')

            // if (formFooter.classList.contains('hide')) {
            //     formFooter.classList.remove('hide')
            // }
            //
            // if (!taskPoints.classList.contains('hide')) {
            //     taskPoints.classList.add('hide')
            // }
            // // mainForm.querySelector('.task__points').textContent = ''
            //
            if (!step['has_progress']) {
                // step['has_progress'] = true
                mainForm.querySelector('.form__footer').innerHTML = `
                        <a href="#">Розв'язки</a> Ви отримали <span class="student_points">${this.getTextPoints(data['student_points'])}</span> з ${step['points']}`
            }
            if (data['solved']) {
                mainForm.querySelector('.form__footer .student_points').textContent = this.getTextPoints(data['student_points'])
                btnNextStep.classList.remove('hide')
                const $menuCode = this.getMenuItem('code', id)
                if ($menuCode) {
                    // $menuCode.dataset.points = data['student_points']
                    $menuCode.dataset.solved = 'true'
                    const $path = $menuCode.querySelector('path')
                    $path.style.fill = colors.blue

                    // заморозити
                    this.toggleFrozen(mainForm, '1', true, "code")
                }
            } else {
                this.toggleFrozen(mainForm, '0', true, "code")
            }
        })
    }
}
// print('***', end='')
export default stepsContent