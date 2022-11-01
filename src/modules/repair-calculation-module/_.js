import Alpine from "alpinejs";
import cars from './cars.json'

//Стор с марками и моделями машин

Alpine.store('cars', {
    data: [],//Весь файл
    models: [],
    currentCarModels: [],//Модели выбраной марки
    selectedBrand: '',
    selectedModel: '',

    init () {
        this.data = cars
        this.models = Array.from(Object.keys(cars.list))
    },

    getFullCarName() {
        return `${this.selectedBrand} ${this.selectedModel}`
    },
})

Alpine.store('currentStation', {
    data: '',
})

//Стор с элементами
Alpine.store('calculationModuleCheckedElements', {
    data: [],
    calculatedCost: [],

    values: [],
    reactiveObjects: [],

    init () {
        this.createReactiveElemsAndEffect()
        this.createArrayObserverAndEffect()

        this.values.forEach(item => item.setAttribute('x-data', ''))

        setTimeout(() => {
            this.values.forEach(item => item.setAttribute('x-on:click', '$store.calculationModuleCheckedElements.clickHandler'))
        }, 300)

        this.values.forEach(item => {item.querySelector('.repair-calculation-switcher-dropdown-item__price').setAttribute('x-text', '$store.calculationModuleCheckedElements.getCost')})
    },

    createReactiveElemsAndEffect() {
        Array.from(document.querySelectorAll('.js-calculation-item')).forEach(item => {this.values.push(item)})
        let idName = 'uniqId'
        let uniqValues = [...new Set(this.values.map(a => parseInt(a.getAttribute(`${idName}`))))]
        uniqValues.forEach(value => {
            let currentElem = `.js-calculation-item[${idName}='${value}']`
            let obj = {
                elems: Array.from(document.querySelectorAll(`${currentElem}`)),
                checked: false,
                uniqId: value,
                cost: parseInt(document.querySelector(`${currentElem}`).getAttribute('data-cost')),
                name: document.querySelector(`${currentElem}`).querySelector('label').innerText,
                getFormattedCost() {
                    if (this.cost) {
                        return `${this.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`
                    } else {
                        return ' '
                    }
                },
            }
            if (isNaN(obj.cost)) {console.warn(`${(obj.name.toUpperCase())} WITH ID: ${(obj.uniqId)} does not cost field`)}
            this.reactiveObjects.push(obj)
        })

        this.reactiveObjects.forEach(reactiveObj => {
            Alpine.effect(() => {
                if (reactiveObj.checked === true) {
                    reactiveObj.elems.forEach(i => {i.querySelector('input').checked = true})
                    this.data.push(reactiveObj)
                } else {
                    reactiveObj.elems.forEach(i => {i.querySelector('input').checked = false})
                    let i = this.data.indexOf(reactiveObj)
                    if (i > -1) {
                        this.data.splice(i, 1)
                    }
                }
            })
        })
    },

    createArrayObserverAndEffect() {
        Alpine.effect(() => {
            if (this.data.length) {
                this.calculatedCost = this.data.reduce((sum, current) =>
                  isNaN(sum + parseInt(current.cost)) ?  sum : sum + parseInt(current.cost), 0)
                  .toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            } else {
                this.calculatedCost = 0
            }
        })
    },

    clickHandler (e) {
        e.preventDefault()
        let value = parseInt(e.currentTarget.getAttribute('uniqId'))

        this.$store.calculationModuleCheckedElements.reactiveObjects.forEach(item => {
            if (item.uniqId === value) {
                item.checked = !item.checked
            }
        })
    },

    getCost() {
        let cost = this.$el.closest('.js-calculation-item').getAttribute('data-cost')
        if (cost){
            return `${cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`
        } else {
            return ``
        }
    },
})

Alpine.data('repairCalculationModule', () => ({

    stations: [],
    hiddenBlocks: [],

    init() {
        this.hideBlocksIfNothingChecked()
        this.chooseFirstCarBrandFromCarStore()
        Array.from(this.$el.querySelectorAll('.js-station')).forEach(item => this.stations.push(item))
        Array.from(this.$el.querySelectorAll('.js-calculate-nothing-checked')).forEach(item => this.hiddenBlocks.push(item))
        this.stations.forEach(station => {
            this.$nextTick(() => {
                station.setAttribute('x-on:click', 'clickBehavior(); selectStation()')
            })
        })
    },

    hideBlocksIfNothingChecked () {
        Alpine.effect(() => {
            this.$store.calculationModuleCheckedElements.data.length > 0 ?
              this.hiddenBlocks.forEach(block => block.style.display = 'none') :
              this.hiddenBlocks.forEach(block => block.style.display = 'flex')
        })
    },

    selectStation() {
        this.$store.currentStation.data = this.$el.innerText
    },

    clickOnBrand () {
        this.$store.cars.currentCarModels = []
        let brandId = this.$el.getAttribute('data-brand')

        if (this.$store.cars.data.list.hasOwnProperty(brandId)) {
            this.$store.cars.data.list[brandId].forEach(item => {
                this.$store.cars.currentCarModels.push(item)
            })
            let firstElFromThisBrandModels = this.$store.cars.currentCarModels[0]
            this.$store.cars.selectedBrand = `${brandId}`
            setTimeout(() => {
                let firstEl = this.$el.closest('.js-calculation-module').querySelector(`.repair-calculation-switcher-menu__item[data-model='${firstElFromThisBrandModels}']`)
                if (firstEl) {
                    firstEl.click()
                }
            }, 0)
        } else {
            return false
        }
    },

    clickOnModel() {
        let modelId = this.$el.getAttribute('data-model')
        this.$store.cars.selectedModel = `${modelId}`
    },

    chooseFirstCarBrandFromCarStore() {
        Alpine.effect(() => {
            if (this.$store.cars.data.list) {
                let carKeys = Object.keys(this.$store.cars.data.list)
                setTimeout(() => {
                    let firstEl = this.$el.querySelector(`.repair-calculation-switcher-menu__item[data-brand = '${carKeys[0]}']`)
                    if (firstEl) {
                        firstEl.click()
                    }
                })
            }
        })
    },
}))
