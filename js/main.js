// jshint esversion:6
/* eslint camelcase: off */
(function (w, d) {
  'use strict'
  const SECONDS = 30 // time for questions to answer
  let star
  let starBtn
  let getMainDiv
  let getQuestio
  let transwer
  let score = 0
  let getMessage
  let que = 0
  let stat
  let seco
  let seconds = SECONDS
  let tim = 0
  let imag
  const URL = 'https://opentdb.com/api.php?amount=50'
  const fetchData = async () => {
    try {
      const response = await window.fetch(URL)
      const json = await response.json()
      return json
    } catch (error) {
      console.log(`An error occurred.${error}`)
    }
  }
  // load questions
  let questions
  (async () => {
    const data = await fetchData()
    questions = data.results
    loaded()
  })()

  // loader animations percents counts
  const stufload = () => {
    const loader = d.getElementById('loader')
    for (let i = 0; i <= 100; i++) {
      (function (ind) {
        setTimeout(function () {
          loader.childNodes[2].nodeValue = ind + '%'
        }, 100 + (10 * ind))
      })(i)
    }
  }

  d.addEventListener('DOMContentLoaded', () => {
    stufload()
  })

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

  function CreateElem (e, className, id, text, src) {
    if (!(this instanceof CreateElem)) return new CreateElem(e, className, id)
    e = document.createElement(e)
    if (id) e.id = id
    if (className) e.className = className
    if (text) e.innerText = text
    if (src) {
      e.src = src
      e.setAttribute('alt', 'img')
    }
    return e
  }

  function remElements (elementId) {
    const element = document.getElementById(elementId)
    if (element) {
      if (element.children.length) {
        while (element.firstChild) {
          element.removeChild(element.firstChild)
        }
      } else {
        element.parentNode.removeChild(element)
      }
    }
  }

  function loaded () {
    getMainDiv = document.getElementById('main')
    getQuestio = document.getElementById('ques')
    getMessage = document.getElementById('mess')
    starBtn = document.getElementById('starBtn')
    star = document.getElementById('star')
    stat = document.getElementById('stat')
    seco = document.getElementById('seco')
    imag = document.getElementById('imag')
    getMainDiv.addEventListener('mouseup', loopElems)
    d.getElementById('loader').style.display = 'none'

    starBtn.innerHTML = 'start'
    if (!w.localStorage.wZfZrT2N14M6NdG9bbrI) {
      const el = document.createElement('p')
      const di = document.createElement('div')
      el.innerHTML = 'This game is using <a href="https://en.wikipedia.org/wiki/Web_storage#Local_and_session_storage" target="_blank" rel="noopener noreferrer">localStorage</a>. By playing you agree to store data in localStorage'
      di.appendChild(el)
      starBtn.parentNode.insertBefore(di, starBtn.nextSibling)
    }
    starBtn.addEventListener('click', start);
    [que, score] = [Number(readValue()[0]), Number(readValue()[1])]
    if (que > 0) starBtn.innerText = 'continue'
  }

  function getRandomIntInclusive (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
  }

  function addQuestions (ques) {
    // check if counter equal with data questions
    if (que === questions.length) que = 0
    const {
      category,
      incorrect_answers,
      correct_answer,
      question
    } = questions[ques] // destructure variables
    imag.innerText = category
    const ins = getRandomIntInclusive(0, incorrect_answers.length)
    transwer = 'id' + ins // the real answer variable
    incorrect_answers.splice(ins, 0, [correct_answer])
    const qu = new CreateElem('div', 'q', 'q', decodeEntities(question))
    const lenthOfRes = incorrect_answers.length
    const ans = []
    for (let i = 0; i < lenthOfRes; i++) {
      ans.push(
        new CreateElem(
          'button',
          'btn tips trans',
          'id' + i,
          decodeEntities(incorrect_answers[i])
        )
      )
    }
    ans.map(el => getMainDiv.appendChild(el))
    getQuestio.appendChild(qu)
  }

  function show () {
    const elems = [...document.getElementsByClassName('tips')]
    for (let i = elems.length - 1; i >= 0; i--) {
      elems[i].classList.toggle('trans')
    }
  }

  function updateStat () {
    const va = que
    stat.innerText = va + 1 + '/' + questions.length
  }

  function start () {
    addQuestions(que)
    setTimeout(show, 500)
    hide.call(getMessage)
    countdown()
    updateStat()
  }

  function loopElems (elem) {
    if (!elem.target.classList.contains('tips')) return false
    clearTimeout(tim)
    sele.call(elem.target)
    const getAllansw = [...document.getElementsByClassName('tips')]
    getAllansw.forEach(element => {
      if (element.id !== transwer) {
        nno.call(element)
      } else {
        yyes.call(element)
      }
      element.disabled = true
      element.style.pointerEvents = 'none'
    })
    const elems = document.getElementById('id' + que)

    if (elem.target.id === transwer) {
      sele.bind(elems)
      yyes.call(getQuestio)
      score++
    } else {
      nno.call(getQuestio)
      nno.bind(elems)
      w.navigator.vibrate(30)
    }
    nextQuest()
  }

  function nextQuest () {
    que++
    seconds = SECONDS
    createItem(que, score)
    setTimeout(() => {
      show()
      setTimeout(() => {
        remElements('img')
        remElements('q')
        remElements('main')
        getQuestio.className = 'bg'
        if (que === questions.length) {
          que = 0
          star.innerText = 'Your score: ' + score + '/' + questions.length
          if (questions.length === score) {
            star.innerText += '\nvictory'
            starBtn.innerText = 'Repeat'
          } else {
            starBtn.innerText = 'Improve'
          }
          getMessage.classList.remove('hide')
          score = 0
          createItem(que, score)
        }
        if (que > 0) start()
      }, 0)
    }, 1500)
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
    seco.innerText = seconds
    if (--seconds > 0) {
      tim = setTimeout(() => {
        countdown()
      }, 1000)
    } else {
      nextQuest()
      clearTimeout(tim)
    }
  }
  // Local Storage create item
  function createItem (q, s) {
    if (storageAvailable('localStorage')) {
      w.localStorage.setItem('wZfZrT2N14M6NdG9bbrI', q)
      w.localStorage.setItem('d2SemiF4K6jUP1rrLI9j', s)
    } else console.log('No localstorage')
  }
  // Local Storage read item
  function readValue () {
    if (storageAvailable('localStorage')) {
      const x = w.localStorage.getItem('wZfZrT2N14M6NdG9bbrI')
      const a = w.localStorage.getItem('d2SemiF4K6jUP1rrLI9j')
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
})(window, document)
