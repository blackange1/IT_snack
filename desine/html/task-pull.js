document.addEventListener("DOMContentLoaded", function () {
    const print = console.log
    const body = document.querySelector('body')

    class OrderList {
        constructor(elem) {
            this.viewMain = elem
            print('elem', elem)
            const NodeList = elem.querySelectorAll('.order__item')
            // print(NodeList)
            this.orderItems = []
            for (let index = 0; index < NodeList.length; index++) {
                // this.orderItems.push(NodeList[index])
                this.orderItems.push(new OrderItem(NodeList[index], index))
            }
            print('this.orderItems', this.orderItems)
        }
    }

    class OrderItem {
        constructor(elem, position = 0) {
            this.position = position
            this.viewMain = elem
            this.viewPull = elem.querySelector('.order__pull')
            this.height = this.viewMain.offsetHeight
            // print(elem)
            this.viewPull.onmousedown = this.orderPullOnmousedown.bind(this)

        }
        orderPullOnmousedown = function (event) {
            print('mousedown')
            let i = 1000
            print('this.viewMain.style.zIndex', this)
            this.viewMain.style.zIndex = 500;
            cursorOldX = event.clientX
            cursorOldY = event.clientY
            let elemHeight = this.viewMain.offsetHeight
            let k = 0
            this.viewMain.style.transition = 'all 0.001s ease 0s'

            // add bing
            document.onmousemove = function (e) {
                elemX += cursorOldX - e.clientX
                cursorOldX = e.clientX
                elemY += cursorOldY - e.clientY
                cursorOldY = e.clientY
                body.style.userSelect = 'none'
                print(elemX, elemY)
                k++
                if (k > 4) {
                    k = 0
                    print('this.viewMain', this)
                    this.viewMain.style.bottom = elemY + 'px'
                    this.viewMain.style.right = elemX + 'px'
                }
            }
        }


    }
    const orderList = document.querySelector('.order__list')
    new OrderList(orderList)

    const orderItem = document.querySelector('.order__item')
    const orderPull = orderItem.querySelector('.order__pull')

    // const orderList = document.querySelector('.order__list')


    let timerId = undefined
    let elemX = 0
    let elemY = 0
    let cursorOldX = 0
    let cursorOldY = 0
    // print('orderPull', orderPull)
    orderPull.onmousedown = function (event) {
        print('mousedown')
        let i = 1000
        print('orderItem.style.zIndex', orderItem.style.zIndex)
        orderItem.style.zIndex = 500;
        cursorOldX = event.clientX
        cursorOldY = event.clientY
        let elemHeight = orderItem.offsetHeight
        let tmp = true

        // if (timerId === undefined) {
        // timerId = setInterval(function (e) {
        //     // print('setInterval', i)
        //     // print('event clientX', event.clientX)
        //     print('event x', e)
        //     i++
        // }, 1000)
        let k = 0
        orderItem.style.transition = 'all 0.001s ease 0s'

        document.onmousemove = function (e) {
            elemX += cursorOldX - e.clientX
            cursorOldX = e.clientX
            elemY += cursorOldY - e.clientY
            cursorOldY = e.clientY
            body.style.userSelect = 'none'
            // main
            print(elemX, elemY)
            k++
            if (k > 4) {
                k = 0
                orderItem.style.bottom = elemY + 'px'
                orderItem.style.right = elemX + 'px'

            }

            // if (elemY <= -100) {
            //     print('Earth', Earth)
            //     print('change element Earth')
            //     Earth.style.transition = 'all 0.5s ease'
            //     Earth.style.top = -elemHeight - 20 + 'px'
            //     tmp = false
            //     // orderList.insertBefore(Earth, orderItem)
            //     // orderItem.style.bottom = 0 + 'px'
            //     // orderItem.style.right = 0 + 'px'
            //     // elemX = 0
            //     // elemY = 0
            // }
            // if (elemY <= -200) {
            //     print('Mars', Mars)
            //     print('change element Mars')
            //     Mars.style.top = -elemHeight - 20 + 'px'
            // }
            // main
        }
        // } else {
        //     clearInterval(timerId)
        //     timerId = undefined
        //     document.onmousemove = undefined
        //     orderItem.style.bottom = 0 + 'px'
        //     orderItem.style.right = 0 + 'px'
        //     elemX = 0
        //     elemY = 0
        //     orderItem.style.zIndex = 0
        //     orderItem.style.transition = 'all 0.5s ease'
        //     body.style.userSelect = 'auto'
        // }
    }
    orderItem.onmouseup = function () {
        // clearInterval(timerId)
        // timerId = undefined
        document.onmousemove = undefined
        orderItem.style.bottom = 0 + 'px'
        orderItem.style.right = 0 + 'px'
        elemX = 0
        elemY = 0
        orderItem.style.zIndex = 0
        // orderItem.style.zIndex = 'none'
        orderItem.style.transition = 'all 0.5s ease'
        body.style.userSelect = 'auto'
    }
});