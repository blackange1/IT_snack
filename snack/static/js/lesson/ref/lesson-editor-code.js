document.addEventListener("DOMContentLoaded", function () {
    const print = console.log
    // 806px зменшити коефіцієнт або змінти метод Math.floor
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
            <div class="code__check">
                <button type="button" class="button button-primary">Надіслати</button>
                <button type="button" class="button button-secondary">Запустити код</button>
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

    const codeEditor = new CodeEditor(document.querySelector('.code-editor'), 'class Car(object):\n    def __init__(self, name, year):\n        self.name = name\n        self.year = year\n\n    def show_info(self):\n        print(f\'name: {self.name} year:{self.year}\')')
    print(codeEditor)

    window.addEventListener("resize", () => {
        codeEditor.updateWidth()
        // 100 - 9 == 0.09
        // 600 - 55 == 0.0916
        // 806 -
        // 1000 - 92 == 0.092
        // 1405 - 130 == 0.09253
        // 1210 - 112 /111
    })
});
