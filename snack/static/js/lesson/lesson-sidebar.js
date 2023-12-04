document.addEventListener("DOMContentLoaded", () => {
    const print = console.log
    const $lessonSidebar = document.querySelector('.lesson-sidebar')


    const sidebar = {
        maxLengthModule: 26,
        maxLengthLesson: 26,
        cutTitleModule(string) {
            if (string.length > this.maxLengthModule) {
                return string.slice(0, this.maxLengthModule) + '...'
            }
            return string
        },
        cutTitleLesson(string) {
            if (string.length > this.maxLengthLesson) {
                return string.slice(0, this.maxLengthLesson) + '...'
            }
            return string
        },
        render(course) {
            const $lessonSidebarContent = document.querySelector('.lesson-sidebar__content')
            let numberModule = 1
            for (const module of course.module_set) {
                const lessonSidebarModuleHeader = document.createElement('div')
                lessonSidebarModuleHeader.classList.add('lesson-sidebar__module-header')
                lessonSidebarModuleHeader.innerHTML = `
                    <div class="line-progress-bar">&nbsp;</div>
                    <div class="line-progress-bar-done" style="height: 33%;">&nbsp;</div>
                    <div class="sidebar-module-header__title" style="width: 100%;" title="${module.name}">
                        ${this.cutTitleModule(numberModule + ' ' + module.name)}
                    </div>
                    `
                $lessonSidebarContent.appendChild(lessonSidebarModuleHeader)
                // const lessonsUl = document.createElement('ul')
                // moduleDiv.textContent = module.name
                let numberLesson = 1
                for (const lesson of module.lesson_set) {
                    const lessonSidebarLessonsInner = document.createElement('a')
                    lessonSidebarLessonsInner.classList.add('lesson-sidebar__lessons-inner')
                    lessonSidebarLessonsInner.href = `/lesson/${lesson.id}/step/1`
                    lessonSidebarLessonsInner.innerHTML = `
                        <div class="lesson-sidebar__lesson-header">
                            <div class="line-progress-bar">&nbsp;</div>
                            <div class="line-progress-bar-done" style="height: 67%;">
                                &nbsp;
                            </div>
                            <div class="sidebar-lesson-header__title" style="width: 100%;">
                                ${this.cutTitleLesson(numberModule + '.' + numberLesson + ' ' + lesson.name)}
                            </div>
                        </div>
                        `
                    // ${numberModule}.${numberLesson}&nbsp;&nbsp;
                    lessonSidebarLessonsInner.onclick = function (event) {
                        event.preventDefault();
                        print(this)
                    }
                    $lessonSidebarContent.appendChild(lessonSidebarLessonsInner)
                    numberLesson++
                }
                numberModule++
            }
        }
    }

    const courseId = $lessonSidebar.dataset.courseId
    fetch(`/api/courses/${courseId}?format=json`)
        .then(response => response.json())
        .then(course => {
            print('course', course)
            sidebar.render(course)
        });
});


// let url = 'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits';
// let response = await fetch(url);
//
// let commits = await response.json(); // читаем ответ в формате JSON
//
// alert(commits[0].author.login);