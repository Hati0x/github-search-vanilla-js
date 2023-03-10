import icons from "url:../../img/sprite.svg";
import SearchView from "./searchView";
import logo from "url:../../img/github-search-logo.png";

import View from "./view";

export default class NavigationView extends View {
  constructor(renderSearch = true) {
    super();

    this._parentElement = document.querySelector("header");

    this.container = document.createElement("div");
    this.container.classList.add("header");
    this._parentElement.appendChild(this.container);
    this._theme = document.documentElement.dataset.theme;
    this._renderSearch = renderSearch;

    this.render();
    this.initTheme();
    if (this._renderSearch) this._searchView = new SearchView();

    this._menuButton = document.querySelector(".menu__button");
    this._darkmodeButton = document.querySelector(".menu__darkmode-btn");
    this._menuContent = document.querySelector(".menu__content");

    this._headerImg = document.querySelector(".header__img");

    this.registerEventHandlers();

    this.initStickyNavObserver();
    this.handleHomeButton();
  }

  registerEventHandlers() {
    this._menuButton.addEventListener("click", this.handleMenuButtonEvent.bind(this));
    this._darkmodeButton.addEventListener("click", this.handleSwitchThemeEvent.bind(this));
  }

  render() {
    super.render(this._renderSearch);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  handleHomeButton() {
    this._headerImg.addEventListener("click", () => window.location.reload());
  }

  initStickyNavObserver() {
    const targetNode = document.querySelector("header");

    const navHeight = this._parentElement.getBoundingClientRect().height;
    const options = {
      root: null,
      rootMargin: `${navHeight}px`,
      threshold: 0,
    };

    this._intersectionObserver = new IntersectionObserver(this.handleStickyNav, options);
    this._intersectionObserver.observe(targetNode);
  }

  handleStickyNav(entries) {
    const nav = document.querySelector(".header");
    const [entry] = entries;

    if (!entry.isIntersecting) {
      nav.classList.add("header--sticky");
    } else {
      nav.classList.remove("header--sticky");
    }
  }

  handleMenuButtonEvent() {
    this._menuButton.classList.toggle("menu__button--open");
    this._menuContent.classList.toggle("menu__content--open");
  }

  initTheme() {
    const icon = document.querySelector(`.menu__darkmode-icon--${this._theme === "light" ? "dark" : "light"}`);
    icon.classList.add("menu__darkmode-icon--active");
  }

  handleSwitchThemeEvent() {
    this._theme = this._theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = this._theme;
    localStorage.setItem("theme", this._theme);
    const icons = document.querySelectorAll(`.menu__darkmode-icon`);
    icons.forEach((icon) => icon.classList.toggle("menu__darkmode-icon--active"));
  }

  _updateIcon() {
    this._darkmodeButton.innerHTML = this._generateMarkupIcon();
  }

  _generateMarkupIcon() {
    return `
    <svg class="menu__darkmode-icon menu__darkmode-icon--light">
      <use href="${icons}#light-fill"></use>
    </svg>
    <svg class="menu__darkmode-icon menu__darkmode-icon--dark">
      <use href="${icons}#dark-fill"></use>
    </svg>`;
  }

  _generateMarkupSearch() {
    return `
    <div class="searchbar-container header__search">
      <form class="search">
        <input type="search" class="search__input" placeholder="search a repository" />
        <button class="search__button" type="submit">
          <svg class="search__icon">
            <use href="${icons}#search"></use>
          </svg>
        </button>
      </form>
    </div>`;
  }

  _generateMarkup(isRenderSearch) {
    return `
    ${isRenderSearch ? this._generateMarkupSearch() : ""} 
       
        <div class="header__title">
          <img class="header__img" src="${logo}" />
        </div>
        <nav class="menu header__menu">
          <button class="menu__button">
            <span>&nbsp;</span>
            <span>&nbsp;</span>
            <span>&nbsp;</span>
          </button>
          <div class="menu__content">
            <button class="menu__darkmode-btn">
              ${this._generateMarkupIcon()}
            </button>
            <ul class="menu__links">
              <li><a href="https://github.com/Hati0x/github-search-vanilla-js" target="_blank">About</a></li>
            </ul>
          </div>
        </nav>
      </div>
    `;
  }
}
