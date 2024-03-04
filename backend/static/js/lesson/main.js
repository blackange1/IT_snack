import menuSteps from './menu.js'
import sidebar from './sidebar.js'

document.addEventListener("DOMContentLoaded", function () {
    const $lessonSidebar = document.querySelector('.lesson-sidebar')
    const courseId = $lessonSidebar.dataset.courseId
    sidebar.init(courseId)
    sidebar.run()
});