export const menuText = (city?: string, userClass?: string, shift?: number) => {
    return `🚀 Меню:
⛪️ Ваш муниципалитет (город) :  ${city || "Не установлен"}
🏫 Ваш класс: ${userClass || "Не установлен"}
📚 Ваша смена: ${shift === undefined ?  "Не установлена" : (shift === 1? "первая" : "вторая")}
Если обнаружите проблемы - обращайтесь. @mimbol`
}
