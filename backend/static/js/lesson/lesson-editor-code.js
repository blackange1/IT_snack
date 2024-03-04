document.addEventListener("DOMContentLoaded", function () {
    const print = console.log

    class CodeEditer {
        constructor(elem, numberItem = 10) {
            elem.innerHTML = `
            <div class="code__wraper">
                <ul class="code__number" data-row="10"></ul>
                <textarea name="code" class="usercode"></textarea>
            </div>
            <div class="code__check">
                <button type="button" class="button button-primary">Надіслати</button>
                <button type="button" class="button button-secondary">Запустити код</button>
            </div>
            `

            this.$codeEditorNumber = elem.querySelector('.code__number')
            this.$usercode = elem.querySelector('.usercode')

            for (let i = 1; i <= numberItem; i++) {
                this.appendNumberItem(i)
            }
            this.minRow = +this.$codeEditorNumber.dataset.row

            this.addEventListenerInput()
        }

        appendNumberItem(n) {
            const numberItem = document.createElement('li')
            numberItem.textContent = n
            this.$codeEditorNumber.appendChild(numberItem)
        }
        addEventListenerInput() {
            const obj = this
            this.$usercode.addEventListener('input', function () {
                const code = this.value
                let row = code.split('\n').length

                if (obj.minRow > row) {
                    row = obj.minRow
                }

                const dataRow = +obj.$codeEditorNumber.dataset.row
                if (dataRow < row) {
                    obj.$codeEditorNumber.dataset.row = row

                    for (let i = dataRow + 1; i <= row; i++) {
                        obj.appendNumberItem(i)
                    }
                } else {
                    if (dataRow > row) {
                        obj.$codeEditorNumber.dataset.row = row
                        for (let i = dataRow; i > row; i--) {
                            print('i', i)
                            obj.$codeEditorNumber.lastElementChild.remove()
                        }
                    }
                }
            })
        }
    }

//    const codeEditer = new CodeEditer(document.querySelector('.code-editor'))
//    print(codeEditer)

});