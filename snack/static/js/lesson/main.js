import menuSteps from './menu.js'
import sidebar from './sidebar.js'
const print = console.log
document.addEventListener("DOMContentLoaded", function () {
    print('main')

    const $lessonSidebar = document.querySelector('.lesson-sidebar')
    const courseId = $lessonSidebar.dataset.courseId
    sidebar.init(courseId)
    sidebar.run()
});