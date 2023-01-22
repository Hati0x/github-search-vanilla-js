import * as icons from "../../img/sprite.svg";
import View from "./view";

export default class PaginationView extends View {
  constructor(parentElement, showCurrentPage = true) {
    super();
    this._parentElement = parentElement;
    this.container = document.createElement("div");
    this.container.classList.add("pagination");
    this._showCurrentPage = showCurrentPage;
  }

  handlerClick(handler, e) {
    const btn = e.target.closest("#pagination-search > .btn");
    if (!btn || btn.classList.contains("btn--disabled")) return;
    if (btn.classList.contains("pagination__previous")) handler(false, -1);
    if (btn.classList.contains("pagination__next")) handler(false, 1);
    this._parentElement.scrollIntoView(true);
  }

  _generateMarkup(data) {
    return `
    <div class="pagination" id="pagination-search" data-${this._name}>
      <button class="pagination__previous btn ${data.currentPage === 1 ? "btn--disabled" : ""}">
        <svg class="pagination__icon">
            <use href="${icons}#arrow-left-thick"></use>
        </svg>
      </button>
      ${
        this._showCurrentPage ? `<p class="pagination__current-page">Current page: <span class="pagination__page">${data.currentPage}</span></p>` : ""
      }
      
      <button class="pagination__next btn ${data.currentPage === data.totalPages ? "btn--disabled" : ""}">
        <svg class="pagination__icon">
            <use href="${icons}#arrow-right-thick"></use>
        </svg>
      </button>
    </div>
    `;
  }

  getMarkup(data) {
    return this._generateMarkup(data);
  }
}
