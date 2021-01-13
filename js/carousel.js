// /* eslint-disable no-unused-vars */
// /* eslint-disable func-style */
// /* eslint-disable require-jsdoc */
//


function Carousel(containerID = '#carousel', slideID = '.slide') {
    this.container = document.querySelector(containerID);
    this.slides = this.container.querySelectorAll(slideID);


    this.interval = 2000;

    this._initProps();
    this._initIndicators();
    this._initControls();
    this._initListeners();

}

Carousel.prototype = {

    _initProps: function () {
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
    },


    _initIndicators: function () {
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
    },

    _initControls: function () {
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
    },

    _initListeners: function () {
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.indicatorsContainer.addEventListener('click', this.indicatorsHandler.bind(this));
        document.addEventListener('keydown', this.pressKey.bind(this));
    },

    gotoNth: function (n) {
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
        this.currentSlide = (n + this.slides.length) % this.slides.length;
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
    },

    gotoPrev: function () {
        this.gotoNth(this.currentSlide - 1);
    },

    gotoNext: function () {
        this.gotoNth(this.currentSlide + 1);
    },

    pause: function () {
        if (this.isPlaying) {
            clearInterval(this.timerID);
            this.pauseBtn.innerHTML = this.FA_PLAY;
            this.isPlaying = false;
        }
    },

    play: function () {
        this.timerID = setInterval(() => this.gotoNext(), this.interval);
        this.pauseBtn.innerHTML = this.FA_PAUSE;
        this.isPlaying = true;
    },

    pausePlay: function () {
        this.isPlaying ? this.pause() : this.play();
    },

    next: function () {
        this.pause();
        this.gotoNext();
    },

    prev: function () {
        this.pause();
        this.gotoPrev();
    },

    indicatorsHandler: function (e) {
        let target = e.target;

        if (target.classList.contains('indicator')) {
            this.pause();
            this.gotoNth(+target.dataset.slideTo);
        }
    },

    pressKey: function (e) {
        if (e.key === this.LEFT_ARROW) this.prev();
        if (e.key === this.RIGHT_ARROW) this.next();
        if (e.key === this.SPACE) this.pausePlay();
    },

    init: function () {
        this.timerID = setInterval(() => this.gotoNext(), this.interval);
    },
};


function SwipeCarousel() {
    Carousel.apply(this, arguments);

}

SwipeCarousel.prototype = Object.create(Carousel.prototype);
SwipeCarousel.prototype.constructor = SwipeCarousel;

SwipeCarousel.prototype._initListeners = function () {
    Carousel.prototype._initListeners.apply(this);
    this.container.addEventListener('touchstart', this.swipeStart.bind(this));
    this.container.addEventListener('touchend', this.swipeEnd.bind(this));
}

SwipeCarousel.prototype.swipeStart = function (e) {
    this.swipeStartX = e.changedTouches[0].pageX;
};

SwipeCarousel.prototype.swipeEnd = function (e) {
    this.swipeEndX = e.changedTouches[0].pageX;
    this.swipeStartX - this.swipeEndX > 100 && this.next();
    this.swipeStartX - this.swipeEndX < -100 && this.prev();
};
