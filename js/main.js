// jshint esversion:6
/* eslint camelcase: off */
(function (w, d) {
  'use strict'
  // variables
  const G = {
    URL: 'https://opentdb.com/api.php?amount=5',
    fdata: {}, // fetched data variable
    SECONDS: 30, // time for questions to answer
    elems: {}, // all elements get by ids loader, button, getMainDiv, getQuestio, getMessage, starBtn, star, stat, seco, imag
    quest: Number(readValue()[0]) || 0,
    score: Number(readValue()[1]) || 0
  }

  function dataLoaded (data) {
    // set data to (d = document) as global variable
    G.fdata = data.results
    // when loaded data hide loader (spiner)
    G.elems.loader.style.display = 'none'
    // ALL things shoud be loaded to start the game UI
    // read localStorage if there is none show message becouse it's string it will be NOT falsy
    if (!readValue()[0]) {
      G.elems.star.innerHTML = 'This game is using <a href="https://en.wikipedia.org/wiki/Web_storage#Local_and_session_storage" target="_blank" rel="noopener noreferrer">localStorage</a>.'
    }
    if (G.quest > G.fdata.length) {
      G.quest = 0
      G.score = 0
    }
    G.elems.starBtn.addEventListener('click', start)
  }

  d.addEventListener('DOMContentLoaded', init.bind(G, this))
  function init () {
    const button = d.getElementById('starBtn')
    const getMainDiv = d.getElementById('main')
    const getQuestio = d.getElementById('ques')
    const getMessage = d.getElementById('mess')
    const starBtn = d.getElementById('starBtn')
    const star = d.getElementById('star')
    const stat = d.getElementById('usta')
    const scor = d.getElementById('usco')
    const seco = d.getElementById('seco')
    const imag = d.getElementById('imag')
    const loader = d.getElementById('loader')
    // loader (spiner) on init show counting percents
    for (let i = 0; i <= 100; i++) {
      (function (ind) {
        setTimeout(function () {
          loader.childNodes[2].nodeValue = ind + '%'
        }, 100 + (10 * ind))
      })(i)
    }
    // set elements scor, loader, button, getMainDiv, getQuestio, getMessage, starBtn, star, stat, seco, imag
    this.elems = { scor, loader, button, getMainDiv, getQuestio, getMessage, starBtn, star, stat, seco, imag }
    starBtn.innerText = (G.quest > 0) ? 'continue' : 'start'
  }

  function start () {
    if (G.quest >= G.fdata.length) {
      G.quest = 0
      G.score = 0
      createItem(0, 0) // set local storage score and quest 0
    }
    // hide message
    hide.call(G.elems.getMessage)
    // add click eventlistener on main div for answer
    addQuestions()
    setTimeout(show, 500)
    countdown()
    updateStat()
    G.elems.getMainDiv.addEventListener('click', loopElems) // add event listener to answers
  }

  function addQuestions () {
    const {
      category,
      incorrect_answers,
      correct_answer,
      question
    } = G.fdata[Number(G.quest)] // destructure variables
    const ins = getRandomIntInclusive(0, incorrect_answers.length) // real answer ID
    G.trueA = 'id' + ins // the real answer variable
    const incorrect = [...incorrect_answers] // copy new array of incorect
    incorrect.splice(ins, 0, correct_answer) // inject wit true answer incorect answer array
    const ans = []
    for (let i = 0, len = incorrect.length; i < len; i++) {
      ans.push(new CreateElem('button', 'btn tips trans', 'id' + i, decodeEntities(incorrect[i])))
    }
    ans.map(el => G.elems.getMainDiv.appendChild(el))
    G.elems.imag.innerText = category // category add
    const qu = new CreateElem('div', 'q', 'q', decodeEntities(question)) // questions adding
    G.elems.getQuestio.appendChild(qu)
  }

  // when clicked answer load this function
  function loopElems (elem) {
    // return false if not answer button
    if (!elem.target.classList.contains('tips')) return false
    // add class user selected answer
    sele.call(elem.target)

    const getAllansw = [...document.getElementsByClassName('tips')]
    getAllansw.forEach(element => {
      if (element.id !== G.trueA) {
        nno.call(element)
      } else {
        yyes.call(element)
      }
      element.disabled = true
      element.style.pointerEvents = 'none'
    })

    const answ = document.getElementById('id' + G.trueA)
    if (elem.target.id === G.trueA) {
      ++G.score
      createItem(G.quest, G.score)
      sele.bind(answ)
      yyes.call(G.elems.getQuestio)
      w.navigator.vibrate(30) // vibrate for true answer
    } else {
      nno.call(G.elems.getQuestio)
      nno.bind(answ)
      w.navigator.vibrate(100) // vibrate for wrong answer
    }
    G.elems.getQuestio.className = 'bg'
    nextQuest()
  }
  function checkIsAllAnswered () {
    if (G.quest === G.fdata.length) {
      G.elems.star.innerText = 'Your score: ' + G.score + '/' + G.fdata.length
      if (G.fdata.length === G.score) {
        G.elems.star.innerText += '\nvictory'
        G.elems.starBtn.innerText = 'Repeat'
      } else {
        G.elems.starBtn.innerText = 'Improve'
      }
      // set reset all stuff
      G.quest = 0
      G.score = 0
      createItem(0, 0)
      G.elems.getMessage.classList.remove('hide')
      return true
    }
    return false
  }

  function nextQuest () {
    clearTimeout(G.tim)
    G.SECONDS = 30
    G.tim = 0
    G.quest++ // increase questions
    createItem(++readValue()[0], readValue()[1])
    setTimeout(() => {
      if (checkIsAllAnswered()) {
        remElements('img')
        remElements('q')
        remElements('main')
        return false
      } else {
        remElements('img')
        remElements('q')
        remElements('main')
        addQuestions()
        setTimeout(show, 500)
        countdown()
        updateStat()
      }
    }, 1500)
  }
  // remove elements
  function remElements (elementId) {
    const element = document.getElementById(elementId)
    if (element) {
      if (element.children.length > 0) {
        element.innerHTML = ''
      } else {
        element.parentNode.removeChild(element)
      }
    }
  }
  // add class hide
  function hide () {
    if (typeof this !== 'undefined') {
      this.classList.add('hide')
    }
  }
  // add class selse
  function sele () {
    if (typeof this !== 'undefined') {
      this.classList.add('sele')
    }
  }
  // add class yyes
  function yyes () {
    if (typeof this !== 'undefined') {
      this.classList.add('yyes')
    }
  }
  // add class nno
  function nno () {
    if (typeof this !== 'undefined') {
      this.classList.add('nno')
    }
  }

  // Countdown time for one questions
  function countdown () {
    G.elems.seco.innerText = G.SECONDS
    if (--G.SECONDS > 0) {
      G.tim = setTimeout(() => {
        countdown()
      }, 1000)
    } else {
      nextQuest()
    }
  }
  function CreateElem (e, className, id, text) {
    if (!(this instanceof CreateElem)) return new CreateElem(e, className, id)
    e = document.createElement(e)
    if (id) e.id = id
    if (className) e.className = className
    if (text) e.innerText = text
    return e
  }

  function show () {
    const elems = [...document.getElementsByClassName('tips')]
    for (let i = elems.length - 1; i >= 0; i--) {
      elems[i].classList.toggle('trans')
    }
  }

  // statistics for questions numbers
  function updateStat () {
    G.elems.stat.innerText = Number(G.quest) + 1 + '/' + G.fdata.length
    G.elems.scor.innerText = G.score
  }

  // helper function random for random stuff
  function getRandomIntInclusive (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
  }

  // helper function to decodeEntities from stackoverflow.com
  const decodeEntities = (function () {
    // this prevents any overhead from creating the object each time
    const element = document.createElement('div')

    function decodeHTMLEntities (str) {
      if (str && typeof str === 'string') {
        // strip script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '')
        element.innerHTML = str
        str = element.textContent
        element.textContent = ''
      }

      return str
    }

    return decodeHTMLEntities
  })()
  // Local Storage create item
  function createItem (q, s) {
    if (storageAvailable('localStorage')) {
      w.localStorage.setItem('Game-guestionaire-question', q)
      w.localStorage.setItem('Game-guestionaire-score', s)
    } else console.log('No localstorage')
  }
  // Local Storage read item
  function readValue () {
    if (storageAvailable('localStorage')) {
      const x = w.localStorage.getItem('Game-guestionaire-question')
      const a = w.localStorage.getItem('Game-guestionaire-score')
      return [x, a]
    } else console.log('No localstorage')
  }
  // Local Storage is Available
  function storageAvailable (type) {
    try {
      const storage = w[type]
      const x = '__storage_test__'
      storage.setItem(x, x)
      storage.removeItem(x)
      return true
    } catch (e) {
      return false
    }
  }
  function CheckError (response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json()
    } else {
      throw Error(response.statusText)
    }
  }
  // fetch data from URL
  w.fetch(G.URL)
    .then(CheckError)
    .then((json) => dataLoaded(json))
})(window, document)
