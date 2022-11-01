import Alpine from "alpinejs";

Alpine.data('search', () => ({
    items: [],
    searchInput: '',
    searchResultsBlock: null,
    hiddenBlocks: [],
    searchResults: [],

    init () {
        this.searchResultsBlock = this.$el.querySelector('.js-search__results')
        if (this.$el.querySelectorAll('.js-search__hidden').length > 0) {
            this.$el.querySelectorAll('.js-search__hidden').forEach(i => this.hiddenBlocks.push(i))
        }

        this.$el.querySelector('.js-search__input').setAttribute('x-model', 'searchInput')
        this.showOrHideSearchResultBlock()
    },

     getSearchResults(array, key, event) {
        if (event.target.value.length > 0 && Array.isArray(array)) {
            key === null ? this.searchResults = array.filter(item => item
                    .toString()
                    .toLowerCase()
                    .includes(event.target.value.toString().toLowerCase())) :
                this.searchResults = array.filter(item => item[`${key}`]
                    .toString()
                    .toLowerCase()
                    .includes(event.target.value.toString().toLowerCase()))
        }
    },

    clickOnSearchResultItem () {
        this.$el.closest('.js-search').querySelector('.js-search__input').value = ''
    },

    showOrHideSearchResultBlock() {
        Alpine.effect(() => {
            if (this.searchInput.length > 0) {
                this.searchResultsBlock.style.display = 'block'
                this.hiddenBlocks.forEach(block => block.style.display = 'none')
            } else {
                this.searchResultsBlock.style.display = 'none'
                this.hiddenBlocks.forEach(block => block.style.display = 'block')
            }
        })
    },
}))
