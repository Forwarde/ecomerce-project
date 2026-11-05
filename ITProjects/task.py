def calculate_discount(price, age):
    # Ошибка 1: Если age < 18, переменная discount не определена (будет NameError).
    # Добавим обработку для младше 18 лет (скидка 0):
    if age >= 65:
        discount = 0.20
    elif age >= 18:
        discount = 0.10
    else:
        discount = 0.0  # Исправление первой проблемы для возраста < 18

    final_price = price - (price * discount)

    # Исправление второй проблемы: преобразуем float в str или используем f-строку
    print("Final price: " + str(final_price))
    # Или через f-строку (рекомендуемый способ в Python):
    # print(f"Final price: {final_price}")

    return final_price

print(calculate_discount(100, 70))  # Выведет: 80.0