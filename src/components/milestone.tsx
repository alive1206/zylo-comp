"use client";

import { useState, useMemo } from "react";
import { IconDelivery } from "./icon-delivery";
import { IconGift } from "./icon-gift";
import { IconTag } from "./icon-tag";
import { Countdown } from "./countdown";
import { map } from "es-toolkit/compat";

const mockMilestone = [
  {
    id: "1",
    spendGoal: 6,
    type: "gift",
  },
  {
    id: "2",
    spendGoal: 180,
    type: "tag",
  },
  {
    id: "3",
    spendGoal: 360,
    type: "delivery",
  },
  {
    id: "3",
    spendGoal: 3600,
    type: "delivery",
  },
];
export const Milestone = () => {
  const [currentAmount, setCurrentAmount] = useState(0);

  const maxSpendGoal = useMemo(() => {
    return Math.max(...map(mockMilestone, (i) => i.spendGoal));
  }, []);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentAmount(Number(e.target.value));
  };

  return (
    <div className="tw:flex tw:flex-col tw:p-16 tw:items-center tw:w-full ">
      <div className="tw:flex tw:flex-col tw:p-16 tw:items-center tw:w-full tw:gap-16">
        <Countdown
          startDate="2025-09-11"
          endDate="2025-09-11"
          startTime="15:00"
          endTime="18:00"
          countdownFormat="dd:hh:mm:ss"
        />

        <div className="tw:w-full tw:h-3 tw:rounded-full tw:relative tw:bg-[#ECECEC]">
          <div
            className="tw:h-full tw:bg-[#1e40af] tw:rounded-full tw:transition-all tw:duration-300"
            style={{
              width: `${(currentAmount / maxSpendGoal) * 100}%`,
            }}
          />
          {map(mockMilestone, (milestone) => {
            const leftPercentage = (milestone?.spendGoal / maxSpendGoal) * 100;
            const isReached = currentAmount >= milestone?.spendGoal;

            return (
              <div
                key={milestone?.id}
                className="tw:rounded-full tw:h-10 tw:w-10 tw:absolute tw:top-1/2 tw:-translate-y-1/2 tw:-translate-x-1/2 tw:z-10 tw:flex tw:items-center tw:justify-center"
                style={{
                  left: `${leftPercentage}%`,
                  backgroundColor: isReached ? "#1e40af" : "#FFFFFF",
                  border: isReached ? "none" : "1px solid #C6C6C6",
                }}
              >
                {milestone?.type === "gift" ? (
                  <IconGift color={isReached ? "#FFFFFF" : "#9F9F9F"} />
                ) : milestone?.type === "tag" ? (
                  <IconTag
                    className="tw:rotate-90"
                    color={isReached ? "#FFFFFF" : "#9F9F9F"}
                  />
                ) : (
                  <IconDelivery color={isReached ? "#FFFFFF" : "#9F9F9F"} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="tw:flex tw:flex-col tw:gap-2 tw:w-full tw:relative">
        <div>Cart total</div>
        <div className="tw:w-full tw:flex tw:gap-1 tw:items-center">
          <input
            type="range"
            className="tw:w-full"
            min="0"
            max={maxSpendGoal}
            step="0.01"
            value={currentAmount}
            onChange={handleRangeChange}
          />
          <div>{currentAmount.toFixed(2)}EUR</div>
        </div>
        <div>Slide this to see changes in preview</div>
      </div>
    </div>
  );
};
