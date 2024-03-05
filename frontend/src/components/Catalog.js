import React, {useState, useEffect, Component} from 'react';
import axios from 'axios';
import './Catalog.css';
import coverPy from '../img/coverpy.png'

export default class Catalog extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <main className="wrapper">
                <h1 className="text-center">Наші курси</h1>
                <div className="courses">
                    {/*<p>Покоління Python курс для початківців id=19</p>*/}
                    <div className="course">
                        <div className="course__main">
                            <div className="course__body">
                                <div className="course__cover">
                                    <img src={coverPy} alt=""/>
                                </div>
                                <div className="course__content">
                                    <div className="course__date">20 Березня 2023</div>
                                    <div className="course__title"><a href="/course/19/syllabus/">Покоління Python курс
                                        для початківців</a></div>
                                    <div className="course__autors">Бабенко Володимир</div>
                                </div>
                            </div>
                        </div>
                        <div className="course__footer">
                            <div className="footer__item">
                                <i className="fa fa-star"/>
                                <span className="item__text">5</span>
                            </div>
                            <div className="footer__item">
                                <i className="fa fa-user-o"/>
                                <span className="item__text">1.5K</span>
                            </div>
                            <div className="footer__item">
                                <i className="fa fa-clock-o"/>
                                <span className="item__text">22 год</span>
                            </div>
                            <div className="footer__item">
                                <i className="fa fa-certificate"/>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}
