import Alpine from "alpinejs";

Alpine.data('collapse', () => ({

    isOpen: false,

    init() {
        this.$el.querySelector('.js-collapse__input').setAttribute('x-on:click', 'collapse')
    },

    open() {
        this.isOpen = true
        this.$el.closest('.js-collapse').classList.add('js-collapse--active')
        let collapseContent = this.$el.closest('.js-collapse').querySelector('.js-collapse__content')
        let contentScrollHeight = this.$el.closest('.js-collapse').querySelector('.js-collapse__content').scrollHeight
        collapseContent.classList.add('js-collapse__content--active')
        collapseContent.style.maxHeight = `${contentScrollHeight}px`
    },

    close() {
        this.isOpen = false
        this.$el.closest('.js-collapse').classList.remove('js-collapse--active')
        let collapseContent = this.$el.closest('.js-collapse').querySelector('.js-collapse__content')
        collapseContent.style.maxHeight = `0px`
    },

    collapse() {
        this.isOpen ? this.close() : this.open()
    },

}))
