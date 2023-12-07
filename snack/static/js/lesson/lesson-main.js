import menuSteps from './lesson-menu.js'
import sidebar from './lesson-sidebar.js'
const print = console.log
document.addEventListener("DOMContentLoaded", function () {
    print('main')

    const $lessonSidebar = document.querySelector('.lesson-sidebar')
    const courseId = $lessonSidebar.dataset.courseId
    sidebar.init(courseId)
    sidebar.run()
});