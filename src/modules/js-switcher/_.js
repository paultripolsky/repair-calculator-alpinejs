import Alpine from "alpinejs";

Alpine.data('switcher', () => ({

    isOpen: false,

    init () {
        this.$el.querySelector('.js-switcher__input').setAttribute('x-on:click', 'openSwitcher')
        this.$el.setAttribute('x-bind:class', 'isOpen ? "js-switcher--active" : "" ' )
        this.$el.querySelectorAll('.js-switcher__item').forEach(item => item.setAttribute('x-on:click', 'clickBehavior'))

        this.changeItemOnInput()
    },

    openSwitcher () {
        this.isOpen = true
        let switcherMenu = this.$el.closest('.js-switcher').querySelector('.js-switcher__menu')
            this.$nextTick(() => {switcherMenu.setAttribute('x-on:click.outside', 'closeSwitcher')})
    },

    closeSwitcher() {
        this.isOpen = false
        let switcherMenu = this.$el.closest('.js-switcher').querySelector('.js-switcher__menu')
        this.$nextTick(() => {switcherMenu.removeAttribute('x-on:click.outside', 'closeSwitcher')})
    },

    setActive() {
        this.$el.closest('.js-switcher').querySelectorAll('.js-switcher__item').forEach(item => {
            item.classList.remove('js-switcher__item--active')
        })
        this.$nextTick(() => {
            this.$el.classList.add('js-switcher__item--active')
            this.$el.closest('.js-switcher').querySelector('.js-switcher__input').innerText = `${this.$el.innerText}`
        })
    },

    clickBehavior () {
        if (this.$el.hasAttribute('data-switcher-stop-default-behavior')) {
            return false
        } else {
            this.closeSwitcher()
            this.setActive()
        }
    },

    changeItemOnInput () {
        let switcherItems = this.$el.querySelectorAll('.js-switcher__item')
        let switcherInput = this.$el.querySelector('.js-switcher__input')

        switcherItems.forEach(item  => {
            switcherInput.innerHTML === item.innerHTML ? item.classList.add('js-switcher__item--active') : item.classList.remove('js-switcher__item--active')
        })
    }
}))
