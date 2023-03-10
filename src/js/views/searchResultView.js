import icons from "url:../../img/sprite.svg";
import { formatNumber } from "../helper";
import PaginationView from "./paginationView";
import View from "./view";

export default class SearchResult extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector("main");
    this._parentElement.innerHTML = "";

    this.container = document.createElement("div");
    this.container.classList.add("searchresult");
    this._parentElement.appendChild(this.container);
    this._paginationView = new PaginationView(this.container, true);
  }

  render(data) {
    super.render(data);
    this._updateSorted(data.sort);
    this._paginationView.render(data);
    document.title = `Search result for ${data.query}`;
  }

  addHandlerSelectRepository(handler) {
    this.container.addEventListener("click", function (e) {
      const repositoryItem = e.target.closest(".searchresult__item");
      if (!repositoryItem) return;

      handler(repositoryItem.dataset.owner, repositoryItem.dataset.name);
      window.scrollTo(0, 0);
    });
  }

  addHandlerSort(handler) {
    this.container.addEventListener("click", this._handlerSort.bind(this, handler));
  }

  addHandlerPagination(handler) {
    this.container.addEventListener("click", this._handlerPagination.bind(this, handler));
  }

  _handlerPagination(handler, e) {
    this._paginationView.handlerClick(handler, e);
  }

  _handlerSort(handler, e) {
    const itemSelected = e.target.closest("#searchresult-sort > li");

    if (!itemSelected || this._searchSelected.textContent === itemSelected.textContent) return;
    handler(itemSelected.dataset.search);
  }

  _generateMarkup(data) {
    return this._generateMarkupInfo(data.totalCount) + this._generateMarkupList(data.currentPageResult);
  }

  _updateSorted(sortMethod) {
    this._searchSort = document.querySelector("#searchresult-sort");
    this._searchSelected = document.querySelector(".dropdown__default");
    const listItems = this._searchSort.querySelectorAll("li");

    const itemSelected = [...listItems].find((item) => item.dataset.search === sortMethod);
    itemSelected.classList.add("dropdown__item--selected");
    this._searchSelected.textContent = itemSelected.textContent;
  }

  _generateMarkupInfo(data) {
    const formatter = new Intl.NumberFormat(navigator.locale);
    return `
    <div class="searchresult__info">
      <p><span class="searchresult__amount">${formatter.format(data)}</span>&nbsp;repositories found</p>
      <div class="dropdown--mobile">
        <svg class="dropdown__icon">
          <use href="${icons}#sort"></use>
        </svg>
      </div>
      <div class="dropdown">  
        <div class="searchresult__sort dropdown__label">
          sort: <span class="dropdown__default">best match</span>
          <svg class="dropdown__icon">
            <use href="${icons}#chevron-down"></use>
          </svg>
        </div>
        <ul class="dropdown__list" id="searchresult-sort" role="listbox">
          <li class="dropdown__item" role="listitem" data-search="best-match">best match</li>
          <li class="dropdown__item" role="listitem" data-search="stars">stars</li>
          <li class="dropdown__item" role="listitem" data-search="forks">forks</li>
          <li class="dropdown__item" role="listitem" data-search="help-wanted-issues">help-wanted-issues</li>
          <li class="dropdown__item" role="listitem" data-search="updated">updated</li>
        </ul>
      </div>
    </div>
    `;
  }

  _generateMarkupList(data) {
    return `
    <ul class="searchresult__items">
    ${data.map(this._generateMarkupItem.bind(this)).join("")}
    </ul>`;
  }

  _generateMarkupItem(repository) {
    return `
    <li class="searchresult__item" data-owner="${repository.owner.login}" data-name="${repository.name}">
     <div class="searchresult__title">${repository.full_name}</div>  
      <div class="searchresult__item-center">  
        <div class="searchresult__description">
        ${repository.description ? repository.description : ""}
        </div>
        <div class="searchresult__language">
          <img
            src="language-icons/${repository.language?.toLowerCase()}-original.svg"
            alt="language icon"
            class="searchresult__language-icon" onError="this.remove();"/>
          <span class="searchresult__language-text">${repository.language ? repository.language : ""}</span>
        </div>
      </div>
      <div class="searchresult__repository-info">
          <div class="repository__element">
            <svg class="repository__icon">
              <use href="${icons}#star"></use>
            </svg>
            <span class="respository__star-count">${formatNumber(repository.stargazers_count)}</span>
          </div>
          <div class="repository__element">
            <svg class="repository__icon">
              <use href="${icons}#repo-forked"></use>
            </svg>
            <span class="respository__fork-count">${formatNumber(repository.forks)}</span>
          </div>
          <div class="repository__element">
            <svg class="repository__icon">
              <use href="${icons}#view-show"></use>
            </svg>
            <span class="respository__watch-count">${formatNumber(repository.watchers)}</span>
          </div>
        </div>
    </li>
    `;
  }
}
