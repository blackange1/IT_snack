document.addEventListener("DOMContentLoaded", function () {
    const print = console.log

    class CodeEditer {
        constructor(elem, numberItem = 10) {
            elem.innerHTML = `
            <div class="code__wraper">
                <ul class="code__number" data-row="10"></ul>

<div class="wrapper__usercode">
                <div class="usercode">

<pre><code class="language-python hljs" data-highlighted="">class Car(object):
    def __init__(self, name, year):
        self.name = name
        self.year = year

    def show_info(self):
        print(f'name: {self.name} year:{self.year}')
    </code>
</pre>
<!--<div class="wrapper_textarea">-->
<textarea name="code" class="usercode_main">class Car(object):
    def __init__(self, name, year):
        self.name = name
        self.year = year

    def show_info(self):
        print(f'name: {self.name} year:{self.year}')</textarea>
                </div>
<!--</div>-->
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
            this.$textarea.addEventListener('input', () => {
                print("$textarea.input")
                this.inputCode()
            })
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

            // oldProps
            // this.$codeEditorNumber = elem.querySelector('.code__number')
            // this.$usercode = elem.querySelector('.usercode')

            // for (let i = 1; i <= numberItem; i++) {
            //     this.appendNumberItem(i)
            // }
            // this.minRow = +this.$codeEditorNumber.dataset.row

            // this.addEventListenerInput()
        }

        inputCode() {
            print('inputCode', this.$textarea.value)
            this.$code.innerHTML = hljs.highlight(this.$textarea.value, {language: 'python'}).value
            // const html = hljs.highlight('<h1>Hello World!</h1>', {language: 'xml'}).value
        }

        // newMethod



        // oldMethod
        // appendNumberItem(n) {
        //     const numberItem = document.createElement('li')
        //     numberItem.textContent = n
        //     this.$codeEditorNumber.appendChild(numberItem)
        // }
        // addEventListenerInput() {
        //     const obj = this
        //     this.$usercode.addEventListener('input', function () {
        //         const code = this.value
        //         let row = code.split('\n').length

        //         if (obj.minRow > row) {
        //             row = obj.minRow
        //         }

        //         const dataRow = +obj.$codeEditorNumber.dataset.row
        //         if (dataRow < row) {
        //             obj.$codeEditorNumber.dataset.row = row

        //             for (let i = dataRow + 1; i <= row; i++) {
        //                 obj.appendNumberItem(i)
        //             }
        //         } else {
        //             if (dataRow > row) {
        //                 obj.$codeEditorNumber.dataset.row = row
        //                 for (let i = dataRow; i > row; i--) {
        //                     print('i', i)
        //                     obj.$codeEditorNumber.lastElementChild.remove()
        //                 }
        //             }
        //         }
        //     })
        // }
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