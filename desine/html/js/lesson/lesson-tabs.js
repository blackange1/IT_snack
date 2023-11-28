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
        MIN_Z_INDEX:20,
        render() {
            const tabsBody = document.querySelector('.tabs__body')
            const dataLength = this.data.length
            tabsBody.innerHTML = ''
            for (let index = dataLength - 1; index >= 0; index--) {
                const element = this.data[index];
                print(element)
                tabsBody.innerHTML += `<div class="tabs__item">${this.data[index].name}</div>`
            }
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