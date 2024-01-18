document.addEventListener("DOMContentLoaded", function () {
    const print = console.log

    class CodeEditer {
        constructor(elem, numberItem = 7) {
            elem.innerHTML = `
            <div class="code__wraper">
                <ul class="code__number" data-row="10">
                </ul>

                <div class="wrapper__usercode">
                    <div class="usercode">

<pre><code class="language-python hljs" data-highlighted=""></code></pre>

<textarea name="code" class="usercode_main">class Car(object):111111111111111111111111111111111111111        2222222
    def __init__(self, name, year):
        self.name = name
        self.year = year

    def show_info(self):
        print(f'name: {self.name} year:{self.year}')</textarea>
                    </div>

                </div>
            
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

            this.$textarea = elem.querySelector('textarea')
            this.$code = elem.querySelector('code.hljs')

            this.$textarea.onclick = () => {
                print("$textarea.onclick")
            }
            // this.$textarea.addEventListener('input', () => {
            //     print("$textarea.input")
            //     this.inputCode()
            // })
            this.$textarea.addEventListener('keydown', (e) => {
                const keyCode = e.keyCode
                if (e.key == 'Tab') {
                    e.preventDefault()
                }
                if (35 <= keyCode && keyCode <= 40) {
                    print("render cursore")
                    print("e.keyCode", e.keyCode)
                }
            })
            this.numberItem = numberItem + 1 // 7
            this.preWrap = {} // {1: 1, 3: 2} 1*23**

            this.inputCode()
            // oldProps
            this.$codeEditorNumber = elem.querySelector('.code__number')
            // this.$usercode = elem.querySelector('.usercode')


            for (let i = 1; i <= this.numberItem; i++) {
                print('i', i)
                this.appendNumberItem(i)
            }
            // this.minRow = +this.$codeEditorNumber.dataset.row

            this.addEventListenerInput()
        }

        inputCode() {
            // print('inputCode', this.$textarea.value)
            // this.$textarea.value = this.$textarea.value
            this.$code.innerHTML = hljs.highlight(this.$textarea.value, {language: 'python'}).value
            // const html = hljs.highlight('<h1>Hello World!</h1>', {language: 'xml'}).value
        }

        // newMethod



        // oldMethod
        appendNumberItem(n) {
            const numberItem = document.createElement('li')
            numberItem.textContent = n
            this.$codeEditorNumber.appendChild(numberItem)
        }
        addEventListenerInput() {
            this.$textarea.addEventListener('input', () => {
                this.inputCode()

                // const obj = this
                const code = this.$textarea.value

                let row = code.split('\n')
                // TEST
                const maxCountCharsOfLine = 60
                if (row[0].length > maxCountCharsOfLine) {
                    print(2222)
                    const words = []
                    let start = 0
                    let preparationClose = false
                    const string = row[0]
                    for (const index in string) {
                        // buffer if 0] == " "
                        const ch = string[index]
                        if (ch == " ") {
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
                    // let lineLength = 0
                    for (const index in words) {
                        const word = words[index]
                        const newLile = line + word
                        if (newLile.length > 60) {
                            print('newLile.slice(60)', [newLile.slice(61)]) 
                            // count splice
                            // if (newLile.split(60)) {

                            // }
                            paragraphs.push(line)
                            line = word
                        } else {
                            line = newLile
                        }
                    }
                    paragraphs.push(line)
                    print(paragraphs)
                    // обхід слів, розподіл на абзаци
                }
                // End TEST
                const rewLength = row.length
                print('row[0]', row[0], row[0].length)
                print('rewLength', rewLength)

                this.$codeEditorNumber.innerHTML = ''
                for (let i = 1; i <= rewLength; i++) {
                    // print('i', i)
                    this.appendNumberItem(i)
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
            )
        }
    }

    const codeEditer = new CodeEditer(document.querySelector('.code-editor'))
    print(codeEditer)


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