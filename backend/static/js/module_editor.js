// document.addEventListener('DOMContentLoaded', function () {
// TODO
// * додати статуси до уроків [first, between, end, none]
// * використати user-select: none and auto для заборони виділення тексту
// * баг кони зажимаєш ЛК і крутех коліщам блок залишається на місці

const print = console.log

const $form = document.getElementById('form_editor_course')
const $templateModule = document.getElementById('template_module')
const $templateLesson = document.getElementById('template_lesson')
const btnCreateModule = document.getElementById('create_module')
// const btnsCreateLesson = $form.querySelectorAll('.lesson__header .new-lesson')
// const $btnCreateLesson = btnsCreateLesson[0]

// Тут знаходяться всі модулі з уроками
const StackModule = {
    data: [

    ],
    add: function (module) {
        this.data.push(module)
        module.changeNumber(this.data.length)
    },
    // getOnlyLessons: function () {
    //     arrLessons = []
    //     for (const module of this.data) {
    //         arrLessons = arrLessons.concat(module.stackLessons)
    //     }
    //     return arrLessons
    // },

    // Залишок після анімації
    clearLessonsIndexZ: function () {
        for (const module of this.data) {
            for (const lesson of module.stackLessons) {
                lesson.view.style.zIndex = '';
            }
        }
    }
}

// Об'єкт відповідає за анімацію уроків
const BlockDragManager = {
    activeBlock: null,
    moveBlock: null,


    startDragging: function (aBlock, mBlock, event) {
        if (event.which === 1) {
            // const lessons = StackModule.getOnlyLessons()
            const lesson = aBlock.lesson
            print(lesson)
            print(lesson.getNextLesson())
            this.activeBlock = aBlock
            this.moveBlock = mBlock
            this.moveBlock.style.transition = 'none'
            this.moveBlock.style.zIndex = '1';

            const initialX = event.clientX
            const initialY = event.clientY
            print('initialY', initialY)

            let direction = 0 // -3, -2, -1, 0, 1, 2, 3 up, none, down
            let oldY = event.clientY
            let nowY = undefined
            let nextLesson = lesson.getNextLesson()
            print('nextLesson', nextLesson)

            const onMouseMove = (event) => {
                if (this.activeBlock) {
                    const newX = - initialX + event.clientX;
                    const newY = - initialY + event.clientY;

                    this.moveBlock.style.left = newX + "px";
                    this.moveBlock.style.top = newY + "px";

                    nowY = event.clientY
                    direction = oldY - nowY
                    oldY = nowY

                    if (direction < 0 && nextLesson) {
                        print('down')
                        print('pageY:', event.pageY, 'animateOffsetTop:', nextLesson.animateOffsetTop)
                        if (nextLesson.animateOffsetTop < event.pageY) {
                            print('call')
                            print(nextLesson.view.style.top)
                            print(nextLesson.animateTop)
                            // nextLesson.view.style.top = `${-nextLesson.animateTop}px`;
                            print('eeee', lesson.animateOffsetTop - nextLesson.animateOffsetTop)
                            nextLesson.view.style.top = `${lesson.animateOffsetTop - nextLesson.animateOffsetTop}px`;
                        }

                    } else {
                        if (direction === 1) {
                            print('up')
                        }
                    }
// 168
                }
            }

            const onMouseUp = () => {
                this.moveBlock.style.top = '0px';
                this.moveBlock.style.left = '0px';

                this.moveBlock.style.transition = 'all 0.5s ease';
                this.activeBlock = null;
                this.moveBlock = null;
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
            }

            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        }

    }
};

