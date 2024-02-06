limit = 100
i = 1
for a in range(1, limit):
    for b in range(a, limit):
        c = (a ** 2 + b ** 2) ** .5
        if c < 100:
            c_int = int(c)
            if c_int == c:
                print(f'{i} ({a}, {b}, {c_int})')
                i += 1
        else:
            break
