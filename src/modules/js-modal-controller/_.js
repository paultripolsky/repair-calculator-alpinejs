import Alpine from "alpinejs";

Alpine.store('modalController', {
    modals: Array.from(document.querySelectorAll('.modal')),
    triggers: Array.from(document.querySelectorAll('.js-modal-trigger')),
    closeButtons: Array.from(document.querySelectorAll('.js-modal-close')),
    modalsContent: Array.from(document.querySelectorAll('.modal__content')),
    modalObjects: [],

    init () {
        this.modals.forEach(modal => {this.modalObjects.push({element: modal, isOpen: false, modalId: modal.getAttribute('data-modal')})})
        console.log(this.modals)
        this.triggers.forEach(trigger => {trigger.setAttribute('x-data', ''); trigger.setAttribute('x-on:click.stop', '$store.modalController.openOrClose')})
        this.closeButtons.forEach(button => {button.setAttribute('x-data', ''); button.setAttribute('x-on:click.stop', '$store.modalController.openOrClose')})
        this.modalsContent.forEach(content => {content.setAttribute('x-data', ''); content.setAttribute('x-on:click.outside', '$store.modalController.clickOutside')})

        Alpine.effect(() => {
            this.modalObjects.forEach(modal => {modal.isOpen ? modal.element.classList.add('modal--active') : modal.element.classList.remove('modal--active')})
            let modalObjectsIncludesOpenModal = this.modalObjects.some(el => el.isOpen === true)
            modalObjectsIncludesOpenModal ?  document.body.classList.add('body--unscroll') : document.body.classList.remove('body--unscroll')
        })
    },

    openOrClose(e) {
        let modal = this.$store.modalController.modalObjects.find(modal => modal.modalId === e.currentTarget.getAttribute('data-modal'))
        modal.isOpen =! modal.isOpen
    },

    clickOutside(e) {
        if (!e.target.closest('.modal__content')) {
            let modal = this.$store.modalController.modalObjects.find(modal => modal.modalId === e.target.closest('.modal').getAttribute('data-modal'))
            modal.isOpen = false
        }
    }
})
