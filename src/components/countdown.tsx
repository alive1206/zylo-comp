import dayjs from "dayjs";
import { useEffect, useState } from "react";

type Props = {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  countdownFormat?: "dd:hh:mm:ss" | "hh:mm:ss" | "hh:mm" | "mm:ss";
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
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!endDate || !endTime) return;

    const calculateTimeLeft = () => {
      const targetDateTime = dayjs(`${endDate} ${endTime}`);
      const now = dayjs();

      const difference = targetDateTime.diff(now);

      if (difference <= 0) {
        setIsExpired(true);
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
    isExpired ||
    dayjs(`${startDate} ${startTime}`).isAfter(dayjs())
  )
    return null;

  const { days, hours, minutes, seconds } = timeLeft;

  switch (countdownFormat) {
    case "hh:mm:ss":
      const totalHours = days * 24 + hours;
      return (
        <div className="tw:flex tw:flex-col tw:items-center">
          <p>Hurry! Offer ends in</p>
          <div className="tw:flex">
            <div className="tw:flex tw:flex-col tw:items-center">
              <p className="tw:text-2xl tw:font-bold">
                {formatTime(totalHours)}
              </p>
              <p className="tw:text-xs">HRS</p>
            </div>
            <div className="tw:mx-2 tw:text-2xl">:</div>
            <div className="tw:flex tw:flex-col tw:items-center">
              <p className="tw:text-2xl tw:font-bold">{formatTime(minutes)}</p>
              <p className="tw:text-xs">MINS</p>
            </div>
            <div className="tw:mx-2 tw:text-2xl">:</div>
            <div className="tw:flex tw:flex-col tw:items-center">
              <p className="tw:text-2xl tw:font-bold">{formatTime(seconds)}</p>
              <p className="tw:text-xs">SECS</p>
            </div>
          </div>
        </div>
      );
    case "hh:mm":
      const totalHoursOnly = days * 24 + hours;
      return (
        <div className="tw:flex tw:flex-col tw:items-center">
          <p>Hurry! Offer ends in</p>
          <div className="tw:flex">
            <div className="tw:flex tw:flex-col tw:items-center">
              <p className="tw:text-2xl tw:font-bold">
                {formatTime(totalHoursOnly)}
              </p>
              <p className="tw:text-xs">HRS</p>
            </div>
            <div className="tw:mx-2 tw:text-2xl">:</div>
            <div className="tw:flex tw:flex-col tw:items-center">
              <p className="tw:text-2xl tw:font-bold">{formatTime(minutes)}</p>
              <p className="tw:text-xs">MINS</p>
            </div>
          </div>
        </div>
      );
    case "mm:ss":
      const totalMinutes = days * 24 * 60 + hours * 60 + minutes;
      return (
        <div className="tw:flex tw:flex-col tw:items-center">
          <p>Hurry! Offer ends in</p>
          <div className="tw:flex">
            <div className="tw:flex tw:flex-col tw:items-center">
              <p className="tw:text-2xl tw:font-bold">
                {formatTime(totalMinutes)}
              </p>
              <p className="tw:text-xs">MINS</p>
            </div>
            <div className="tw:mx-2 tw:text-2xl">:</div>
            <div className="tw:flex tw:flex-col tw:items-center">
              <p className="tw:text-2xl tw:font-bold">{formatTime(seconds)}</p>
              <p className="tw:text-xs">SECS</p>
            </div>
          </div>
        </div>
      );
    default: // "dd:hh:mm:ss"
      return (
        <div className="tw:flex tw:flex-col tw:items-center">
          <p>Hurry! Offer ends in</p>
          <div className="tw:flex">
            <div className="tw:flex tw:flex-col tw:items-center">
              <p className="tw:text-2xl tw:font-bold">{formatTime(days)}</p>
              <p className="tw:text-xs">DAYS</p>
            </div>
            <div className="tw:mx-2 tw:text-2xl">:</div>
            <div className="tw:flex tw:flex-col tw:items-center">
              <p className="tw:text-2xl tw:font-bold">{formatTime(hours)}</p>
              <p className="tw:text-xs">HRS</p>
            </div>
            <div className="tw:mx-2 tw:text-2xl">:</div>
            <div className="tw:flex tw:flex-col tw:items-center">
              <p className="tw:text-2xl tw:font-bold">{formatTime(minutes)}</p>
              <p className="tw:text-xs">MINS</p>
            </div>
            <div className="tw:mx-2 tw:text-2xl">:</div>
            <div className="tw:flex tw:flex-col tw:items-center">
              <p className="tw:text-2xl tw:font-bold">{formatTime(seconds)}</p>
              <p className="tw:text-xs">SECS</p>
            </div>
          </div>
        </div>
      );
  }
};
