document.addEventListener("DOMContentLoaded", function () {
    const options = {
        debug: 'info',
        modules: {
            // toolbar: true,
            toolbar: {
                container: '#toolbar-container',
            },
        },
        theme: 'snow',
        placeholder: 'Почніть вводити текст...'
    };


    const qlHTML = document.querySelectorAll('.ql-html')
    qlHTML.forEach((element) => {
        element.addEventListener('click', function () {
            const stepTextHTML = this.parentElement.parentElement.nextElementSibling;
            const qlEditor = stepTextHTML.firstChild;
            print('stepTextHTML', stepTextHTML)

            if (this.dataset.editorCreated === "0") {
                this.dataset.editorCreated = "1"
                this.dataset.editorShow = "1"

                const editor = document.createElement('div')

                qlEditor.classList.add('ql-hidden')

                editor.innerHTML = `<textarea id="ql-text-html-editor" style="height: 300px">${qlEditor.innerHTML}</textarea>`
                stepTextHTML.appendChild(editor)
            } else {
                const qlTextHtmlEditor = stepTextHTML.querySelector('#ql-text-html-editor')
                if (this.dataset.editorShow === "1") {
                    this.dataset.editorShow = "0"
                    qlEditor.classList.remove('ql-hidden')
                    qlTextHtmlEditor.classList.add('ql-hidden')

                    print('qlEditor.innerHTML', qlEditor.innerHTML)
                    print('qlTextHtmlEditor.innerHTML', qlTextHtmlEditor.innerHTML)
                    // qlEditor.innerHTML = qlTextHtmlEditor.innerHTML

                } else {
                    qlTextHtmlEditor.innerHTML = qlEditor.innerHTML

                    this.dataset.editorShow = "1"
                    qlEditor.classList.add('ql-hidden')
                    qlTextHtmlEditor.classList.remove('ql-hidden')
                }
            }
            console.log('qwetry', this.dataset)
        });
    });

    const quill = new Quill('.step__text_html', options);

    //
    // const $sidebar = document.querySelector('.lesson-sidebar__content')
    // const courseId = document.querySelector('.lesson-sidebar').dataset.courseId
    //
    // fetch(`/api/courses/${courseId}/?format=json`)
    //     .then(response => response.json())
    //     .then(data => {
    //         let i = 1;
    //         for (const module of data["module_set"]) {
    //             const divModule = document.createElement('div')
    //             divModule.setAttribute('class', 'lesson-sidebar__module-header')
    //             const moduleName = module["name"]
    //             divModule.innerHTML = `
    //                     <div class="line-progress-bar-done" style="height: 33%;">&nbsp;</div>
    //                     <div class="sidebar-module-header__title" style="width: 100%;" title="${moduleName}">
    //                     ${i} ${moduleName}</div>
    //                 `
    //             $sidebar.appendChild(divModule)
    //             for (const lesson of module["lesson_set"]) {
    //                 let j = 1;
    //                 const aLesson = document.createElement('a')
    //                 aLesson.setAttribute('class', 'lesson-sidebar__lessons-inner')
    //                 const lessonId = lesson["id"]
    //                 aLesson.dataset.lessonId = lessonId
    //                 aLesson.href = `/edit-lesson/${lessonId}/step/1`
    //                 const lessonName = lesson["name"]
    //                 aLesson.innerHTML = `
    //                     <div class="lesson-sidebar__lesson-header">
    //                         <div class="line-progress-bar-done" style="height: 88%;">&nbsp;</div>
    //                         <div class="sidebar-lesson-header__title" style="width: 100%;" title="${lessonName}">
    //                             ${i}.${j} ${lessonName}
    //                         </div>
    //                     </div>
    //                 `
    //                 $sidebar.appendChild(aLesson)
    //                 j++;
    //             }
    //             i++;
    //         }
    //         print(data)
    //     });

    const print = console.log
    print('connect')

});