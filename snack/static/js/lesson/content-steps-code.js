import getCookie from '../tools.js'
import stepsContent from "./content-steps-choice-multi.js";


let print = console.log

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
            <div class="code__printer">
                <label for="99" class="test_title">Test input:</label>
                <div class="test__block">
                    <textarea id="99" class="block__input" rows="3"></textarea>
                    <div class="button button-secondary button-run-code">Запустити</div>
                </div>
                <div class="test__footer">
                    <div class="footer__title">Test output:</div>
                    <div class="footer__output">
                        <pre><code class="hljs language-plaintext">def 2*   x</code></pre>
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

            this.$textarea.onclick = () => {
                print("$textarea.onclick")
            }

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
                //     print("e.keyCode", e.keyCode)
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
                print(words)

                const paragraphs = []
                // let line = ""
                // let index = 0
                let line = words[0]
                let index = 1
                while (index < words.length) {
                    const word = words[index]
                    let newLine = line + word

                    // обрізання пробідів
                    newLine = this.sliceSpace(newLine)

                    if (newLine.length > this.maxCountCharsOfLine) {
                        // print('newLine', [newLine])
                        // print('line', [line])
                        // print('newLine.slice(this.maxCountCharsOfLine)', [newLine.slice(this.maxCountCharsOfLine)])

                        if (line.slice(this.maxCountCharsOfLine).length) {
                            // print('***line', [line])
                            // print('*', [line.slice(0, this.maxCountCharsOfLine)])
                            // print('*', [line.slice(this.maxCountCharsOfLine)])

                            // перевірка на пробіли
                            line = this.sliceSpace(line)
                            paragraphs.push(line.slice(0, this.maxCountCharsOfLine))
                            // print('line', [line])
                            // print('word', [word])
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
                print(paragraphs)
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

            // print("this.spaceParagraphs", this.spaceParagraphs)
            const rewLength = row.length
            // print('rewLength', rewLength)

            for (let i = 0; i < rewLength; i++) {
                // print('i', i)
                this.calculationLongString(row, i)
                this.countParagraphs++
            }
            print(this.countParagraphs, oldCountParagraphs)
            print(this.spaceParagraphs, oldSpaceParagraphs)
            print(JSON.stringify(this.spaceParagraphs) !== JSON.stringify(oldSpaceParagraphs))
            print(this.countParagraphs !== oldCountParagraphs)

            if (JSON.stringify(this.spaceParagraphs) !== JSON.stringify(oldSpaceParagraphs) || this.countParagraphs !== oldCountParagraphs) {
                print('RENDER UL')
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

        updateWidth() {
            const $code = this.$code
            // print($code.parentElement.parentElement)
            this.maxCountCharsOfLine = Math.floor($code.offsetWidth * 0.09257)
            print($code.offsetWidth)
            print(this.maxCountCharsOfLine)
            print(Math.floor($code.offsetWidth * 0.09257))
            this.inputCode()
        }
    }

    // const codeEditor = new CodeEditor(document.querySelector('.code-editor'), 'class Car(object):\n    def __init__(self, name, year):\n        self.name = name\n        self.year = year\n\n    def show_info(self):\n        print(f\'name: {self.name} year:{self.year}\')')
    // print(codeEditor)
    // window.addEventListener("resize", () => {
    //     codeEditor.updateWidth()
    //     // 100 - 9 == 0.09
    //     // 600 - 55 == 0.0916
    //     // 806 -
    //     // 1000 - 92 == 0.092
    //     // 1405 - 130 == 0.09253
    //     // 1210 - 112 /111
    // })

stepsContent.renderCode = function (step, id) {
    const stepInner = this.createElement('div', {'class': 'step-inner', 'id': 'code' + id}, `
        5.1 Задача на программирование: основная информация 11 з 14 кроків пройдено 0 з 3 бали отримано
        <hr>${step['text_html']}`, true)

    // CREATE FORM
    const mainForm = this.createElement('form', {'class': 'lesson-form', 'data-id': id})

    const isMultipleChoice = true
    const fieldset = this.createElement('fieldset', 'fieldset__default')
    // const legend = this.createElement('legend', 'task__title',
    //     (isMultipleChoice) ? "Виберіть декілька відповідей" : "Виберіть один варіант зі списку")


    mainForm.appendChild(fieldset)
    // fieldset.appendChild(legend)
    // fieldset.appendChild(this.createElement('div', 'attempt__message'))

    // const answers = step['code']
    // const repeat_task = step['repeat_task']
    // const repeat_task = false

    // const taskCheck = this.createElement('div', 'task__check')
    // const taskPoints = this.createElement('div', 'task__points hide')

    // taskCheck.appendChild(taskPoints)

    // fieldset.appendChild(taskCheck)

    // const formFooter = this.createElement('div', 'form__footer hide')
    
    // fieldset.appendChild(formFooter)
    mainForm.appendChild(fieldset)
    stepInner.appendChild(mainForm)

    this.$theory.appendChild(stepInner)

    const codeEditor = new CodeEditor(fieldset, 'class Car(object):\n    def __init__(self, name, year):\n        self.name = name\n        self.year = year\n\n    def show_info(self):\n        print(f\'name: {self.name} year:{self.year}\')\ncar = Car(\'BMW\', 2000)\ncar.show_info()')
    
    // const wrapperLabel = this.createElement('div', 'wrapper_label')
    // if (repeat_task) {
    //     for (const answer of answers) {
    //         const label = this.createElement('label', 'container', `
    //             <input type="checkbox" name="answer${step.id}"  id="answer${answer.id}" data-id="${answer.id}">
    //             <span class="checkmark"></span>${answer.text}`, true)
    //         wrapperLabel.appendChild(label)
    //     }
    //     fieldset.appendChild(wrapperLabel)
    // } else {
    //     // FIXED
    //     const wrapperLabel = this.createElement('div', 'wrapper_label')
    //     let j = 0
    //     print("", step['answers_json'])
    //     const index = step['answers_json'][1]
    //     for (const answer of step["answers_json"][0]) {
    //         const label = this.createElement('label', 'container')
    //         const input = this.createElement('input', {type: 'checkbox'})
    //         const span = this.createElement('span', 'checkmark')
    //         label.appendChild(input)
    //         label.appendChild(span)
    //         label.appendChild(this.createElement('span', '', answer))
    //         if (index.includes(j)) {
    //             input.checked = true
    //         }
    //         j++
    //         wrapperLabel.appendChild(label)
    //     }
    //     fieldset.appendChild(wrapperLabel)
    // }


    // if (!step['has_progress']) {
    //     taskPoints.classList.remove('hide')
    //     taskPoints.textContent = `${this.getTextPoints(step.points)} за розв’язок.`
    // }
   
    // BUTTON
    const codeCheck = this.createElement('div', 'code__check')
    const btnSubmit = this.createElement('button', {'class': 'button button-primary', type: 'submit'}, 'Надіслати')
    const btnRunCode = this.createElement('div', {'class': 'button button-secondary button-run-code'}, 'Запустити')
    codeCheck.appendChild(btnSubmit)
    codeCheck.appendChild(btnRunCode)

    fieldset.appendChild(codeCheck)

    btnRunCode.onclick = () => {
        print(mainForm.querySelector('textarea').value)
        const code = mainForm.querySelector('textarea').value
        const input = mainForm.querySelector('.test__block textarea').value
        print('input', input)
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
            print('data POST: ', data)
            const $footerOutput = mainForm.querySelector('.footer__output pre code')
            $footerOutput.textContent = data["print"]
            print('$footerOutput', $footerOutput)
            // this.updateChoiceMulti(data, id)
        })
    }
    // const btnNextStep = this.createElement('div',
    //     'button button-primary button-next-step hide', 'Наступний крок')
    // btnNextStep.onclick = () => {
    //     print('btnNextStep.onclick')
    // }
    // taskCheck.appendChild(btnNextStep)

    // const btnCheckedAgain = this.createElement('div',
    //     'button button-secondary button-checked-again hide', "btnCheckedAgain")
    // btnCheckedAgain.onclick = () => {
    //     // розморозити
    //     this.toggleFrozen(mainForm)
    //     const csrftoken = getCookie('csrftoken')
    //     fetch(`/api/step-item/choice_multi/${id}/`, {
    //         method: 'PATCH',
    //         body: JSON.stringify({
    //             repeat_task: true,
    //         }),
    //         headers: {
    //             'Accept': 'application/json, text/plain, */*',
    //             'Content-Type': 'application/json',
    //             "X-CSRFToken": csrftoken
    //         },
    //     }).then(response => response.json()
    //     ).then(data => {
    //         print('data PATCH: ', data)
    //         this.updateChoiceMulti(data, id)
    //     })
    // }
    // taskCheck.appendChild(btnCheckedAgain)
    // END BUTTON

    // if (step['has_progress']) {
    //     formFooter.classList.remove('hide')
    //     formFooter.innerHTML = `
    //             <a href="#">Розв'язки</a> Ви отримали <span class="student_points">${this.getTextPoints(step['student_points'])}</span> з ${step['points']}
    //     `
    // }

    // if (!repeat_task) {
    //     if (step['student_solved']) {
    //         this.toggleFrozen(mainForm, '1', false)
    //         // btnNextStep.classList.remove('hide')
    //     } else {
    //         this.toggleFrozen(mainForm, '0', false)
    //     }
    // this.toggleFrozen(mainForm, (step['student_solved']) ? '1' : '0')
    // }

    // changeActiveTheoryItem
    if (this.activeTheoryItem) {
        this.activeTheoryItem.classList.add('hide')
    }
    this.activeTheoryItem = stepInner

    // mainForm.onsubmit = async (event) => {
    mainForm.onsubmit = (event) => {
        event.preventDefault();
        print(mainForm.querySelector('textarea').value)


    //     let listAnswerId = []
    //     let selectedIndexes
    //     let selected = []
    //     const listCheckboxAnswer = mainForm.querySelectorAll('input[type="checkbox"]')
    //     selectedIndexes = []
    //     let i = 0
    //     for (const checkboxAnswer of listCheckboxAnswer) {
    //         listAnswerId.push(checkboxAnswer.dataset.id)
    //         if (checkboxAnswer.checked) {
    //             selected.push(checkboxAnswer.dataset.id)
    //             selectedIndexes.push(i)
    //         }
    //         i++
    //     }
    //
    //     // const $radioAnswer = mainForm.querySelector('input[type="radio"]:checked')
    //     if (selected.length) {
    //         const csrftoken = getCookie('csrftoken')
    //
    //         fetch(`/api/step-item/choice_multi/${id}/`, {
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 // selected: (isMultipleChoice) ? selected : selected[0],
    //                 selected_indexes: selectedIndexes,
    //                 answer_ids: listAnswerId
    //             }),
    //             headers: {
    //                 'Accept': 'application/json, text/plain, */*',
    //                 'Content-Type': 'application/json',
    //                 "X-CSRFToken": csrftoken
    //             },
    //         }).then(response => response.json()
    //         ).then(data => {
    //             print('data POST:', data)
    //             if (formFooter.classList.contains('hide')) {
    //                 formFooter.classList.remove('hide')
    //             }
    //
    //             if (!taskPoints.classList.contains('hide')) {
    //                 taskPoints.classList.add('hide')
    //             }
    //             // mainForm.querySelector('.task__points').textContent = ''
    //
    //             if (!step['has_progress']) {
    //                 step['has_progress'] = true
    //                 mainForm.querySelector('.form__footer').innerHTML = `
    //                     <a href="#">Розв'язки</a> Ви отримали <span class="student_points">${this.getTextPoints(data['student_points'])}</span> з ${step['points']}`
    //             }
    //             if (data['solved']) {
    //                 mainForm.querySelector('.form__footer .student_points').textContent = this.getTextPoints(data['student_points'])
    //                 btnNextStep.classList.remove('hide')
    //                 const $menuChoice = this.getMenuItem('choice_multi', id)
    //                 if ($menuChoice) {
    //                     // $menuChoice.dataset.points = data['student_points']
    //                     $menuChoice.dataset.solved = 'true'
    //                     const $path = $menuChoice.querySelector('path')
    //                     $path.style.fill = colors.blue
    //
    //                     // заморозити
    //                     this.toggleFrozen(mainForm, '1')
    //                 }
    //             } else {
    //                 this.toggleFrozen(mainForm, '0')
    //             }
    //         })
    //     } else {
    //         alert('Ти не вибрав жодного елемента')
    //         // звертатися залежно від статі
    //     }
    }
}

export default stepsContent