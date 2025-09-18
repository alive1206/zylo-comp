import dayjs from "dayjs";
import { useEffect, useState } from "react";

type Props = {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  countdownFormat?: "dd:hh:mm:ss" | "hh:mm:ss" | "hh:mm" | "mm:ss";
  isShowCountdown?: boolean;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const Countdown: React.FC<Props> = ({
  startDate,
  endDate,
  startTime,
  endTime,
  countdownFormat = "dd:hh:mm:ss",
  isShowCountdown = true,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!endDate || !endTime) return;

    const calculateTimeLeft = () => {
      const targetDateTime = dayjs(`${endDate} ${endTime}`);
      const now = dayjs();

      const difference = targetDateTime.diff(now);

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();

    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endDate, endTime]);

  const formatTime = (time: number) => {
    return time.toString().padStart(2, "0");
  };

  if (
    !timeLeft ||
    dayjs(`${startDate} ${startTime}`).isAfter(dayjs()) ||
    dayjs(`${endDate} ${endTime}`).isBefore(dayjs()) ||
    !isShowCountdown
  )
    return null;

  const { days, hours, minutes, seconds } = timeLeft;

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center px-3 py-2 rounded-lg bg-gradient-glow">
      <span className="text-2xl font-bold text-primary">
        {formatTime(value)}
      </span>
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </span>
    </div>
  );

  const Separator = () => (
    <div className="text-2xl font-bold text-primary">:</div>
  );

  switch (countdownFormat) {
    case "hh:mm:ss":
      const totalHours = days * 24 + hours;
      return (
        <div className="flex flex-col items-center">
          <p className="font-bold">Hurry! Offer ends in</p>
          <div className="flex">
            <div className="flex flex-col items-center">
              <p className="text-2xl ">{formatTime(totalHours)}</p>
              <p className="text-xs">HRS</p>
            </div>
            <div className="mx-2 text-2xl">:</div>
            <div className="flex flex-col items-center">
              <p className="text-2xl ">{formatTime(minutes)}</p>
              <p className="text-xs">MINS</p>
            </div>
            <div className="mx-2 text-2xl">:</div>
            <div className="flex flex-col items-center">
              <p className="text-2xl ">{formatTime(seconds)}</p>
              <p className="text-xs">SECS</p>
            </div>
          </div>
        </div>
      );
    case "hh:mm":
      const totalHoursOnly = days * 24 + hours;
      return (
        <div className="flex flex-col items-center">
          <p className="font-bold mb-1">Hurry! Offer ends in</p>
          <div className="flex items-center gap-2">
            <TimeUnit value={totalHoursOnly} label="HRS" />
            <Separator />
            <TimeUnit value={minutes} label="MINS" />
            <Separator />
            <TimeUnit value={seconds} label="SECS" />
          </div>
        </div>
      );
    case "mm:ss":
      const totalMinutes = days * 24 * 60 + hours * 60 + minutes;
      return (
        <div className="flex flex-col items-center">
          <p className="font-bold mb-1">Hurry! Offer ends in</p>
          <div className="flex items-center gap-2">
            <TimeUnit value={totalMinutes} label="MINS" />
            <Separator />
            <TimeUnit value={seconds} label="SECS" />
          </div>
        </div>
      );
    default: // "dd:hh:mm:ss"
      return (
        <div className="flex flex-col items-center">
          <p className="font-bold mb-1">Hurry! Offer ends in</p>
          <div className="flex items-center gap-2">
            <TimeUnit value={days} label="DAYS" />
            <Separator />
            <TimeUnit value={hours} label="HRS" />
            <Separator />
            <TimeUnit value={minutes} label="MINS" />
            <Separator />
            <TimeUnit value={seconds} label="SECS" />
          </div>
        </div>
      );
  }
};
