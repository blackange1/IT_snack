document.addEventListener("DOMContentLoaded", function () {
    const print = console.log
    const $body = document.querySelector('body')
    const ORDER_ITEM_MATGIN = 20
    const deleyMove = 0.0
    const deleyStep = 0

    const buffer = {
        nextItemPositionY: undefined,
        lastItemPositionY: undefined,
        currentPositionY: 0,
        vectorY: 0,
    }

    class OrderList {
        constructor(elem) {
            this.viewMain = elem
            const NodeList = elem.querySelectorAll('.order__item')
            this.orderItems = []
            for (let index = 0; index < NodeList.length; index++) {
                this.orderItems.push(new OrderItem(NodeList[index], this, index))
            }
            if (this.orderItems.length > 1) {
                for (let index = 1; index < this.orderItems.length - 1; index++) {
                    const orderItem = this.orderItems[index]
                    orderItem.nextItem = this.orderItems[index + 1]
                    orderItem.lastItem = this.orderItems[index - 1]
                }
                this.orderItems[0].nextItem = this.orderItems[1]
                this.orderItems[this.orderItems.length - 1].lastItem = this.orderItems[this.orderItems.length - 2]
            }
            print(this.orderItems)

        }

        calculatePosition() {

        }
    }

    class OrderItem {
        constructor(elem, orderList, position = 0) {
            this.orderList = orderList
            this.position = position
            this.viewMain = elem
            this.viewPull = elem.querySelector('.order__pull')
            this.height = this.viewMain.offsetHeight
            this.viewPull.onmousedown = this.orderPullOnmousedown.bind(this)
            this.viewMain.onmouseup = this.orderItemOnmouseup.bind(this)
            // obj OrderItem
            this.nextItem = undefined
            this.lastItem = undefined

            // this.k = 0
            this.elemX = 0
            this.elemY = 0
            this.cursorOldX = 0
            this.cursorOldY = 0
        }
        orderPullOnmousedown = function (event) {
            this.viewMain.style.zIndex = 500;
            this.cursorOldX = event.clientX
            this.cursorOldY = event.clientY
            // let elemHeight = this.viewMain.offsetHeight

            buffer.nextItemPositionY = - (ORDER_ITEM_MATGIN - OrderItem.getBottom(this.viewMain.style.bottom))
            buffer.lastItemPositionY = ORDER_ITEM_MATGIN + OrderItem.getBottom(this.viewMain.style.bottom)

            // this.viewMain.style.transition = 'all 0.2s linear 0s'
            // this.viewMain.style.transition = '1s transform'
            this.viewMain.style.transition = `bottom ${deleyMove}s, right ${deleyMove}s`

            // add bing
            document.onmousemove = this.documentOnmousemove.bind(this)
        }

        documentOnmousemove = function (e) {
            this.elemX += this.cursorOldX - e.clientX
            this.cursorOldX = e.clientX
            this.elemY += this.cursorOldY - e.clientY
            // print(this.cursorOldY, e.clientY)
            buffer.vectorY = this.cursorOldY - e.clientY
            // print('buffer.vectorY', buffer.vectorY)

            this.cursorOldY = e.clientY
            $body.style.userSelect = 'none'
            // this.k++

            // if (this.k > deleyStep) {
            // this.k = 0
            this.viewMain.style.bottom = this.elemY + 'px'
            this.viewMain.style.right = this.elemX + 'px'

            // DOWN
            if (buffer.vectorY < 0 && this.nextItem && this.elemY < buffer.nextItemPositionY) {
                // print('ops', this.nextItem.viewMain.style.bottom)
                // print('this.nextItem', this.nextItem)
                const bottom = OrderItem.getBottom(this.nextItem.viewMain.style.bottom)
                this.nextItem.viewMain.style.bottom = bottom + this.height + ORDER_ITEM_MATGIN + 'px'
                buffer.currentPositionY += - (this.nextItem.height + ORDER_ITEM_MATGIN)

                const currentLastItem = this.lastItem
                const nextItem = this.nextItem

                if (nextItem.nextItem) {
                    nextItem.nextItem.lastItem = this
                }
                if (this.lastItem) {
                    this.lastItem.nextItem = nextItem
                }

                this.nextItem = nextItem.nextItem
                this.lastItem = nextItem
                nextItem.nextItem = this
                nextItem.lastItem = currentLastItem
                

                // print('buffer.currentPositionY', buffer.currentPositionY)
                buffer.nextItemPositionY = buffer.currentPositionY - ORDER_ITEM_MATGIN
                buffer.lastItemPositionY = buffer.currentPositionY + ORDER_ITEM_MATGIN
                // print('buffer.lastItemPositionY', buffer.lastItemPositionY)

                // print('buffer.nextItemPositionY', buffer.nextItemPositionY)
                // print(this.elemX, this.elemY)

                // let t1
                // let t2
                // let t3
                // let t4
                // let t5
                // let t6
                // if (this.lastItem) {
                //     t1 = this.lastItem.viewMain
                //     if (this.lastItem.lastItem) {
                //         t3 = this.lastItem.lastItem.viewMain
                //     }
                //     if (this.lastItem.nextItem) {
                //         t4 = this.lastItem.nextItem.viewMain
                //     }

                // }
                // if (this.nextItem) {
                //     t2 = this.nextItem.viewMain
                //     if (this.nextItem.lastItem) {
                //         t5 = this.nextItem.lastItem.viewMain
                //     }
                //     if (this.nextItem.nextItem) {
                //         t6 = this.nextItem.nextItem.viewMain
                //     }
                // }
                // print('lastItem', t1)
                // print('lastItem.lastItem', t3)
                // print('lastItem.nextItem', t4)
                // print('nextItem', t2)
                // print('nextItem.lastItem', t5)
                // print('nextItem.nextItem', t6)
                // print('***')
            } else {
                // UP
                if (buffer.vectorY > 0 && this.lastItem && this.elemY > buffer.lastItemPositionY) {
                    // print('this.lastItem.viewMain.style.bottom', this.lastItem.viewMain.style.bottom)
                    const bottom = OrderItem.getBottom(this.lastItem.viewMain.style.bottom)
                    // print('bottom', bottom)
                    this.lastItem.viewMain.style.bottom = bottom - (this.height + ORDER_ITEM_MATGIN) + 'px'
                    buffer.currentPositionY += (this.lastItem.height + ORDER_ITEM_MATGIN)
                    // print('buffer.currentPositionY', buffer.currentPositionY)

                    const currentNextItem = this.nextItem
                    const lastItem = this.lastItem
                    if (lastItem.lastItem) {
                        lastItem.lastItem.nextItem = this
                    }
                    if (this.nextItem) {
                        this.nextItem.lastItem = lastItem
                    }

                    this.lastItem = lastItem.lastItem
                    this.nextItem = lastItem
                    lastItem.lastItem = this
                    lastItem.nextItem = currentNextItem

                    buffer.lastItemPositionY = buffer.currentPositionY + ORDER_ITEM_MATGIN
                    buffer.nextItemPositionY = buffer.currentPositionY - ORDER_ITEM_MATGIN
                    // print('buffer.lastItemPositionY', buffer.lastItemPositionY)
                    // print(this)
                    // let t1
                    // let t2
                    // if (this.lastItem) {
                    //     t1 = this.lastItem.viewMain
                    // }
                    // if (this.nextItem) {
                    //     t2 = this.nextItem.viewMain
                    // }
                    // print('t1', t1)
                    // print('t2', t2)
                    // print('|||')
                }
            }
            // }

            // print(this.elemX, this.elemY)

        }

        orderItemOnmouseup() {
            document.onmousemove = undefined
            // this.viewMain.style.bottom = 0 + 'px'
            this.viewMain.style.bottom = buffer.currentPositionY + 'px'
            this.viewMain.style.right = 0 + 'px'
            this.elemX = 0
            this.elemY = OrderItem.getBottom(this.viewMain.style.bottom)
            print('this.elemY', this.elemY)
            this.viewMain.style.transition = 'bottom 0.5s, right 0.5s'
            const obj = this
            setTimeout(() => {
                obj.viewMain.style.zIndex = 0
                let firstChildren = obj
                while (firstChildren.lastItem) {
                    firstChildren = firstChildren.lastItem
                    print('firstChildren', firstChildren.viewMain)
                }
                // firstChildren.remove()
                // nextElem

                // print('obj.orderList.viewMain', obj.orderList.viewMain.appendChild(firstChildren.viewMain))
            }, 500)
            $body.style.userSelect = 'auto'


        }

        static getBottom(str) {
            if (str.includes('px')) {
                return +(str.replace('px', ''))
            }
            return 0
        }

    }
    const orderList = document.querySelector('.order__list')
    const tmp = new OrderList(orderList)
    print('tmp', tmp)

    // const orderItem = document.querySelector('.order__item')
    // const orderPull = orderItem.querySelector('.order__pull')

    // const orderList = document.querySelector('.order__list')


    // let timerId = undefined
    // let elemX = 0
    // let elemY = 0
    // let cursorOldX = 0
    // let cursorOldY = 0
    // // print('orderPull', orderPull)
    // orderPull.onmousedown = function (event) {
    //     print('mousedown')
    //     let i = 1000
    //     print('orderItem.style.zIndex', orderItem.style.zIndex)
    //     orderItem.style.zIndex = 500;
    //     cursorOldX = event.clientX
    //     cursorOldY = event.clientY
    //     let elemHeight = orderItem.offsetHeight
    //     let tmp = true

    //     // if (timerId === undefined) {
    //     // timerId = setInterval(function (e) {
    //     //     // print('setInterval', i)
    //     //     // print('event clientX', event.clientX)
    //     //     print('event x', e)
    //     //     i++
    //     // }, 1000)
    //     let k = 0
    //     orderItem.style.transition = 'all 0.001s ease 0s'

    //     document.onmousemove = function (e) {
    //         elemX += cursorOldX - e.clientX
    //         cursorOldX = e.clientX
    //         elemY += cursorOldY - e.clientY
    //         cursorOldY = e.clientY
    //         $body.style.userSelect = 'none'
    //         // main
    //         // print(elemX, elemY)
    //         k++
    //         if (k > 4) {
    //             k = 0
    //             orderItem.style.bottom = elemY + 'px'
    //             orderItem.style.right = elemX + 'px'

    //         }

    //         // if (elemY <= -100) {
    //         //     print('Earth', Earth)
    //         //     print('change element Earth')
    //         //     Earth.style.transition = 'all 0.5s ease'
    //         //     Earth.style.top = -elemHeight - 20 + 'px'
    //         //     tmp = false
    //         //     // orderList.insertBefore(Earth, orderItem)
    //         //     // orderItem.style.bottom = 0 + 'px'
    //         //     // orderItem.style.right = 0 + 'px'
    //         //     // elemX = 0
    //         //     // elemY = 0
    //         // }
    //         // if (elemY <= -200) {
    //         //     print('Mars', Mars)
    //         //     print('change element Mars')
    //         //     Mars.style.top = -elemHeight - 20 + 'px'
    //         // }
    //         // main
    //     }
    //     // } else {
    //     //     clearInterval(timerId)
    //     //     timerId = undefined
    //     //     document.onmousemove = undefined
    //     //     orderItem.style.bottom = 0 + 'px'
    //     //     orderItem.style.right = 0 + 'px'
    //     //     elemX = 0
    //     //     elemY = 0
    //     //     orderItem.style.zIndex = 0
    //     //     orderItem.style.transition = 'all 0.5s ease'
    //     //     $body.style.userSelect = 'auto'
    //     // }
    // }

    // orderItem.onmouseup = function () {
    //     // clearInterval(timerId)
    //     // timerId = undefined
    //     document.onmousemove = undefined
    //     orderItem.style.bottom = 0 + 'px'
    //     orderItem.style.right = 0 + 'px'
    //     elemX = 0
    //     elemY = 0
    //     orderItem.style.zIndex = 0
    //     // orderItem.style.zIndex = 'none'
    //     orderItem.style.transition = 'all 0.5s ease'
    //     $body.style.userSelect = 'auto'
    // }

});