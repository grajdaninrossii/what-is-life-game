'use strict'

// Игра в лампы
class Lamps {

  game;
  srcON;
  srcOFF;
  startQueue;
  initClick = true;
  lampLock = false;
  lamps = [];
  finishQueue = [];
  lampLightCount = 3;
  check = false;

  constructor({ srcON, srcOFF, id, lampTime, textWin, textLose, hrefLose }) {
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
    this.listeners({ lampTime, textWin, textLose, hrefLose })
    this.activateLinks(false)
  }

  listeners({ lampTime, textWin, textLose, hrefLose }) {
    this.check = false;
    this.lamps.forEach((el, i) => {
      el.addEventListener('click', () => {
        console.log(this.lampLock)
        if (!this.lampLock) {
          if (this.initClick) {
            this.initClick = false
            this.start(lampTime)
            this.lithtLamp(el, lampTime)
            return
          }
          if (this.lampLightCount) {
            this.finishQueue.push(i)
            this.lithtLamp(el, lampTime)
            this.lampLightCount--
          }
          if (this.lampLightCount == 0) {
            if (this.diff(this.startQueue, this.finishQueue)) {
              this.activateLinks(true)
              this.popup(true, hrefLose, textWin)
            }
            else {
              this.activateLinks(false)
              this.popup(false, hrefLose, textLose)
            }
          }
        }
      })
    })
  }

  start(lampTime) {
    setTimeout(() => {
      this.startQueue = []
      let added = 0
      while (added < this.lampLightCount) {
        let randIdx = Math.abs(this.randomInteger(0, this.lamps.length - 1))
        if (!this.startQueue.includes(randIdx)) {
          this.startQueue.push(randIdx);
          added++;
        }
      }

      this.lamps.forEach((_, i) => {
        if (i < this.lampLightCount) {
          this.startQueue.push()
        }
      })
      this.lampLock = true;

      // Создаем массив промисов для каждой лампочки
      const promises = this.startQueue.map((el, i) => {
        return new Promise(resolve => {
          setTimeout(() => {
            this.lamps[el].src = this.srcON;

            setTimeout(() => {
              this.lamps[el].src = this.srcOFF;
              resolve();
            }, lampTime);
          }, (lampTime + 100) * (i + 1));
        });
      });

      // Ждем завершения всех промисов
      Promise.all(promises)
        .then(() => console.log("Все лампочки отработали"))
        .catch(error => console.error("Ошибка в анимации лампочек:", error))
        .finally(() => this.lampLock = false);
    }, 100)
  }

  lithtLamp(el, lampTime) {
    el.src = this.srcON
    setTimeout(() => {
      el.src = this.srcOFF
    }, lampTime - 100)
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
    for (let i = 0; i < a1.length; i++) {
      if (a1[i] != a2[i]) return false
    }
    return true
  }

  popup(isWin, href, text) {
    let lamp = this.game.querySelector('.lamp')
    let h = lamp.offsetHeight
    lamp.innerHTML = ''
    lamp.style.height = h + 'px'
    if (isWin) {
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
  lampTime: 850,
  textWin: 'Иван попал в объятья темноты',
  textLose: 'Спустя две недели Иван засыпает.',
  hrefLose: 'home.html'
})




/*
srcON -- путь к включенной лампочке (изображение)
srcOFF -- путь к вЫключенной лампочке (изображение)
id -- id блока, в которыый нужно вставить игру
lampTime -- количество времени, которое светит лампочка (мс)
textWin -- тект победы
textLose -- текст поражения
hrefLose -- ссылка на страницу после проигрыша
*/