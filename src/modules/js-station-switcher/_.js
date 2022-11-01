document.addEventListener('DOMContentLoaded', () => {

    let containerInCalculator;
    let containerInModal;

    function changeMap() {

        let checkedStationCoords = JSON.parse(this.getAttribute('data-coords'))
        let stationName = this.getAttribute('data-station-name')
        let stationAddress = this.getAttribute('data-station-address')
        let stationPhone = this.getAttribute('data-station-phone')

        ymaps.ready(init);

        function init() {

            if(containerInCalculator || containerInModal){
                containerInCalculator.destroy();
                containerInModal.destroy();
            }
            containerInCalculator = new ymaps.Map('changeStation', {center: checkedStationCoords.position, zoom: 16,});
            containerInCalculator.behaviors.disable('scrollZoom');
            myPlacemark = new ymaps.Placemark(checkedStationCoords.position, {
                    hintContent: stationName,
                    balloonContent: `<p><b>${stationAddress}</b></p><p>Тел.: ${stationPhone}</p>`
            })
            containerInCalculator.geoObjects.add(myPlacemark);

            containerInModal = new ymaps.Map('changeStationInModal', {center: checkedStationCoords.position, zoom: 16,});
            containerInModal.behaviors.disable('scrollZoom');
            myPlacemark = new ymaps.Placemark(checkedStationCoords.position, {
                hintContent: stationName,
                balloonContent: `<p><b>${stationAddress}</b></p><p>Тел.: ${stationPhone}</p>`
            })
            containerInModal.geoObjects.add(myPlacemark);
        }
    }

    document.querySelectorAll('.js-station[data-station]').forEach((item, i) => {
        item.addEventListener('click', changeMap)
        if (i === 0) {
            item.click()
        }
    })
})
