// window.addEventListener("resize", () => {console.log(12345678)});


document.addEventListener("DOMContentLoaded", function () {
    const print = console.log

    class CodeEditor {
        // constructor(elem, numberItem = 7) {
        constructor(elem) {
            // this.maxCountCharsOfLine = 55 => 600px
            this.maxCountCharsOfLine = 73
            this.countParagraphs = 0  // 3
            this.spaceParagraphs = {} // {2: 3}  12***3

            elem.innerHTML = `
            <div class="code__wraper">
                <ul class="code__number" data-row="10">
                </ul>

                <div class="wrapper__usercode">
                    <div class="usercode">

<pre><code class="language-python hljs" data-highlighted=""></code></pre>

<textarea name="code" class="usercode_main">class Car(object):
    def __init__(self, name, year):
        self.name = name
        self.year = year

    def show_info(self):
        print(f'name: {self.name} year:{self.year}')</textarea></div></div>
            
            </div>
            <div class="code__check">
                <button type="button" class="button button-primary">Надіслати</button>
                <button type="button" class="button button-secondary">Запустити код</button>
            </div>
            `

            // <div class="code__wraper">
            //     <ul class="code__number" data-row="10"></ul>
            //     <textarea name="code" class="usercode"></textarea>
            // </div>
            // <div class="code__check">
            //     <button type="button" class="button button-primary">Надіслати</button>
            //     <button type="button" class="button button-secondary">Запустити код</button>
            // </div>
            // змінити колір
            const $wrappeUsercode = elem.querySelector('.wrapper__usercode')
            this.$code = $wrappeUsercode.querySelector('code.hljs')
            $wrappeUsercode.style.backgroundColor = window.getComputedStyle(this.$code, null).getPropertyValue('background-color')
            print('this.$code.style.backgroundColor', window.getComputedStyle(this.$code, null).getPropertyValue('background-color'))

            this.$textarea = elem.querySelector('textarea')

            this.$textarea.onclick = () => {
                print("$textarea.onclick")
            }
            // this.$textarea.addEventListener('input', () => {
            //     print("$textarea.input")
            //     this.inputCode()
            // })
            this.$textarea.addEventListener('keydown', (e) => {
                const keyCode = e.keyCode
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
                // if (35 <= keyCode && keyCode <= 40) {
                //     print("e.keyCode", e.keyCode)
                // }
            })
            // this.numberItem = numberItem + 1 // 7
            // this.preWrap = {} // {1: 1, 3: 2} 1*23**

            // oldProps
            this.$codeEditorNumber = elem.querySelector('.code__number')
            // this.$usercode = elem.querySelector('.usercode')


            // for (let i = 1; i <= this.numberItem; i++) {
            //     // print('i', i)
            //     this.appendNumberItem(i)
            // }
            // this.minRow = +this.$codeEditorNumber.dataset.row
            this.inputCode()

            this.addEventListenerInput()
        }


        // newMethod


        // oldMethod
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
                    // buffer if 0] == " "
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
                console.clear()
                words.push(string.slice(start))
                print(words)

                const paragraphs = []
                let line = ""
                let index = 0
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

                if (line.slice(this.maxCountCharsOfLine).length) {
                    // FIXED
                    // line = this.sliceSpace(line)
                    //
                    // paragraphs.push(line.slice(0, this.maxCountCharsOfLine))
                    //
                    // // print('line', [line])
                    // // print('word', [word])
                    // line = line.slice(this.maxCountCharsOfLine)
                } else {
                    paragraphs.push(line)
                }
                print(paragraphs)
                this.spaceParagraphs[i + 1] = paragraphs.length - 1
            }
        }

        inputCode() {
            // print('inputCode', this.$textarea.value)
            // this.$textarea.value = this.$textarea.value
            this.$code.innerHTML = hljs.highlight(this.$textarea.value, {language: 'python'}).value
            // const html = hljs.highlight('<h1>Hello World!</h1>', {language: 'xml'}).value
            // const obj = this
            const code = this.$textarea.value

            let row = code.split('\n')
            // clear
            const oldCountParagraphs = this.countParagraphs
            const oldSpaceParagraphs = this.spaceParagraphs
            this.countParagraphs = 0
            this.spaceParagraphs = {}


            print("this.spaceParagraphs", this.spaceParagraphs)
            const rewLength = row.length
            print('row[0]', row[0], row[0].length)
            print('rewLength', rewLength)

            this.$codeEditorNumber.innerHTML = ''
            for (let i = 0; i < rewLength; i++) {
                // print('i', i)

                // this.appendNumberItem(i)
                this.calculationLongString(row, i)
                this.countParagraphs++
            }
            print('this.countParagraphs', this.countParagraphs)
            print('this.spaceParagraphs', this.spaceParagraphs)
            print('oldCountParagraphs', oldCountParagraphs)
            print('oldSpaceParagraphs', oldSpaceParagraphs)
            // render number
            // print('this.spaceParagraphs', this.spaceParagraphs)


            if (JSON.stringify(this.spaceParagraphs) !== JSON.stringify(oldSpaceParagraphs) || this.spaceParagraphs !== oldSpaceParagraphs) {
                print('RENDER UL')
                for (let i = 1; i <= this.countParagraphs; i++) {
                    this.appendNumberItem(i)
                    if (this.spaceParagraphs.hasOwnProperty(i)) {
                        for (let j = 0; j < this.spaceParagraphs[i]; j++) {
                            this.appendNumberItem('<span class="not_color">*</span>')
                        }
                    }
                }
            }

            // if (obj.minRow > row) {
            //     row = obj.minRow
            // }

            // const dataRow = +obj.$codeEditorNumber.dataset.row
            // if (dataRow < row) {
            //     obj.$codeEditorNumber.dataset.row = row

            //     for (let i = dataRow + 1; i <= row; i++) {
            //         obj.appendNumberItem(i)
            //     }
            // } else {
            //     if (dataRow > row) {
            //         obj.$codeEditorNumber.dataset.row = row
            //         for (let i = dataRow; i > row; i--) {
            //             print('i', i)
            //             obj.$codeEditorNumber.lastElementChild.remove()
            //         }
            //     }
            // }

        }

        addEventListenerInput() {
            this.$textarea.addEventListener('input', () => {
                    this.inputCode()
                }
            )
        }
    }

    const codeEditor = new CodeEditor(document.querySelector('.code-editor'))
    print(codeEditor)


    // const minRow = 10
    // const $usercode = document.querySelector('.usercode')
    // const $codeEditorNumber = document.querySelector('.code-editor__number')
    // $0.scrollHeight
    // $usercode.addEventListener('input', function () {
    //     const code = this.value
    //     let row = code.split('\n').length

    //     if (minRow > row) {
    //         row = minRow
    //     }
    //     // add li
    //     const dataRow = +$codeEditorNumber.dataset.row
    //     if (dataRow < row) {
    //         $codeEditorNumber.dataset.row = row

    //         for (let i = dataRow + 1; i <= row; i++) {
    //             const numberItem = document.createElement('li')
    //             numberItem.textContent = i
    //             $codeEditorNumber.appendChild(numberItem)
    //         }
    //     } else {
    //         if (dataRow > row) {
    //             $codeEditorNumber.dataset.row = row
    //             for (let i = dataRow; i > row; i--) {
    //                 print('i', i)
    //                 $codeEditorNumber.lastElementChild.remove()
    //             }

    //         }
    //     }
    // })
});
// 0       10        20        30        40        50        60        70
// 1234567890123456789012345678901234567890123456789012345678901234567890
// 22222222222     2222222 2                               44444444444444

/*
class Car(object):111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111213                             22222222222     2222222 2                               44444444444444
*/