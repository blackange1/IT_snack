import React, {useState, useEffect, Component} from 'react';
import axios from 'axios';
import './MainMenu.css';
import mainLogo from '../img/main_logo.png'

export default class MeinMenu extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <nav className="menu">
                <div className="menu-logo colum-center">
                    <a href="/">
                        <img src={mainLogo} width="180px" alt="main_logo"/>
                    </a>
                </div>
                <ul className="menu__list colum-center">
                    <li className="menu__item"><a href="/" className="menu__link">Каталог</a></li>
                    <li className="menu__item"><a href="#" className="menu__link">Моє навчання</a></li>
                    {/*<li className="menu__item"><a href="/teach/courses" className="menu__link">Викладання</a></li>*/}
                </ul>
                <div className="menu__right">
                    <div className="colum-center menu__search">
                        <input type="search" placeholder="Пошук..."/>
                    </div>

                    <div className="wrapper__username">
                        <div className="menu__username">admin</div>
                    </div>

                    <div className="menu__authorization">
                        <a href="/logout/">Вийти</a>
                    </div>
                </div>
            </nav>
        )
    }
}
