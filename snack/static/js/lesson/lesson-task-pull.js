document.addEventListener("DOMContentLoaded", function () {
    const print = console.log
    const $body = document.querySelector('body')
    const ORDER_ITEM_MATGIN = 20
    const deleyMove = 0.0
    // const deleyStep = 0

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
                const orderItem = new OrderItem(NodeList[index], this, index)
                this.orderItems.push(orderItem)
                print(orderItem.viewMain)
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
        }
    }

    class OrderItem {
        constructor(elem, orderList, position = 0) {
            this.orderList = orderList
            // this.position = position
            this.viewMain = elem
            this.viewPull = elem.querySelector('.order__pull')
            this.height = this.viewMain.offsetHeight
            this.viewPull.onmousedown = this.orderPullOnmousedown.bind(this)
            this.viewPull.onmouseup = this.orderItemOnmouseup.bind(this)
            // obj OrderItem
            this.nextItem = undefined
            this.lastItem = undefined
            this.bottom = 0

            this.elemX = 0
            this.elemY = 0
            this.cursorOldX = 0
            this.cursorOldY = 0
        }
        orderPullOnmousedown = function (event) {
            this.viewMain.style.zIndex = 500;
            buffer.currentPositionY = this.bottom

            this.cursorOldX = event.clientX
            this.cursorOldY = event.clientY


            buffer.nextItemPositionY = - (ORDER_ITEM_MATGIN - this.bottom)
            buffer.lastItemPositionY = ORDER_ITEM_MATGIN + this.bottom

            this.viewMain.style.transition = `bottom ${deleyMove}s, right ${deleyMove}s`

            // add bing
            document.onmousemove = this.documentOnmousemove.bind(this)
        }

        documentOnmousemove = function (e) {
            
            this.elemX += this.cursorOldX - e.clientX
            this.cursorOldX = e.clientX
            this.elemY += this.cursorOldY - e.clientY
            buffer.vectorY = this.cursorOldY - e.clientY
            this.cursorOldY = e.clientY
            $body.style.userSelect = 'none'
            this.bottom = this.elemY

            this.viewMain.style.bottom = this.elemY + 'px'
            this.viewMain.style.right = this.elemX + 'px'

            // DOWN
            if (buffer.vectorY < 0 && this.nextItem && this.elemY < buffer.nextItemPositionY) {
                const bottom = this.nextItem.bottom
                this.nextItem.bottom = bottom + this.height + ORDER_ITEM_MATGIN
                this.nextItem.viewMain.style.bottom = this.nextItem.bottom + 'px'
                // this.nextItem.viewMain.setAttribute('data-bottom', this.nextItem.bottom)
                buffer.currentPositionY += - (this.nextItem.height + ORDER_ITEM_MATGIN)

                const currentLastItem = this.lastItem
                const nextItem = this.nextItem
                nextItem.elemY = this.nextItem.bottom

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
                
                buffer.nextItemPositionY = buffer.currentPositionY - ORDER_ITEM_MATGIN
                buffer.lastItemPositionY = buffer.currentPositionY + ORDER_ITEM_MATGIN
            } else {
                // UP
                if (buffer.vectorY > 0 && this.lastItem && this.elemY > buffer.lastItemPositionY) {
                    const bottom = this.lastItem.bottom
                    this.lastItem.bottom = bottom - (this.height + ORDER_ITEM_MATGIN)
                    this.lastItem.viewMain.style.bottom = this.lastItem.bottom + 'px'
                    // this.lastItem.viewMain.setAttribute('data-bottom', this.lastItem.bottom)
                    buffer.currentPositionY += (this.lastItem.height + ORDER_ITEM_MATGIN)

                    const currentNextItem = this.nextItem
                    const lastItem = this.lastItem
                    lastItem.elemY = this.lastItem.bottom

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
                }
            }
            // print(this.elemX, this.elemY)
        }

        orderItemOnmouseup() {
            document.onmousemove = undefined
            this.bottom = buffer.currentPositionY
            this.viewMain.style.bottom = this.bottom + 'px'
            this.viewMain.style.right = 0 + 'px'
            this.elemX = 0
            this.elemY = this.bottom
            this.viewMain.style.transition = 'bottom 0.5s, right 0.5s'
            const obj = this
            
            setTimeout(() => {
                obj.viewMain.style.zIndex = 0
            }, 500)
            $body.style.userSelect = 'auto'


        }

        // DELETE METHOD
        static getBottom(str) {
            if (str.includes('px')) {
                return +(str.replace('px', ''))
            }
            return 0
        }

    }
//    const orderList = document.querySelector('.order__list')
//    const tmp = new OrderList(orderList)
//    print('tmp', tmp)
});