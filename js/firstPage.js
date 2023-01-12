import helpers from './helpers.js'
import {renderQuizPage} from './quizPage.js'

const {findOne} = helpers

export const renderFirstPage = () => {

    const PAGE_TITLE_ENG = 'Guess the bird by voice!'
    const PAGE_TITLE_RU = 'Угадай птицу по голосу!'
    const STARTBUTTON_TEXT_ENG = 'Start QUIZ'
    const STARTBUTTON_TEXT_RU = 'Играть'
    
    const page = `<div class="game-wrapper">
        <header class="header">
            <h1 class="h1">SongBird</h1>
        </header>

        <div class="content">
            <div class="content__border"></div>
            <h2 class="content__caption">${PAGE_TITLE_RU}</h2>
            <button id="game-start" class="content__button">${STARTBUTTON_TEXT_RU}</button>
            <img class="content__animation" src="assets/img/ptica_sidit_na_vetke_dereva_pod_dojdem.gif" alt="bird">
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
    
    console.log(`
    Самооценка: 270 >>> \n 
    • Вёрстка, дизайн, UI всех трёх страниц приложения +60 (недочёты пишите в дискорд, сам мог что-то упустить) \n
    • Кастомный аудиоплейер с регулятором громкости +30 \n
    • Верхняя панель страницы викторины +20 \n
    • Блок с вопросом +20 \n
    • Блок с вариантами ответов (названия птиц) +60 \n
    • Блок с описанием птицы: +30 \n
    • Кнопка перехода к следующему вопросу +30 \n
    • Extra scope +20 (регулировка громкости сохраняется в  localStorage, и не сбрасывается после перезагрузки игры, а также применяется для всех звуков в игре, в таблице результатов показана последовательность неверных ответов с набранными баллами за конкретный вопрос, разные уведомления в зависимости от результатов, при максимальном количестве баллов кнопка ведёт на стартовую страницу. )
     `)

    root.innerHTML = page

    helpers.findOne('#game-start').addEventListener('click', renderQuizPage)
} 