class Lesson {
    /*
    @param:
    * number {number}
    * view {elemHTML}
    * module {module}
    * elemNumber {elemHTML}
    * btnNewLesson {elemHTML}
    * btnDleteLesson {elemHTML}
    * dragAndDrop {elemHTML}
    * isSave {bool}
    * canDelete {bool}
    * animatePosition {number} -1 0 1 <=> up, none, down
    * animateY {number}
    @methods:
    * getNextLesson()
    * updateNumber(number)
    * renderNewLesson()
    */
    constructor(module) {
        this.number = 0

        this.view = $templateLesson.cloneNode(true)
        this.view.removeAttribute('id')
        this.view.classList.remove('d-none')

        this.module = module

        this.dragAndDrop = this.view.querySelector('.drag-and-drop')

        this.dragAndDrop.lesson = this

        const dragAndDropOnmousedown = function (event) {
            StackModule.clearLessonsIndexZ()
            print('dragAndDropOnmousedown')
            BlockDragManager.startDragging(this.dragAndDrop, this.view, event);
        }
        this.dragAndDrop.onmousedown = dragAndDropOnmousedown.bind(this)

        this.elemNumber = this.view.querySelector('.lesson__number')
        this.elemNumber.show = function () {
            this.classList.remove('d-none')
        }

        this.btnNewLesson = this.view.querySelector('.new-lesson')
        this.btnNewLesson.hide = function () {
            this.classList.add('d-none')
        }

        this.btnDleteLesson = this.view.querySelector('.lesson__delete')
        this.btnDleteLesson.show = function () {
            this.classList.remove('d-none')
        }

        const dleteLesson = function () {
            this.module.updateLessonsNumber()
            this.view.remove()
            this.module.deleteLesonWithStack(this)
            delete this
        }
        this.btnDleteLesson.onclick = dleteLesson.bind(this)

        const createNewLesson = function () {
            this.renderNewLesson()
        }
        this.btnNewLesson.onclick = createNewLesson.bind(this)
        // render
        this.module.elemLessons.appendChild(this.view)

        // animate -1 0 1 => down none up
        this.animatePosition = 0
        this.animateOffsetTop = this.view.offsetTop;
        this.animateTop = this.view.getBoundingClientRect().top;
        // this.position = first, between, last, none

        this.isSave = false
        this.canDelete = false
        this.module.stackLessons.push(this)
    }

    getNextLesson() {
        if (this.number - 1 < this.module.stackLessons.length - 2) {
            return this.module.stackLessons[this.number]
        }
        return null
    }
    updateNumber(number) {
        this.number = number
        this.elemNumber.textContent = `${this.module.number}.${number}`
    }


    renderNewLesson() {
        const newLesson = new Lesson(this.module)
        this.canDelete = true
        this.elemNumber.show()
        this.btnDleteLesson.show()
        this.btnNewLesson.hide()
        this.dragAndDrop.classList.remove('d-none')
        this.updateNumber(this.module.stackLessons.length - 1)
    }
}

class Module {
    /*
    @param:
    * number {number}
    * view {elemHTML}
    * elemNumber {elemHTML}
    * elemLessons {elemHTML}
    * stackLessons {array}
    @methods:
    * changeNumber(number)
    * updateLessonsNumber
    * deleteLesonWithStack(leson)
    */
    constructor() {
        this.number = 0

        this.view = $templateModule.cloneNode(true)
        this.view.removeAttribute('id')
        this.view.classList.remove('d-none')

        this.elemNumber = this.view.querySelector('.module-editor__number')
        this.elemLessons = this.view.lastElementChild
        // render
        $form.appendChild(this.view)
        // STACK.createModule(this)
        this.changeNumber(this.number)

        this.stackLessons = []
    }
    changeNumber(number) {
        this.number = number
        this.elemNumber.textContent = this.number
    }
    updateLessonsNumber() {
        let number = 1
        for (const lesson of this.stackLessons) {
            lesson.updateNumber(number)
            number++
        }
    }
    deleteLesonWithStack(delLesson) {
        for (let index = 0; index < this.stackLessons.length; index++) {
            const lesson = this.stackLessons[index];
            if (lesson === delLesson) {
                this.stackLessons.splice(index, 1)
                this.updateLessonsNumber()
                return
            }
        }
    }
}

firstModule = new Module()
StackModule.add(firstModule)
firstLesson = new Lesson(firstModule)
// const form = document.getElementById('form_editor_course')
// const module = $form.querySelector('.module-editor__body')

btnCreateModule.onclick = function () {
    const modole = new Module()
    StackModule.add(modole)
    new Lesson(modole)
}
// });