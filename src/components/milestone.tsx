"use client";

import { useState, useMemo, useCallback } from "react";
import { IconDelivery } from "./icon-delivery";
import { IconGift } from "./icon-gift";
import { IconTag } from "./icon-tag";
import { Countdown } from "./countdown";
import { filter, includes, map } from "es-toolkit/compat";

type Props = {
  currency?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  countdownFormat?: string;
  isShowCountdown?: boolean;
};

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
    id: "4",
    spendGoal: 3600,
    type: "delivery",
  },
];
export const Milestone: React.FC<Props> = ({
  currency = "EUR",
  startDate = "2025-09-13",
  endDate = "2025-09-14",
  startTime = "15:00",
  endTime = "18:00",
  countdownFormat = "dd:hh:mm:ss",
  isShowCountdown = true,
}) => {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [selectedMilestone, setSelectedMilestone] = useState<String[]>([]);

  const isNextMilestone = useMemo(() => {
    return filter(mockMilestone, (m) => currentAmount < m.spendGoal)[0];
  }, [currentAmount]);

  const isMilestoneReached = useMemo(() => {
    return filter(mockMilestone, (m) => currentAmount >= m.spendGoal);
  }, [currentAmount]);

  const maxSpendGoal = useMemo(() => {
    return Math.max(...map(mockMilestone, (i) => i.spendGoal));
  }, []);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentAmount(Number(e.target.value));
  };

  return (
    <div className="tw:flex tw:flex-col tw:p-16 tw:items-center tw:w-full ">
      <div className="tw:flex tw:flex-col tw:p-16 tw:items-center tw:w-full tw:gap-4">
        <Countdown
          startDate={startDate}
          endDate={endDate}
          startTime={startTime}
          endTime={endTime}
          countdownFormat={
            countdownFormat as "dd:hh:mm:ss" | "hh:mm:ss" | "hh:mm" | "mm:ss"
          }
          isShowCountdown={isShowCountdown}
        />
        <div className="tw:text-base tw:font-bold">
          {isNextMilestone
            ? `You are ${(isNextMilestone?.spendGoal - currentAmount).toFixed(
                2
              )} ${currency} away from getting ${
                isNextMilestone?.type === "gift"
                  ? "free gift"
                  : isNextMilestone?.type === "tag"
                  ? "cart discount"
                  : "shipping discount"
              }`
            : "Congratulations! You've achieved all milestones"}
        </div>

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
              <div className="tw:group" key={milestone?.id}>
                <div
                  className={`tw:absolute tw:-top-8 tw:left-0 tw:-translate-x-1/2 tw:text-sm tw:group-hover:block ${
                    milestone?.id === isNextMilestone?.id
                      ? "tw:block"
                      : "tw:hidden"
                  }`}
                  style={{
                    left: `${leftPercentage}%`,
                  }}
                >
                  <div className="tw:flex tw:items-center tw:text-sm">
                    <span>{milestone?.spendGoal.toFixed(2)}</span>
                    <span>{currency}</span>
                  </div>
                </div>
                <div
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
                <div
                  className={`tw:absolute tw:top-8 tw:left-0 tw:-translate-x-1/2 tw:text-sm tw:group-hover:block ${
                    milestone?.id === isNextMilestone?.id
                      ? "tw:block"
                      : "tw:hidden"
                  }`}
                  style={{
                    left: `${leftPercentage}%`,
                  }}
                >
                  {milestone?.type === "gift"
                    ? "Free gift"
                    : milestone?.type === "tag"
                    ? "Cart discount"
                    : "Shipping discount"}
                </div>
              </div>
            );
          })}
        </div>

        <div className="tw:flex tw:flex-col tw:gap-2 tw:mt-16">
          {map(isMilestoneReached, (milestone) => {
            return (
              <div
                key={milestone?.id}
                style={{
                  borderTop: "1px solid #EBEBEB",
                  paddingTop: "8px",
                }}
              >
                <div className="tw:flex tw:justify-between tw:gap-16 tw:items-center">
                  <div className="tw:flex tw:flex-col tw:gap-1">
                    <div className="tw:font-bold">
                      {milestone?.type === "gift"
                        ? "Free gift"
                        : milestone?.type === "tag"
                        ? "Cart discount"
                        : "Shipping discount"}
                    </div>
                    <div>Congratulations! You have unlocked a reward!</div>
                  </div>
                  <button
                    className="tw:cursor-pointer tw:text-white tw:rounded-sm tw:p-[7px] tw:w-[40%] tw:text-sm"
                    onClick={() => {
                      setSelectedMilestone([
                        ...selectedMilestone,
                        milestone?.id,
                      ]);
                    }}
                    style={{
                      backgroundColor: !includes(
                        selectedMilestone,
                        milestone?.id
                      )
                        ? "#1e40af"
                        : "#d9cdcd",
                    }}
                  >
                    {!includes(selectedMilestone, milestone?.id)
                      ? milestone?.type === "gift"
                        ? "Select gifts"
                        : "Apply code"
                      : milestone?.type === "gift"
                      ? "Selected gifts"
                      : "Applied code"}
                  </button>
                </div>
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
          <div className="tw:flex tw:items-center tw:gap-1 tw:text-sm">
            <span>{currentAmount.toFixed(2)}</span>
            <span>{currency}</span>
          </div>
        </div>
        <div>Slide this to see changes in preview</div>
      </div>
    </div>
  );
};
