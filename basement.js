'use strict'

// Игра в лампы
class Lamps {
  game;
  lamps = [];
  startQueue;
  finishQueue = [];
  srcON;
  srcOFF;
  counter = 5;
  check = false;

  constructor({srcON, srcOFF, id, delay, lampTime, textWin, textLose, hrefLose}) {
    this.game = document.querySelector(`#${id}`)
    this.srcON = srcON
    this.srcOFF = srcOFF


      this.game.innerHTML = `
        <div class="game__wrapper">
          <div class="lamp">
            <img class="lamp__img" src="${srcOFF}">
            <img class="lamp__img" src="${srcOFF}">
            <img class="lamp__img" src="${srcOFF}">
            <img class="lamp__img" src="${srcOFF}">
            <img class="lamp__img" src="${srcOFF}">
          </div>
        </div>
      `

    this.lamps = this.game.querySelectorAll('.lamp__img')
    this.listeners({lampTime, textWin, textLose, hrefLose})
    this.start(delay, lampTime)
    this.activateLinks(false)
  }


  listeners({lampTime, textWin, textLose, hrefLose}) {
    this.check = false;
    this.lamps.forEach((el, i) => {
      el.addEventListener('click', () => {
        if(this.counter) {
          this.finishQueue.push(i)
          el.src = this.srcON
          setTimeout(() => {
            el.src = this.srcOFF
          }, lampTime-100)
          this.counter--
        }
        if(this.counter == 0) {
          if(this.diff(this.startQueue, this.finishQueue)) {
            this.activateLinks(true)
            this.popup(true, hrefLose, textWin)
          }
          else {
            this.activateLinks(false)
            this.popup(false, hrefLose, textLose)
          }
        }
      })
    })
  }


  start(delay, lampTime) {
    setTimeout(() => {
      this.startQueue = []
      this.lamps.forEach(el => {
        this.startQueue.push(Math.abs(this.randomInteger(0, 4)))
      })
      this.startQueue.forEach((el, i) => {
        setTimeout(() => {
          this.lamps[el].src = this.srcON
          setTimeout(() => {
            this.lamps[el].src = this.srcOFF
          }, lampTime);
        }, (lampTime+100)*(i+1));
      })
    }, delay)
  }


  activateLinks(_bull) {
    if (!_bull) {
      document.querySelectorAll('button').forEach(el => {
        el.style.pointerEvents = 'none'
      })
    } else {
      document.querySelectorAll('button').forEach(el => {
        el.style.pointerEvents = 'auto'
      })
    }
  }


  randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }


  diff(a1, a2) {
    for(let i = 0; i < a1.length; i++) {
      if(a1[i] != a2[i]) return false
    }
    return true
  }


  popup(isWin, href, text) {
    let lamp = this.game.querySelector('.lamp')
    let h = lamp.offsetHeight
    lamp.innerHTML = ''
    lamp.style.height = h + 'px'
    if(isWin) {
      lamp.classList.add('lamp_win')
      lamp.insertAdjacentHTML('beforeend', `
        <span class="lamp__alert lamp__alert_win">
        Дверь отворилась...
        ${text}</span>
      `)
    }
    else {
      lamp.classList.add('lamp_lose')
      lamp.insertAdjacentHTML('beforeend', `
        <div class="lamp__alert">
          <span>
          Дверь не открылась...
          ${text}
          </span>
          <a href="${href}">Что дальше?</a>
        </div>
      `)
    }
  }
}


  let lamps = new Lamps({
    srcON: 'lamp_on.png',
    srcOFF: 'lamp_off.png',
    id: 'game',
    delay: 10000,
    lampTime: 400,
    textWin: 'Иван попал в объятья темноты коварного тоннеля',
    textLose: 'Спустя две недели Иван засыпает.',
    hrefLose: 'home.html'
  })




/*
srcON -- путь к включенной лампочке (изображение)
srcOFF -- путь к вЫключенной лампочке (изображение)
id -- id блока, в которыый нужно вставить игру
delay -- задержка при входе на страницу (мс)
lampTime -- количество времени, которое светит лампочка (мс)
textWin -- тект победы
textLose -- текст поражения
hrefLose -- ссылка на страницу после проигрыша
*/