with open('tools_GET_CSS_CLASS.html', 'r') as file:
    for line in file.readlines():
        _class = 'class="'
        if _class in line:
            start = line.index(_class) + 7
            line = line[start:]
            end = line.index('"')
            print('.' + line[:end] + ' {}')
