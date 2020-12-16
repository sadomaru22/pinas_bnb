document.addEventListener('DOMContentLoaded', function () {
    const main = new Main();
});

class Main {
    constructor() {
        this.header = document.querySelector('.header');
        this.sides = document.querySelectorAll('.side');
        this._observers = [];  //配列を用意する
        this._init();
    }

    set observers(val) {
        this._observers.push(val);
    }  //observersに渡ってきた引数をpush

    get observers() {
        return this._observers; //暗黙の了解(_がついている場合はsetやgetを使って値を設定するという変数なことが多い)
    }

    _init() {
        new MobileMenu();
        this.hero = new HeroSlider('.swiper-container');
        Pace.on('done', this._paceDone.bind(this));  //これをひとまず設定し、
    }

    _paceDone() {　　//こっちでメソッドを呼ぶことで、異なるネットワーク、3Gや、遅い場合などではロードする間にアニメーションなどが完了してしまうという問題を防ぐことができる
        this._scrollInit();
    }

    _inviewAnimation(el, inview) {
        if(inview) {
            el.classList.add('inview');
        }else {
            el.classList.remove('inview');
        }
    }

    _navAnimation(el, inview) {
        if(inview) {
            this.header.classList.remove('triggered');
        } else {
            this.header.classList.add('triggered');
        }
    }

    _sideAnimation(el, inview) {
        if(inview) {
            this.sides.forEach(side => side.classList.add('inview'));
        } else {
            this.sides.forEach(side => side.classList.remove('inview'));
        }
    }

    _textAnimation(el, inview) {  //cbから変更
        if(inview) {
            const ta = new TweenTextAnimation(el);
            ta.animate();
        }
    }

    _toggleSlideAnimation(el, inview) {
        if(inview) {
            this.hero.start();　//オートプレイのアニメーションは画面から外れたときは止めといた方が色々と便利
        } else {
            this.hero.stop();
        }
    }

    _destroyObservers() {
        this.observers.forEach(ob => {
            ob.destroy();
        });
    }

    destroy() {
        this._destroyObservers();
    }

    _scrollInit() {
        this.observers = new ScrollObserver('.nav-trigger', this._navAnimation.bind(this), {once: false});
        this.observers = new ScrollObserver('.cover-slide', this._inviewAnimation);
        this.observers = new ScrollObserver('.appear', this._inviewAnimation);
        this.observers = new ScrollObserver('.tween-animate-title', this._textAnimation, {rootMargin: "-200px 0px"});
        this.observers = new ScrollObserver('.swiper-container', this._toggleSlideAnimation.bind(this), {once: false});
        this.observers = new ScrollObserver('#main-content', this._sideAnimation.bind(this), {once: false, rootMargin: "-300px 0px"});
    }
}

