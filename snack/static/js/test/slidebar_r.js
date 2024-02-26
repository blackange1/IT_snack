const {Component} = React;
const {createRoot} = ReactDOM;

function printReq(...args) {
    const style = 'color: white; /*background-color: white*/'
    const firstElem = args.shift()
    console.log(`%c => ${firstElem}`, style, ...args);
}

class Module extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <a data-lesson-id="234" className="lesson-sidebar__lessons-inner" href="/lesson/234/step/1">
                <div className="lesson-sidebar__lesson-header lesson-active">
                    <div className="line-progress-bar">&nbsp;</div>
                    <div className="line-progress-bar-done" style="height: 99%;">
                        &nbsp;
                    </div>
                    <div className="sidebar-lesson-header__title" style="width: 100%;"
                         title="Загальна інформація про курс">
                        1.1 Загальна інформація про курс
                    </div>
                </div>
            </a>
        );
    }
}

//
//
// class Lesson extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//
//     render() {
//         return (
//             <div className="lesson-sidebar__module-header">
//                 <div className="line-progress-bar">&nbsp;</div>
//                 <div className="line-progress-bar-done" style="height: 1%;">&nbsp;</div>
//                 <div className="sidebar-module-header__title" style="width: 100%;" title="Введення-виведення даних">
//                     2 Введення-виведення даних
//                 </div>
//             </div>
//         );
//     }
// }

class Sidebar extends Component {
    constructor(props) {
        super(props);
        // this.state = this.getState();
        this.state = {};
        this.getState();

        console.log('this.state', this.state)
    }

    getState() {
        fetch(`/api/courses/17?format=json`)
            .then(response => response.json())
            .then(course => {
                printReq(`GET:/api/courses/${this.courseId}?format=json`, course)
                printReq(this.useState)
                // this.state = course;
                this.useState = course
                // this.render(course)
            }
            );
    }

    render() {
        return (
            <div className="lesson-sidebar__body">
                <div className="lesson-sidebar__header">
                    <a href="#" title="Документація IT snack" className="lesson-sidebar__course-title">Документація IT
                        snack</a>
                    <div className="lesson-sidebar__course-progress-wrap">
                        <p className="lesson-sidebar__course-progress">Прогрес у курсі: 3/61</p>
                        <div className="lesson-sidebar__progress-line">
                            <div className="lesson-sidebar__progress-line-done"/>
                        </div>
                    </div>
                </div>
                <div className="lesson-sidebar__content">

                </div>
                <div className="lesson-sidebar__footer">
                    <div className="lesson-controls">
                        SVG
                    </div>
                    <div className="lesson-controls">
                        <div>
                            SVG
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

console.log('Sidebar', <Sidebar/>);
const sidebar = document.querySelector('.lesson-sidebar');
console.log('sidebar', sidebar);
console.log('ReactDOM', ReactDOM);
const rootSidebar = createRoot(sidebar);
// rootSidebar.render(<Sidebar/>);
rootSidebar.render(<Sidebar/>);
