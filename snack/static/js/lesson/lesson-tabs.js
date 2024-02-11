document.addEventListener("DOMContentLoaded", function () {
    const tabs = {
        data: [
            {
                name: 'Теорія',
            },
            {
                name: 'Коментарі',
            },
            {
                name: "Розв\'язки",
            }
        ],
        root: document.querySelector('.tabs__body'),
        items: [],
        MAX_Z_INDEX: 22,

        render() {
            const dataLength = this.data.length
            // this.root.innerHTML = ''
            for (let index = dataLength - 1; index >= 0; index--) {
                const element = this.data[index]
                const div = document.createElement('div')
                div.classList.add('tabs__item')
                div.textContent = element.name
                this.setIndexZ(div, this.MAX_Z_INDEX - index)
                this.items.splice(0, 0, div)
                this.root.appendChild(div)
            }
            this.items[0].classList.add('active')
            for (const element of this.items) {
                // obj = this

                element.onclick = function () {
                    if (this.classList.contains('active')) {
                        return
                    }
                    const nowIndex = +this.dataset.zIndex
                    for (let index = 0; index < tabs.items.length; index++) {
                        const element = tabs.items[index];
                        if (element.classList.contains('active')) {
                            element.classList.remove('active')
                        }
                        if (element.dataset.zIndex > nowIndex) {
                            tabs.setIndexZ(element, +element.dataset.zIndex - 1)
                        }
                    }
                    tabs.setIndexZ(this, tabs.MAX_Z_INDEX)
                    this.classList.add('active')
                }
            }
        },
        setIndexZ(obj, value) {
            obj.dataset.zIndex = value
            obj.style.zIndex = value
        }

    }
    tabs.render()
});