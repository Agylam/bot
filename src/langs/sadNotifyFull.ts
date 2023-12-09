export const sadNotifyFull = (temp?: string, wind?: string) => {
    return `❌ Актировки нет!\nТемпература ${temp ||"Неизвестно"}°C, ветер ${wind ||"Неизвестно"} м/сек.`
}
