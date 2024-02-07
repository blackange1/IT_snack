const colors = {
    'blue': '#235ecd',
    'grey': '#605f62',
    'orange': '#ffbd00'
}

export default colors

export const lineOfCode = {
    count: 6,
    defaultText: function (language = 'python') {
        console.log('this', this)
        let arr = []
        for (let i = 0; i < this.count; i++) {
            arr.push('\n')
        }
        return '# write code' + arr.join('')
    }
}