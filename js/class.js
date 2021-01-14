// /* eslint-disable no-unused-vars */
// /* eslint-disable func-style */
// /* eslint-disable require-jsdoc */
//


class Carousel {
    constructor(s) {
        let settings = this._initConfig(s);
        this.container = document.querySelector(settings.containerID);
        this.slides = this.container.querySelectorAll(settings.slideID);

        this.interval = settings.interval;

    }

    _initConfig(o) {
        const p = {containerID: '#carousel', slideID: '.slide', interval: 5000};

        return {...p, ...o};
    }

    _initProps() {
        this.currentSlide = 0;
        this.isPlaying = true;
        this.timerID = null;

        this.SPACE = ' ';
        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';
        this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
        this.FA_PLAY = '<i class="far fa-play-circle"></i>';
        this.FA_PREV = '<i class ="fas fa-angle-left"> </i>';
        this.FA_PLAY = '<i class="far fa-play-circle"></i>';
        this.FA_NEXT = '<i class ="fas fa-angle-right"> </i>';
    }


    _initIndicators() {
        const indicators = document.createElement('div');
        indicators.setAttribute('class', 'indicators');
        indicators.setAttribute('id', 'indicators');

        for (let i = 0; i < this.slides.length; i++) {
            const indicator = document.createElement('span');
            indicator.setAttribute('class', 'indicator');
            indicator.dataset.slideTo = `${i}`;
            if (i === 0) {
                indicator.classList.add('active');
            }
            indicators.appendChild(indicator);
        }

        this.container.appendChild(indicators);
        this.indicatorsContainer = this.container.querySelector('#indicators');
        this.indicators = this.container.querySelectorAll('.indicator');
    }

    _initControls() {
        const controls = document.createElement('div');
        const PREV = `<span id = "prev-btn" class = "control control-prev">${this.FA_PREV}</span>`;
        const NEXT = `<span id = "next-btn" class = "control control-next">${this.FA_NEXT}</span>`;
        const PAUSE = `<span id = "pause-btn" class = "control control-pause">${this.FA_PAUSE}</span>`;
        controls.setAttribute('class', 'controls');
        controls.setAttribute('id', 'controls');
        controls.innerHTML = PREV + NEXT + PAUSE;

        this.container.appendChild(controls);

        this.pauseBtn = this.container.querySelector('#pause-btn');
        this.prevBtn = this.container.querySelector('#prev-btn');
        this.nextBtn = this.container.querySelector('#next-btn');
    }

    _initListeners() {
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.indicatorsContainer.addEventListener('click', this.indicatorsHandler.bind(this));
        document.addEventListener('keydown', this.pressKey.bind(this));
    }

    gotoNth(n) {
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');

        this.currentSlide = (n + this.slides.length) % this.slides.length;
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
    }

    gotoPrev() {
        this.gotoNth(this.currentSlide - 1);
    }

    gotoNext() {
        this.gotoNth(this.currentSlide + 1);
    }

    pause() {
        if (this.isPlaying) {
            clearInterval(this.timerID);
            this.pauseBtn.innerHTML = this.FA_PLAY;
            this.isPlaying = false;
        }
    }

    play() {
        this.timerID = setInterval(() => this.gotoNext(), this.interval);
        this.pauseBtn.innerHTML = this.FA_PAUSE;
        this.isPlaying = true;
    }

    pausePlay() {
        this.isPlaying ? this.pause() : this.play();
    }

    next() {
        this.pause();
        this.gotoNext();
    }

    prev() {
        this.pause();
        this.gotoPrev();
    }

    indicatorsHandler(e) {
        let target = e.target;

        if (target.classList.contains('indicator')) {
            this.pause();
            this.gotoNth(+target.dataset.slideTo);
        }
    }

    pressKey(e) {
        if (e.key === this.LEFT_ARROW) this.prev();
        if (e.key === this.RIGHT_ARROW) this.next();
        if (e.key === this.SPACE) this.pausePlay();
    }

    init() {
        this._initProps();
        this._initIndicators();
        this._initControls();
        this._initListeners();

        this.timerID = setInterval(() => this.gotoNext(), this.interval);
    }

}

class SwipeCarousel extends Carousel {
    _initListeners() {
        super._initListeners();
        this.container.addEventListener('touchstart', this.swipeStart.bind(this));
        this.container.addEventListener('touchend', this.swipeEnd.bind(this));
    }

    swipeStart(e) {
        this.swipeStartX = e.changedTouches[0].pageX;
    };

    swipeEnd(e) {
        this.swipeEndX = e.changedTouches[0].pageX;
        this.swipeStartX - this.swipeEndX > 100 && this.next();
        this.swipeStartX - this.swipeEndX < -100 && this.prev();
    };

}


