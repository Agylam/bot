import {NtpTimeSync} from "ntp-time-sync";

const timeSync = NtpTimeSync.getInstance();
export const getTime = async () => {
    let now = new Date();
    try {
        const ntpTime = await timeSync.getTime();
        now = ntpTime.now;
    } catch (e) {
        console.error('NTP', e);
    }
    const hour = now.getHours();
    const minute = now.getMinutes();
    const seconds = now.getSeconds();
    const day = now.getDay();

    return {hour, minute, seconds, day};
};
