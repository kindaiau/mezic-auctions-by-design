import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: string;
}

export const CountdownTimer = ({ endTime }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  function calculateTimeLeft(endTime: string) {
    const difference = new Date(endTime).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  if (timeLeft.expired) {
    return <p className="text-red-600 text-sm font-semibold">Auction Ended</p>;
  }

  return (
    <div className="flex gap-2 justify-center items-center">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center">
          <span className="text-black text-lg font-bold">{timeLeft.days}</span>
          <span className="text-black/60 text-[10px] uppercase">Days</span>
        </div>
      )}
      {(timeLeft.days > 0 || timeLeft.hours > 0) && (
        <>
          {timeLeft.days > 0 && <span className="text-black/40">:</span>}
          <div className="flex flex-col items-center">
            <span className="text-black text-lg font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-black/60 text-[10px] uppercase">Hours</span>
          </div>
        </>
      )}
      <span className="text-black/40">:</span>
      <div className="flex flex-col items-center">
        <span className="text-black text-lg font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-black/60 text-[10px] uppercase">Mins</span>
      </div>
      <span className="text-black/40">:</span>
      <div className="flex flex-col items-center">
        <span className="text-black text-lg font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-black/60 text-[10px] uppercase">Secs</span>
      </div>
    </div>
  );
};
