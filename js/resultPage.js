import helpers from './helpers.js'
import questionTitles from '../data/questionTitles.js'
import { renderFirstPage } from './firstPage.js'
import { renderQuizPage } from './quizPage.js'


const {findOne, create, sum} = helpers

const TOP_CONGRAT = "Вы набрали максимальное количество баллов! Поздравляем!",
    MID_CONGRAT = "Вы неплохо разбираетесь в голосах птиц, но резутат можно улучшить! ",
    LOW_CONGRAT = "Надо ещё потренироваться =("

const BUTTON_TO_HOME = "На главную",
    BUTTON_REPEAT = "Играть ещё!"

const FIRST_ROW_TITLES = ['ВОПРОС', 'ПРАВИЛЬНЫЙ ОТВЕТ', 'ВАШИ ОТВЕТЫ', 'БАЛЛЫ']

export const renderResultPage = (data) => {
/* const data = [
    {
        rightAns : "Синица",
        score : 10,
        yourAns : ["Ворон", "Кукушка", "Журавль", "Синица"]
    },
    {
        rightAns : "Галка",
        score : 4,
        yourAns : ["Сойка", "Галка"]
    },
    {
        rightAns : "Удод",
        score : 7,
        yourAns : ["Зяблик", "Горлица", "Клёст", "Дятел", "Удод"]
    },
    {
        rightAns : "Жаворонок",
        score : 1,
        yourAns : ["Свиристель", "Скворец", "Щегол", "Соловей", "Жаворонок"]
    },
    {
        rightAns: 'Лунь', 
        yourAns: ['Филин', 'Ястреб', 'Лунь'], 
        score: 3
    },
    {
        rightAns: 'Пингвин', 
        yourAns: ['Чайка', 'Олуша', 'Альбатрос', 'Пингвин'], 
        score: 2
    }
] */


    const totalScore = sum(data.map(el => el.score))
    const isDone = totalScore === 30,
        isGoodRes = totalScore > 22

    const page = `<div class="game-wrapper">
        <header class="header">
            <h1 class="h1">SongBird</h1>
            <div class="header__score">
            <span class="header__score__title">Your score:</span>
            <span id="current-score" class="header__score__value">${totalScore}</span>
        </div>
        </header>

        <div class="results">
            <table id="result-table" class="table"></table>
            <div class="results__buttons">
                <span class="results__buttons__congrats">${ isDone ? TOP_CONGRAT : isGoodRes ? MID_CONGRAT : LOW_CONGRAT }</span>
                <button class="results__buttons__button">${ isDone ? BUTTON_TO_HOME : BUTTON_REPEAT }</button>
            </div>
        </div>

        <footer class="footer">
            <div class="footer__school">
                <div class="footer__school__logo">
                    <img class="logo" src="assets/svg/logo_rs.svg" alt="logo rsschool">
                </div>
                <a class="footer__school__link" href="https://rs.school/">RS School</a>
            </div>
            <div class="footer__created">
                <div class="footer__created__author">Kalanda Aliaksandr, 2022</div>
                <a class="footer__created__link" href="https://github.com/Alex-Kalanda">[GitHub]</a>
            </div>
        </footer>
    </div>`

    const root = findOne('#main')
    root.innerHTML = page
    loadResults(data)
    findOne('.results__buttons__button').addEventListener('click', isDone ? renderFirstPage : renderQuizPage)
}

const loadResults = (data) => {
    const table = findOne('#result-table')

    table.append(getFirstLine(questionTitles))
    table.append(getLine(data.map(i => i.rightAns), FIRST_ROW_TITLES[1] ))
    table.append(getLine(data.map(i => i.yourAns), FIRST_ROW_TITLES[2] ))
    table.append(getLine(data.map(i => i.score), FIRST_ROW_TITLES[3] ))


    function getFirstLine(data) {
        const container = create('tr')
        container.className = 'table__line main'
        const fullData = [FIRST_ROW_TITLES[0], ...data]
        fullData.forEach((el, idx) => {
            const cell = create('td')
            cell.innerText = el
            cell.className = 'table__line__cell main'
            if(idx === 0) cell.classList.add('strong')
            container.append(cell)
        })
        return container
    }
    function getLine(data, LineCaption) {
        const container = create('tr')
        container.className = 'table__line'
        const fullData = [LineCaption, ...data]
        fullData.forEach((el, idx) => {
            const cell = create('td')
            if(Array.isArray(el)) {
                cell.replaceChildren(...el.map(i => getSubCell(i) ))
                cell.className = 'table__line__cell top'
                cell.lastChild.classList.add('correct')
            } else {
                cell.innerText = el
                cell.className = 'table__line__cell'
            }
            if(idx === 0) cell.classList.add('strong')
            container.append(cell)
        })
        function getSubCell(text) {
            const subCell = create('div')
            subCell.className = 'subcell'
            subCell.innerText = text
            return  subCell
        }

        return container
    }
    
}
