document.addEventListener("DOMContentLoaded", function () {
    const print = console.log

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
        MIN_Z_INDEX:20,
        
        render() {
            // const tabsBody = document.querySelector('.tabs__body')
            const dataLength = this.data.length
            this.root.innerHTML = ''
            for (let index = dataLength - 1; index >= 0; index--) {
                const element = this.data[index];
                print(element)
                const div = document.createElement('div')
                div.classList.add('tabs__item')
                div.textContent = this.data[index].name
                this.items.push(div)
                this.root.appendChild(div)
            }
            this.items[0].classList.add('active')
        }
    }
    tabs.render()

    const ements = document.querySelectorAll(".tabs__item")
    for (const ement of ements) {
        ement.onclick = function () {
            print(this)
            this.style.zIndex = '1';

        }
    }
});