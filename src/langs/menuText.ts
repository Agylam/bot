export const menuText = (city?: string, userClass?: string, shift?: number) => {
    return `Меню:
Ваш муниципалитет: ${city || "Не установлен"}
Ваш класс: ${userClass || "Не установлен"}
Ваша смена: ${shift || "Не установлена"}`
}
