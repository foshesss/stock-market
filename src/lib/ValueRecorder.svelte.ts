import config from "./config";

type DailyValueData = {
    minute5Value: number[],
    hourlyValue: number[],
    high: number,
    low: number,
    open: number,
    close: number,
}

// Private functions
function getTime(t: number) {
    const totalMinutes = t * config.MINUTES_PER_STEP;
    const totalHours = Math.floor(totalMinutes / config.MINUTES_PER_HOUR);
    const day = Math.floor(totalHours / config.HOURS_PER_DAY);
    const hour = totalHours % config.HOURS_PER_DAY;
    const minute = totalMinutes % config.MINUTES_PER_HOUR;

    return { day, hour, minute };
}

// Class definition
class ValueRecorder {
    value: number = $state(100);

    currentDailyData: DailyValueData;
    dailyData: DailyValueData[];

    constructor(startValue: number | null) {
        if (startValue != null) this.value = startValue;

        this.currentDailyData = {
            minute5Value: [this.value],
            hourlyValue: [this.value],
            high: this.value,
            low: this.value,
            open: this.value,
            close: this.value,
        }
        this.dailyData = [this.currentDailyData]
    }

    step(t: number) {
        let { day, hour, minute } = getTime(t);

        // if this day doesn't exist right now, make it exist
        if (!this.dailyData[day]) {
            this.dailyData[day] = {
                minute5Value: [],
                hourlyValue: [],
                high: this.value,
                low: this.value,
                open: this.value,
                close: this.value,
            }
            this.currentDailyData = this.dailyData[day]
        }

        // update stats about the day
        this.currentDailyData.close = this.value;
        this.currentDailyData.high = Math.max(this.currentDailyData.high, this.value);
        this.currentDailyData.low = Math.min(this.currentDailyData.low, this.value);

        // update prices for each segment
        this.currentDailyData.minute5Value[Math.round(minute/config.MINUTES_PER_STEP) + hour * config.MINUTES_PER_HOUR/config.MINUTES_PER_STEP] = this.value;
        this.currentDailyData.hourlyValue[hour] = this.value;
    }
}

export default ValueRecorder;