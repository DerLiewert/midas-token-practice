(() => {
    "use strict";
    const flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollerBlock = spollerTitle.closest("[data-spoller-block]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerBlock && spollerBlock.classList.toggle("_active");
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveBlock = spollersBlock.querySelector("[data-spoller-block]._active");
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveBlock && spollerActiveBlock.classList.remove("_active");
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    if (spollersBlock.classList.contains("_spoller-init")) {
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        spollerClose.classList.remove("_spoller-active");
                        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                    }
                }));
            }));
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: false
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Проснулся, слежу за объектами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, нет объектов для слежения. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if ("null" !== paramsWatch.root) this.scrollWatcherLogging(`Эмм... родительского объекта ${paramsWatch.root} нет на странице`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`Ой ой, настройку data-watch-margin нужно задавать в PX или %`);
                return;
            }
            if ("prx" === paramsWatch.threshold) {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я вижу ${targetElement.classList}, добавил класс _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не вижу ${targetElement.classList}, убрал класс _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестал следить за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Наблюдатель]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
            if ("lines" === targetElement.dataset.watch && targetElement.classList.contains("_watcher-view")) {
                const imageLinesBlock = targetElement.querySelector(".intro-item-image__lines");
                const imageLines = imageLinesBlock.querySelectorAll(".intro-item-image__line");
                const timeAnimation = 800;
                imageLines.forEach(((line, index) => {
                    line.style.transition = `all .3s ease ${.001 * (timeAnimation - 300) / (imageLines.length - 1) * index}s`;
                    line.style.height = line.dataset.percentHeight + "%";
                }));
            } else if ("stake-item__counter" === targetElement.dataset.watch && targetElement.classList.contains("_watcher-view") && targetElement.nextElementSibling) setTimeout((() => {
                targetElement.nextElementSibling.classList.add("_watcher-view");
            }), 1200); else if ("utility-months" === targetElement.dataset.watch && targetElement.classList.contains("_watcher-view")) {
                let monthElements = targetElement.querySelectorAll(".utility-months__item");
                monthElements.forEach(((monthEl, index) => {
                    monthEl.style.transition = `height .8s ease ${.1 * index}s`;
                    monthEl.style.height = 76.47 + "%";
                }));
            } else if ("utility-dots" === targetElement.dataset.watch && targetElement.classList.contains("_watcher-view")) targetElement.classList.add("_visible"); else if ("counter-in-circle" === targetElement.dataset.watch && targetElement.classList.contains("_watcher-view")) targetElement.closest("[data-circle-block]").querySelector("[data-circle]").classList.add("_watcher-view");
            if (entry.isIntersecting) ;
        }
    }
    flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    var __assign = void 0 && (void 0).__assign || function() {
        return (__assign = Object.assign || function(t) {
            for (var i, n = 1, s = arguments.length; n < s; n++) for (var a in i = arguments[n]) Object.prototype.hasOwnProperty.call(i, a) && (t[a] = i[a]);
            return t;
        }).apply(this, arguments);
    }, CountUp = function() {
        function t(t, i, n) {
            var s = this;
            this.endVal = i, this.options = n, this.version = "2.4.2", this.defaults = {
                startVal: 0,
                decimalPlaces: 0,
                duration: 2,
                useEasing: !0,
                useGrouping: !0,
                useIndianSeparators: !1,
                smartEasingThreshold: 999,
                smartEasingAmount: 333,
                separator: ",",
                decimal: ".",
                prefix: "",
                suffix: "",
                enableScrollSpy: !1,
                scrollSpyDelay: 200,
                scrollSpyOnce: !1
            }, this.finalEndVal = null, this.useEasing = !0, this.countDown = !1, this.error = "", 
            this.startVal = 0, this.paused = !0, this.once = !1, this.count = function(t) {
                s.startTime || (s.startTime = t);
                var i = t - s.startTime;
                s.remaining = s.duration - i, s.useEasing ? s.countDown ? s.frameVal = s.startVal - s.easingFn(i, 0, s.startVal - s.endVal, s.duration) : s.frameVal = s.easingFn(i, s.startVal, s.endVal - s.startVal, s.duration) : s.frameVal = s.startVal + (s.endVal - s.startVal) * (i / s.duration);
                var n = s.countDown ? s.frameVal < s.endVal : s.frameVal > s.endVal;
                s.frameVal = n ? s.endVal : s.frameVal, s.frameVal = Number(s.frameVal.toFixed(s.options.decimalPlaces)), 
                s.printValue(s.frameVal), i < s.duration ? s.rAF = requestAnimationFrame(s.count) : null !== s.finalEndVal ? s.update(s.finalEndVal) : s.callback && s.callback();
            }, this.formatNumber = function(t) {
                var i, n, a, e, r = t < 0 ? "-" : "";
                i = Math.abs(t).toFixed(s.options.decimalPlaces);
                var o = (i += "").split(".");
                if (n = o[0], a = o.length > 1 ? s.options.decimal + o[1] : "", s.options.useGrouping) {
                    e = "";
                    for (var l = 3, h = 0, u = 0, p = n.length; u < p; ++u) s.options.useIndianSeparators && 4 === u && (l = 2, 
                    h = 1), 0 !== u && h % l == 0 && (e = s.options.separator + e), h++, e = n[p - u - 1] + e;
                    n = e;
                }
                return s.options.numerals && s.options.numerals.length && (n = n.replace(/[0-9]/g, (function(t) {
                    return s.options.numerals[+t];
                })), a = a.replace(/[0-9]/g, (function(t) {
                    return s.options.numerals[+t];
                }))), r + s.options.prefix + n + a + s.options.suffix;
            }, this.easeOutExpo = function(t, i, n, s) {
                return n * (1 - Math.pow(2, -10 * t / s)) * 1024 / 1023 + i;
            }, this.options = __assign(__assign({}, this.defaults), n), this.formattingFn = this.options.formattingFn ? this.options.formattingFn : this.formatNumber, 
            this.easingFn = this.options.easingFn ? this.options.easingFn : this.easeOutExpo, 
            this.startVal = this.validateValue(this.options.startVal), this.frameVal = this.startVal, 
            this.endVal = this.validateValue(i), this.options.decimalPlaces = Math.max(this.options.decimalPlaces), 
            this.resetDuration(), this.options.separator = String(this.options.separator), this.useEasing = this.options.useEasing, 
            "" === this.options.separator && (this.options.useGrouping = !1), this.el = "string" == typeof t ? document.getElementById(t) : t, 
            this.el ? this.printValue(this.startVal) : this.error = "[CountUp] target is null or undefined", 
            "undefined" != typeof window && this.options.enableScrollSpy && (this.error ? console.error(this.error, t) : (window.onScrollFns = window.onScrollFns || [], 
            window.onScrollFns.push((function() {
                return s.handleScroll(s);
            })), window.onscroll = function() {
                window.onScrollFns.forEach((function(t) {
                    return t();
                }));
            }, this.handleScroll(this)));
        }
        return t.prototype.handleScroll = function(t) {
            if (t && window && !t.once) {
                var i = window.innerHeight + window.scrollY, n = t.el.getBoundingClientRect(), s = n.top + window.pageYOffset, a = n.top + n.height + window.pageYOffset;
                a < i && a > window.scrollY && t.paused ? (t.paused = !1, setTimeout((function() {
                    return t.start();
                }), t.options.scrollSpyDelay), t.options.scrollSpyOnce && (t.once = !0)) : (window.scrollY > a || s > i) && !t.paused && t.reset();
            }
        }, t.prototype.determineDirectionAndSmartEasing = function() {
            var t = this.finalEndVal ? this.finalEndVal : this.endVal;
            this.countDown = this.startVal > t;
            var i = t - this.startVal;
            if (Math.abs(i) > this.options.smartEasingThreshold && this.options.useEasing) {
                this.finalEndVal = t;
                var n = this.countDown ? 1 : -1;
                this.endVal = t + n * this.options.smartEasingAmount, this.duration = this.duration / 2;
            } else this.endVal = t, this.finalEndVal = null;
            null !== this.finalEndVal ? this.useEasing = !1 : this.useEasing = this.options.useEasing;
        }, t.prototype.start = function(t) {
            this.error || (this.callback = t, this.duration > 0 ? (this.determineDirectionAndSmartEasing(), 
            this.paused = !1, this.rAF = requestAnimationFrame(this.count)) : this.printValue(this.endVal));
        }, t.prototype.pauseResume = function() {
            this.paused ? (this.startTime = null, this.duration = this.remaining, this.startVal = this.frameVal, 
            this.determineDirectionAndSmartEasing(), this.rAF = requestAnimationFrame(this.count)) : cancelAnimationFrame(this.rAF), 
            this.paused = !this.paused;
        }, t.prototype.reset = function() {
            cancelAnimationFrame(this.rAF), this.paused = !0, this.resetDuration(), this.startVal = this.validateValue(this.options.startVal), 
            this.frameVal = this.startVal, this.printValue(this.startVal);
        }, t.prototype.update = function(t) {
            cancelAnimationFrame(this.rAF), this.startTime = null, this.endVal = this.validateValue(t), 
            this.endVal !== this.frameVal && (this.startVal = this.frameVal, null == this.finalEndVal && this.resetDuration(), 
            this.finalEndVal = null, this.determineDirectionAndSmartEasing(), this.rAF = requestAnimationFrame(this.count));
        }, t.prototype.printValue = function(t) {
            var i = this.formattingFn(t);
            this.el && ("INPUT" === this.el.tagName ? this.el.value = i : "text" === this.el.tagName || "tspan" === this.el.tagName ? this.el.textContent = i : this.el.innerHTML = i);
        }, t.prototype.ensureNumber = function(t) {
            return "number" == typeof t && !isNaN(t);
        }, t.prototype.validateValue = function(t) {
            var i = Number(t);
            return this.ensureNumber(i) ? i : (this.error = "[CountUp] invalid start or end value: ".concat(t), 
            null);
        }, t.prototype.resetDuration = function() {
            this.startTime = null, this.duration = 1e3 * Number(this.options.duration), this.remaining = this.duration;
        }, t;
    }();
    const menuLinks = document.querySelectorAll(".header__menu.menu a");
    menuLinks.forEach((link => {
        link.addEventListener("click", functions_menuClose);
    }));
    const menuSpollerBlocks = document.querySelectorAll(".header__menu [data-spoller-block]");
    menuSpollerBlocks.forEach((spollerBlock => {
        const title = spollerBlock.querySelector("[data-spoller]");
        title.addEventListener("click", (() => {
            if (window.innerWidth < 768) return;
            const titleCoords = title.getBoundingClientRect();
            const spollerBody = title.nextElementSibling;
            const spollerBodyWidth = parseInt(window.getComputedStyle(spollerBody).width.match(/\d+/));
            if (document.documentElement.offsetWidth >= titleCoords.left + spollerBodyWidth) {
                spollerBody.style.left = 0;
                spollerBody.style.setProperty("--left", `0px`);
            } else {
                let left = document.documentElement.offsetWidth - (titleCoords.left + spollerBodyWidth);
                spollerBody.style.left = left + "px";
                spollerBody.style.setProperty("--left", `${-left}px`);
            }
        }));
    }));
    const imageLinesBlock = document.querySelector(".intro-item-image__lines");
    const linesPercentHeight = [ 5.88, 14.71, 19.12, 25, 32.35, 41.18, 58.82, 70.59, 85.29, 100 ];
    linesPercentHeight.forEach((percent => {
        let line = document.createElement("span");
        line.classList.add("intro-item-image__line");
        line.setAttribute("data-percent-height", percent);
        imageLinesBlock.append(line);
    }));
    document.querySelectorAll("[data-counter]").forEach((counter => {
        const options = {
            prefix: counter.dataset.counterPrefix ? counter.dataset.counterPrefix : "",
            decimalPlaces: -1 != counter.dataset.counterValue.indexOf(".") ? counter.dataset.counterValue.slice(counter.dataset.counterValue.indexOf(".") + 1).length : 0,
            duration: 1.2,
            scrollSpyOnce: true,
            enableScrollSpy: true
        };
        let demo = new CountUp(counter, counter.dataset.counterValue, options);
        if (!demo.error) demo.start(); else console.error(demo.error);
    }));
    let utilityMonths = document.querySelector("[data-watch=utility-months]");
    let utilityMonthItems = utilityMonths.querySelectorAll(".utility-months__item");
    utilityMonthItems.forEach(((monthEl, index) => {
        let monthElHeight = 76.47;
        let emptyHeight = 100 - monthElHeight;
        let marginBottom = emptyHeight / (utilityMonthItems.length - 1);
        monthEl.style.bottom = marginBottom * index + "%";
    }));
    const dots = [ [ {
        y: 0
    }, {
        y: 0
    }, {
        y: 1
    }, {
        y: 0
    }, null, null, null, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, null, null, null ], [ {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, null, {
        y: 0
    }, {
        y: 0
    }, {
        y: 1
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, null, {
        y: 0
    } ], [ null, null, {
        y: 0
    }, {
        y: 0
    }, {
        y: 1
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    } ], [ null, null, null, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 1
    }, {
        y: 0
    }, {
        y: 0
    }, null ], [ {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 1
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    } ], [ {
        y: 0
    }, {
        y: 0
    }, {
        y: 1
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, null, null ], [ {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 1
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, null, {
        y: 0
    } ], [ null, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 1
    }, {
        y: 0
    }, {
        y: 0
    } ], [ null, null, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 1
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, null, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    } ], [ {
        y: 0
    }, {
        y: 1
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, {
        y: 0
    }, null, null, null, null, null, {
        y: 0
    }, null ] ];
    const dotsContainer = document.querySelector(".utility-dots");
    dots.forEach(((line, index) => {
        let lineDotsElement = document.createElement("div");
        lineDotsElement.classList.add("utility-dots__line");
        line.forEach((dot => {
            let dotElement = document.createElement("span");
            if (dot) if (dot.y) dotElement.classList.add("_yellow"); else dotElement.style.transition = `opacity .8s ease ${getRandomDelay(0, .7)}s, transform .8s ease ${getRandomDelay(0, .7)}s`; else dotElement.style.opacity = "0";
            lineDotsElement.append(dotElement);
        }));
        dotsContainer.append(lineDotsElement);
    }));
    function getRandomDelay(min, max) {
        return Math.random() * (max - min) + min;
    }
    let hoverItem = document.querySelectorAll("[data-hover]");
    hoverItem.forEach((item => {
        item.addEventListener("mousemove", (e => {
            move(item, e.pageX, e.pageY);
        }));
        item.addEventListener("mouseout", (e => {
            resetTransform(item);
        }));
    }));
    function move(item, x, y) {
        item.children[0].classList.add("card-active");
        let itemCoords = item.getBoundingClientRect();
        let xser = item.offsetLeft + itemCoords.width / 2;
        let yser = item.offsetTop + itemCoords.height / 2;
        let otnX = x - xser;
        let otnY = y - yser;
        let raznX = otnX / itemCoords.width * 100 * 2;
        let raznY = otnY / itemCoords.height * 100 * 2;
        let trX = raznY / 100 * 6 * -1;
        let trY = raznX / 100 * 6;
        trX = Math.round(1e3 * trX) / 1e3;
        trY = Math.round(1e3 * trY) / 1e3;
        item.children[0].style.transform = "rotateY(" + trY + "deg) rotateX(" + trX + "deg) rotateZ(0deg)";
    }
    function resetTransform(item) {
        item.children[0].classList.remove("card-active");
        item.children[0].style.transform = `rotateY(0deg) rotateX(0deg) rotateZ(0deg)`;
    }
    window.addEventListener("scroll", buyImageScroll);
    setTimeout((() => {
        buyImageScroll();
    }), 100);
    function buyImageScroll() {
        if (!document.querySelector(".page__buy.buy").classList.contains("_watcher-view")) return;
        const buyStepImageBlock = document.querySelectorAll(".buy-step__image");
        buyStepImageBlock.forEach((imageBlock => {
            const coords = imageBlock.getBoundingClientRect();
            if (coords.top <= document.documentElement.clientHeight) {
                let imageBlockHeightShow = document.documentElement.clientHeight - coords.top;
                imageBlock.querySelector("img").style.top = 100 - 100 * imageBlockHeightShow / (document.documentElement.clientHeight + coords.height) + "%";
                imageBlock.querySelector("img").style.transform = "translateY(-50%)";
            }
        }));
    }
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
    headerScroll();
})();