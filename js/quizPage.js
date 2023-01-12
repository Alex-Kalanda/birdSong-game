import helpers from './helpers.js'
import birdsData from '../data/birds.js'
import questionTitles from '../data/questionTitles.js'
import Player from './audioPlayer.js'
import { renderResultPage } from './resultPage.js'

const {create, findOne, findSome, shuffle, getRandomItem} = helpers

export const renderQuizPage = () => {
    const root = findOne('#main')

    const page = `<div class="game-wrapper">
        <header class="header">
            <h1 class="h1">SongBird</h1>
            <div class="header__score">
                <span class="header__score__title">score:</span>
                <span id="current-score" class="header__score__value">0</span>
            </div>
        </header>
        <section class="questions-title">
            <ul class="title-list">
                <li class="title-list__item"></li>
                <li class="title-list__item"></li>
                <li class="title-list__item"></li>
                <li class="title-list__item"></li>
                <li class="title-list__item"></li>
                <li class="title-list__item"></li>
            </ul>
        </section>
        <section class="quiz">
            <div class="quiz__current current">
                <div class="current__img">
                    <img id="active-img" alt="current">
                    <img src="assets/img/whoisit.png" id="dove-img" alt="dove">
                </div>                    
                <div id="active-name" class="current__name"></div>
                <div id="active-audio" class="current__audio"></div>
            </div>
            <div class="quiz__controls">
                <ul id="variants" data-id="3" class="quiz__controls__variants variants"></ul>
                <div class="quiz__controls__selected selected">
                    <div class="selected__info">
                        <span id="checked-var-name-ru" class="selected__info__title"></span>
                        <span id="checked-var-name-en" class="selected__info__subtitle"></span>
                        <div class="selected__info__audio"></div>
                        <p id="checked-var-descr" class="selected__info__desc"></p>
                    </div>
                    <div class="selected__image">
                        <div class="selected__image__pic"></div>
                        <button id="next-q" class="selected__image__btn">next</button>
                    </div>
                </div>
            </div>
        </section>
    </div>`

    root.className = 'background'
    root.innerHTML = page

    createGame()
}

const createGame = () => {
    const state = {
        qCounter: 0,
        totalScore: 0,
        isDisabled: true,
        isCorrectAns: false,
        correctId: null,
        actualCost: 5,
        answer: {
            name: null,
            image: null,
            audio: null
        },
        variants: null,
        sound: {
            question: null,
            description: null,
            right: new Player('assets/sound/true.mp3'),
            wrong: new Player('assets/sound/false.mp3'),
        },
        results: {
            answers: []
        }

    }

    /* info containers */
    const scoreNode = findOne('#current-score'),
        activeImg = findOne('#active-img'),
        doveImg = findOne('#dove-img'),
        activeName = findOne('#active-name'),
        activeAudio = findOne('#active-audio')

    const checkedName = findOne('#checked-var-name-ru'),
        checkedNameEng = findOne('#checked-var-name-en'),
        checkedImageContainer = findOne('.selected__image__pic'),
        checkedAudioContainer = findOne('.selected__info__audio'),
        checkedDescr = findOne('#checked-var-descr')
    
    const selectedInfo = findOne('.selected__info'),
        nextBtnBlock = findOne('.selected__image')
    
    const variants = findOne('#variants'),
        qTitles = findSome('.title-list__item')
   
    const nextBtn = findOne('#next-q')

    //first question
    loadQuestion()

    nextBtn.addEventListener('click', loadQuestion)


    function loadQuestion () {

        if(state.sound.description) state.sound.description.pause()
        if(state.sound.question) state.sound.question.pause()

        if (birdsData.length - state.qCounter === 1) {
            nextBtn.removeEventListener('click', loadQuestion)
            nextBtn.addEventListener('click', renderResultPage.bind(null, state.results.answers))
            nextBtn.innerText = 'results'
        } 

        const questions = shuffle([...birdsData[state.qCounter]])
        const activeQ = getRandomItem(questions)

        const varListNodes = questions.map(createVariantNode)
        variants.replaceChildren(...varListNodes)
        qTitles.forEach((el, idx) => el.innerText = questionTitles[idx])

        const audioQ = new Player(activeQ.audio)
        activeAudio.replaceChildren(audioQ.getNode())
        state.sound.question = audioQ
        audioQ.play()
        activeImg.src = activeQ.image
        state.correctId = activeQ.id
        makeDefaultNodes()

        variants.addEventListener('click', checkAnswer)
        
        state.variants = questions
        state.answer.name = activeQ.name
        state.results.answers[state.qCounter] = { rightAns: activeQ.name, yourAns: [], score: null }
        state.answer.audio = activeQ.audio
        state.actualCost = 5
        state.isDisabled = true
        state.isCorrectAns = false
        state.qCounter++

        console.clear()
        console.log('Самооценка в консоле на стартовой странице.')
        console.log('Для тестирования - правильный ответ >>>>  ' + activeQ.name)

        selectedInfo.classList.add('full')
        nextBtnBlock.classList.add('hide')

        markQuestionTitle(state.qCounter - 1)
        checkDeps()
    }
    function checkDeps () {
        nextBtn.disabled = state.isDisabled
        scoreNode.innerText = state.totalScore
        activeImg.className = state.isCorrectAns ? 'active' : ''
        doveImg.className = state.isCorrectAns ? 'hide' : ''
    }
    function markQuestionTitle (counter) {
        qTitles.forEach((el) => { el.classList.remove('active') })
        qTitles[counter].classList.add('active')
    }
    function createVariantNode (data, pos) {
        const variantNode  = create('li')
        variantNode.className = 'variants__item'
        variantNode.dataset.id = data.id
        variantNode.dataset.pos = pos
        variantNode.innerText = data.name
        return variantNode
    }
    function makeDefaultNodes () {
        activeImg.className = ''
        activeName.innerText = '********'
        checkedName.innerText = ''
        checkedNameEng.innerText = ''
        checkedDescr.innerText = 'Послушайте аудио и выберите вариант из предложенных.'
        checkedImageContainer.innerHTML = ''
        checkedAudioContainer.innerHTML = ''
    }
    function showBirdInfo (data) {
        checkedName.innerText = data.name
        checkedNameEng.innerText = data.species
        checkedDescr.innerText = data.description
        const image = create('img')
        image.src = data.image
        checkedImageContainer.replaceChildren(image)
        const descPlayer = new Player(data.audio)
        if(state.sound.description) {state.sound.description.pause()}
        state.sound.description = descPlayer.init()
        checkedAudioContainer.replaceChildren(descPlayer.getNode())
    }
    function checkAnswer (e) {
        if(e.target.classList.contains('variants__item')) {

            state.results.answers[state.qCounter - 1].yourAns.push(e.target.innerText)
            
            if (+e.target.dataset.id === state.correctId) {
                state.results.answers[state.qCounter - 1].score = state.actualCost
                state.totalScore += state.actualCost
                state.isDisabled = false
                state.isCorrectAns = true
                state.sound.question.pause()
                state.sound.right._play()
                e.target.classList.add('correct')
                activeName.innerText = state.answer.name
                variants.removeEventListener('click', checkAnswer)
                variants.addEventListener('click', checkBirdInfo)
                checkDeps()
            } else {
                e.target.classList.add('disabled')
                state.actualCost--
                state.sound.wrong._play()
            }


            selectedInfo.classList.remove('full')
            nextBtnBlock.classList.remove('hide')
            
            showBirdInfo(state.variants[+e.target.dataset.pos])
        }
    }
    function checkBirdInfo (e) {
        if(e.target.classList.contains('variants__item')) {
            showBirdInfo(state.variants[+e.target.dataset.pos])
        }
    }
}